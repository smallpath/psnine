import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableNativeFeedback,
  RefreshControl,
  InteractionManager,
  Slider,
  FlatList
} from 'react-native'

import { standardColor, idColor } from '../../constant/colorConfig'

import { getUserGeneAPI } from '../../dao'

import TopicItem from '../../component/GeneItem'
import FooterProgress from '../../component/FooterProgress'

let toolbarActions = [
  { title: '跳页', iconName: 'md-map', show: 'always' }
]
declare var global

class UserGame extends Component<any, any> {
  static navigationOptions = {
     tabBarLabel: '机因'
  }
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
      scrollEnabled: true
    }
  }

  async componentWillMount() {
    const { screenProps } = this.props
    const name = '机因'
    let params: any = {}
    screenProps.toolbar.forEach(({ text, url}) => {
      // console.log(text, name, text.includes(name))
      if (text.includes(name)) {
        params.text = text
        params.URL = url
      }
    })
    if (!params.URL) {
      params = { ...screenProps.toolbar[5] }
    }
    if (!params.URL) {
      return this.setState({
        isRefreshing: false
      })
    }
    this.URL = params.URL.includes('?page') ? params.URL : `${params.URL}?page=1`
    this.fetchMessages(params.URL, 'jump')
  }

  URL: any = ''

  fetchMessages = (url, type = 'down') => {
    this.setState({
      [type === 'down' ? 'isLoadingMore' : 'isRefreshing'] : true
    }, () => {
      InteractionManager.runAfterInteractions(() => {
        getUserGeneAPI(url).then(data => {
          let thisList: any = []
          const thisPage = parseInt((url.match(/\?page=(\d+)/) || [0, 1])[1], 10)
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
            isRefreshing: false
          }, () => {
            cb()
            const componentDidFocus = () => {
              InteractionManager.runAfterInteractions(() => {
                this.props.screenProps.setToolbar({
                  toolbar: toolbarActions,
                  toolbarActions: this.onActionSelected,
                  componentDidFocus: {
                    index: 5,
                    handler: componentDidFocus,
                    afterSnap: (scrollEnabled) => {
                      const refs = this.flatlist && this.flatlist._listRef && this.flatlist._listRef.getScrollableNode()
                      if (refs && refs.setNativeProps) {
                        refs.setNativeProps({
                          scrollEnabled
                        })
                      } else {
                        this.setState({ scrollEnabled })
                      }
                    }
                  }
                })
              })
            }
            componentDidFocus()
          })
        }).catch(() => {
          this.setState({
            isRefreshing: false
          })
        })
      })
    })
  }

  pageArr = [1]
  _onRefresh = () => {
    const { URL } = this
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
    const { URL } = this
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
          modalVisible: true
        })
        return
    }
  }

  ITEM_HEIGHT = 83

  _renderItem = ({ item: rowData }) => {
    const { modeInfo, navigation } = this.props.screenProps
    return <TopicItem {...{
      navigation,
      rowData,
      modeInfo
    }} />
  }

  sliderValue = 1
  render() {
    const { modeInfo } = this.props.screenProps
    const { URL } = this
    // console.log('Message.js rendered');

    return (
      <View
        style={{ flex: 1, backgroundColor: modeInfo.background }}
        onStartShouldSetResponder={() => false}
        onMoveShouldSetResponder={() => false}
      >
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
          removeClippedSubviews={false}
          ListFooterComponent={() => <FooterProgress isLoadingMore={this.state.isLoadingMore} modeInfo={modeInfo}/>}
          data={this.state.list}
          ref={(list) => this.flatlist = list}
          scrollEnabled={this.state.scrollEnabled}
          keyExtractor={(item) => item.id}
          renderItem={this._renderItem}
          onEndReached={this._onEndReached}
          onEndReachedThreshold={0.5}
          extraData={modeInfo}
          windowSize={21}
          updateCellsBatchingPeriod={1}
          initialNumToRender={42}
          maxToRenderPerBatch={8}
          disableVirtualization={false}
          renderScrollComponent={props => <global.NestedScrollView {...props}/>}
          viewabilityConfig={{
            minimumViewTime: 1,
            viewAreaCoveragePercentThreshold: 0,
            waitForInteractions: true
          }}
        />
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
                opacity: 1,
                borderRadius: 2
              }} >
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
                      const targetPage = URL.split('=').slice(0, -1).concat(this.state.sliderValue).join('=')
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

  isValueChanged = false

}

export default UserGame
