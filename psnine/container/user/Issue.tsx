import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableNativeFeedback,
  RefreshControl,
  InteractionManager,
  Slider,
  FlatList,
  Button
} from 'react-native'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

import { standardColor, idColor } from '../../constant/colorConfig'

import Ionicons from 'react-native-vector-icons/Ionicons'
import { getIssueAPI } from '../../dao'

import TopicItem from '../../component/CommunityItem'
import GeneItem from '../../component/GeneItem'
import TradeItem from '../../component/TradeItem'
import BattleItem from '../../component/BattleItem'
import QaItem from '../../component/QaItem'
const Mapper = {
  'topic': TopicItem,
  'gene' : GeneItem,
  'battle': BattleItem,
  'trade': TradeItem,
  'qa': QaItem
}
import FooterProgress from '../../component/FooterProgress'

let toolbarActions = [
  { title: '类型', iconName: 'md-funnel', show: 'always' },
  { title: '跳页', iconName: 'md-map', show: 'always' }
]

export default class Issue extends Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      numberPerPage: 60,
      numPages: 1,
      commentTotal: 1,
      currentPage: 1,
      isRefreshing: true,
      isLoadingMore: false,
      modalVisible: false,
      sliderValue: 1,
      typeModalVisible: false,
      type: 'topic', // gene psnid qa
      finalType: 'topic'
    }
  }

  onNavClicked = (rowData) => {
    const { navigation } = this.props
    navigation.goBack()
  }

  componentWillMount = async () => {
    const { params } = this.props.navigation.state
    this.fetchMessages(params.URL, 'jump')
  }

  fetchMessages = (url, type = 'down') => {
    this.setState({
      [type === 'down' ? 'isLoadingMore' : 'isRefreshing'] : true
    }, () => {
      InteractionManager.runAfterInteractions(() => {
        getIssueAPI(url, this.state.type).then(data => {
          let thisList = []
          const thisPage = parseInt((url.match(/\?page=(\d+)/) || [0, 1])[1])
          let cb = () => { }
          if (type === 'down') {
            thisList = this.state.list.concat(data.list)
            this.pageArr.push(thisPage)
          } else if (type === 'up') {
            thisList = this.state.list.slice()
            thisList.unshift(...data.list)
            this.pageArr.unshift(thisPage)
          } else if (type === 'jump') {
            // cb = () => this.listView.scrollTo({ y: 0, animated: true });
            thisList = data.list
            this.pageArr = [thisPage]
          }
          this.pageArr = this.pageArr.sort((a, b) => a - b)
          this.setState({
            list: thisList,
            numberPerPage: data.numberPerPage,
            numPages: data.numPages,
            commentTotal: data.len,
            currentPage: thisPage,
            isLoadingMore: false,
            isRefreshing: false,
            finalType: this.state.type
          }, cb)
        })
      })
    })
  }

  pageArr = [1]
  _onRefresh = () => {
    const { URL } = this.props.navigation.state.params
    const currentPage = this.pageArr[0] || 1
    let type = currentPage === 1 ? 'jump' : 'up'
    let targetPage = currentPage - 1
    if (type === 'jump') {
      targetPage = 1
    }
    if (this.pageArr.includes(targetPage)) type = 'jump'
    if (this.state.isLoadingMore || this.state.isRefreshing) return
    this.fetchMessages(URL.split('=').slice(0, -1).concat(targetPage).join('='), type)
  }

  _onEndReached = () => {
    const { URL } = this.props.navigation.state.params
    const currentPage = this.pageArr[this.pageArr.length - 1]
    const targetPage = currentPage + 1
    if (targetPage > this.state.numPages) return
    if (this.state.isLoadingMore || this.state.isRefreshing) return
    this.fetchMessages(URL.split('=').slice(0, -1).concat(targetPage).join('='), 'down')

  }

  onActionSelected = (index) => {
    switch (index) {
      case 0:
        this.setState({
          typeModalVisible: true
        })
      return
      case 1:
        this.setState({
          modalVisible: true
        })
      return
    }
  }

  ITEM_HEIGHT = 74 + 7

  _renderItem = ({ item: rowData, index }) => {
    const { modeInfo } = this.props.screenProps
    const { ITEM_HEIGHT } = this
    const { navigation } = this.props
    const Item = Mapper[this.state.finalType]
    // console.log(rowData)
    return <Item {...{
      navigation,
      rowData,
      modeInfo,
      ITEM_HEIGHT,
      modalList: [{
        text: '编辑',
        onPress: (rowData) => {
          const URL = rowData.edit
          requestAnimationFrame(() => {
            const target = ({
              'topic' : 'NewTopic',
              'gene' : 'NewGene',
              'battle' : 'NewBattle',
              'qa' : 'NewQa',
              'trade' : 'NewTrade'
            })[this.state.finalType]
            navigation.navigate(target, {
              URL
            })
          })
        }
      }]
    }} />
  }

  onValueChange = (key: string, value: string) => {
    const newState = {}
    newState[key] = value
    this.setState(newState)
  }

  sliderValue = 1
  render() {
    const { modeInfo } = this.props.screenProps
    const { params } = this.props.navigation.state
    // console.log('Message.js rendered');

    return (
      <View
        style={{ flex: 1, backgroundColor: modeInfo.background }}
        onStartShouldSetResponder={() => false}
        onMoveShouldSetResponder={() => false}
      >
        <Ionicons.ToolbarAndroid
          navIconName='md-arrow-back'
          overflowIconName='md-more'
          iconColor={modeInfo.isNightMode ? '#000' : '#fff'}
          title={'发布'}
          subtitle={TYPES[this.state.finalType]}
          style={[styles.toolbar, { backgroundColor: modeInfo.standardColor }]}
          titleColor={modeInfo.isNightMode ? '#000' : '#fff'}
          subtitleColor={modeInfo.isNightMode ? '#000' : '#fff'}
          actions={toolbarActions}
          onIconClicked={this.onNavClicked}
          onActionSelected={this.onActionSelected}
        />
        <FlatList style={{
          flex: 1,
          backgroundColor: modeInfo.background
        }}
          ref={flatlist => this.flatlist = flatlist}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this._onRefresh}
              colors={[modeInfo.accentColor]}
              progressBackgroundColor={modeInfo.backgroundColor}
              ref={ref => this.refreshControl = ref}
            />
          }
          ListFooterComponent={() => <FooterProgress isLoadingMore={this.state.isLoadingMore} modeInfo={modeInfo} />}
          data={this.state.list}
          keyExtractor={(item, index) => item.url || item.id || item.title}
          renderItem={this._renderItem}
          onEndReached={this._onEndReached}
          onEndReachedThreshold={0.5}
          extraData={modeInfo}
          windowSize={21}
          updateCellsBatchingPeriod={1}
          initialNumToRender={42}
          maxToRenderPerBatch={8}
          disableVirtualization={false}
          contentContainerStyle={styles.list}
          getItemLayout={(data, index) => (
            {length: this.ITEM_HEIGHT, offset: this.ITEM_HEIGHT * index, index}
          )}
          viewabilityConfig={{
            minimumViewTime: 1,
            viewAreaCoveragePercentThreshold: 0,
            waitForInteractions: true
          }}
        />
        {this.state.typeModalVisible && (
          <global.MyDialog modeInfo={modeInfo}
            modalVisible={this.state.typeModalVisible}
            onDismiss={() => { this.setState({ typeModalVisible: false }); this.isValueChanged = false }}
            onRequestClose={() => { this.setState({ typeModalVisible: false }); this.isValueChanged = false }}
            renderContent={() => (
              <View style={{
                justifyContent: 'center',
                alignItems: 'flex-start',
                backgroundColor: modeInfo.backgroundColor,
                position: 'absolute',
                paddingVertical: 20,
                left: 30,
                right: 30,
                paddingHorizontal: 20,
                elevation: 4,
                opacity: 1
              }} borderRadius={2}>
                <Text style={{ alignSelf: 'flex-start', fontSize: 18, color: modeInfo.titleTextColor }}>选择类型: </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 5 }}>
                  {
                    Object.keys(TYPES).map(value => ({
                      name: TYPES[value],
                      value
                    })).map((item, index) => {
                      return <View key={index} style={{margin: 2}}><Button key={index} onPress={() => {
                          this.setState({
                            type: item.value,
                            typeModalVisible: false,
                            isLoading: true
                          }, () => {
                            this.fetchMessages(params.URL, 'jump')
                          })
                        }} title={item.name} color={modeInfo.accentColor}/></View>
                    })
                  }
                </View>
              </View>
            )} />
        )}
        {this.state.modalVisible && (
          <global.MyDialog modeInfo={modeInfo}
            modalVisible={this.state.modalVisible}
            onDismiss={() => { this.setState({ modalVisible: false }); this.isValueChanged = false }}
            onRequestClose={() => { this.setState({ modalVisible: false }); this.isValueChanged = false }}
            renderContent={() => (
              <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: modeInfo.backgroundColor,
                paddingVertical: 20,
                paddingHorizontal: 40,
                elevation: 4,
                opacity: 1
              }} borderRadius={2}>
                <Text style={{ alignSelf: 'flex-start', fontSize: 18, color: modeInfo.titleTextColor }}>选择页数: {
                  this.isValueChanged ? this.state.sliderValue : this.state.currentPage
                }</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={{color: modeInfo.standardTextColor}}>{this.state.currentPage}</Text>
                  <Slider
                    maximumValue={this.state.numPages}
                    minimumValue={1}
                    maximumTrackTintColor={modeInfo.accentColor}
                    minimumTrackTintColor={modeInfo.standardTextColor}
                    thumbTintColor={modeInfo.accentColor}
                    style={{
                      paddingHorizontal: 90,
                      height: 50
                    }}
                    value={this.state.currentPage}
                    onValueChange={(value) => {
                      this.isValueChanged = true
                      this.setState({
                        sliderValue: Math.round(value)
                      })
                    }}
                  />
                  <Text style={{color: modeInfo.standardTextColor}}>{this.state.numPages}</Text>
                </View>
                <TouchableNativeFeedback onPress={() => {
                    this.setState({
                      modalVisible: false,
                      isLoading: true
                    }, () => {
                      const currentPage = this.state.currentPage
                      const targetPage = params.URL.split('=').slice(0, -1).concat(this.state.sliderValue).join('=')
                      this.fetchMessages(targetPage, 'jump')
                    })
                  }}>
                  <View style={{ alignSelf: 'flex-end', paddingHorizontal: 8, paddingVertical: 5 }}>
                    <Text style={{color: '#009688'}}>确定</Text>
                  </View>
                </TouchableNativeFeedback>
              </View>
            )} />
        )}
      </View>
    )
  }

}

const TYPES = {
  'topic' : '社区',
  'gene' : '机因',
  'battle' : '约战',
  'qa' : '问答',
  'trade' : '闲游'
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#F5FCFF'
  },
  toolbar: {
    backgroundColor: standardColor,
    height: 56,
    elevation: 4
  },
  selectedTitle: {
    //backgroundColor: '#00ffff'
    //fontSize: 20
  },
  avatar: {
    width: 50,
    height: 50
  },
  a: {
    fontWeight: '300',
    color: idColor // make links coloured pink
  }
})
