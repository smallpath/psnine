import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  RefreshControl,
  InteractionManager,
  FlatList
} from 'react-native'

import { standardColor, idColor } from '../../constant/colorConfig'

import Ionicons from 'react-native-vector-icons/Ionicons'
import { getBlockAPI as getAPI } from '../../dao'

import RankItem from '../../component/RankItem'

import FooterProgress from '../../component/FooterProgress'
import { block } from '../../dao/sync'

let toolbarActions = []

declare var global

class Fav extends Component<any, any> {
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
      typeModalVisible: false
    }
  }

  onNavClicked = () => {
    const { navigation } = this.props
    navigation.goBack()
  }

  componentWillMount() {
    const { params } = this.props.navigation.state
    this.fetchMessages(params.URL, 'jump')
  }

  fetchMessages = (url, type = 'down') => {
    this.setState({
      [type === 'down' ? 'isLoadingMore' : 'isRefreshing'] : true
    }, () => {
      InteractionManager.runAfterInteractions(() => {
        getAPI(url).then(data => {
          // console.log(data)
          let thisList: any = []
          const thisPage = parseInt((url.match(/\?page=(\d+)/) || [0, 1])[1], 10)
          let cb = () => { }
          if (type === 'down') {
            thisList = this.state.list.concat(data)
            this.pageArr.push(thisPage)
          } else if (type === 'up') {
            thisList = this.state.list.slice()
            thisList.unshift(...data)
            this.pageArr.unshift(thisPage)
          } else if (type === 'jump') {
            thisList = data.slice()
            this.pageArr = [thisPage]
          }
          this.pageArr = this.pageArr.sort((a, b) => a - b)
          this.setState({
            list: thisList,
            isLoadingMore: false,
            isRefreshing: false
          }, cb)
        })
      })
    })
  }

  pageArr = [1]
  _onRefresh = () => {
    const { params } = this.props.navigation.state
    this.fetchMessages(params.URL, 'jump')
  }

  ITEM_HEIGHT = 100

  _renderItem = ({ item: rowData }) => {
    const { modeInfo } = this.props.screenProps
    const { ITEM_HEIGHT } = this
    const { navigation } = this.props
    // console.log(rowData)
    return <RankItem {...{
      navigation,
      rowData,
      modeInfo,
      ITEM_HEIGHT,
      modalList: [{
        text: '取消屏蔽',
        onPress: () => {
          block({
            type: 'psnid',
            param: rowData && rowData.psnid,
            unblock: ''
          }).then(res => res.text()).then(() => {
            global.toast('已取消屏蔽')
            this._onRefresh()
          }).catch(err => {
            const msg = `取消屏蔽失败: ${err.toString()}`
            global.toast(msg)
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
          title={params.title || '屏蔽'}
          style={[styles.toolbar, { backgroundColor: modeInfo.standardColor }]}
          titleColor={modeInfo.isNightMode ? '#000' : '#fff'}
          actions={toolbarActions}
          onIconClicked={this.onNavClicked}
        />
        <FlatList style={{
          flex: 1,
          backgroundColor: modeInfo.background
        }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this._onRefresh}
              colors={[modeInfo.accentColor]}
              progressBackgroundColor={modeInfo.backgroundColor}
            />
          }
          ListFooterComponent={() => <FooterProgress isLoadingMore={this.state.isLoadingMore} modeInfo={modeInfo} />}
          data={this.state.list}
          keyExtractor={(item) => item.psnid}
          renderItem={this._renderItem}
          extraData={modeInfo}
          windowSize={21}
          updateCellsBatchingPeriod={1}
          initialNumToRender={42}
          maxToRenderPerBatch={8}
          disableVirtualization={false}
          viewabilityConfig={{
            minimumViewTime: 1,
            viewAreaCoveragePercentThreshold: 0,
            waitForInteractions: true
          }}
        />
      </View>
    )
  }

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
    // backgroundColor: '#00ffff'
    // fontSize: 20
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

export default Fav
