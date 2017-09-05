import React, { Component } from 'react'
import {
  View,
  Dimensions,
  RefreshControl,
  InteractionManager,
  FlatList
} from 'react-native'

import { getGameMapperAPI } from '../../dao'

import TopicItem from '../../component/QaItem'

declare var global

export default class NewGameGuide extends Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      URL: this.props.screenProps.baseUrl + '/qa',
      numberPerPage: 60,
      numPages: 1,
      commentTotal: 1,
      currentPage: 1,
      isRefreshing: false,
      isLoadingMore: false,
      modalVisible: false,
      sliderValue: 1,
      scrollEnabled: true
    }
  }

  async componentWillMount() {
    this.fetchMessages(this.state.URL, 'jump')
  }

  fetchMessages = (url, type = 'down') => {
    this.setState({
      [type === 'down' ? 'isLoadingMore' : 'isRefreshing'] : true
    }, () => {
      InteractionManager.runAfterInteractions(() => {
        getGameMapperAPI(url).then(data => {
          this.setState({
            list: data,
            isLoadingMore: false,
            isRefreshing: false
          })
        })
      })
    })
  }

  pageArr = [1]
  _onRefresh = () => {
    if (this.state.isLoadingMore || this.state.isRefreshing) return
    this.fetchMessages(this.state.URL)
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

  ITEM_HEIGHT = 85

  _renderItem = ({ item: rowData }) => {
    const { modeInfo } = this.props.screenProps
    const { ITEM_HEIGHT } = this
    const { navigation } = this.props.screenProps
    // console.log(rowData)
    return <TopicItem {...{
      navigation,
      rowData,
      modeInfo,
      ITEM_HEIGHT
    }} />
  }

  sliderValue = 1
  width = Dimensions.get('window').width
  render() {
    const { modeInfo } = this.props.screenProps
    const data = this.state.list
    // console.log('Message.js rendered');
    const { width, height } = Dimensions.get('window')
    this.width = Math.min(width, height)
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
          data={data}
          keyExtractor={(item) => item.id}
          renderItem={this._renderItem}
          scrollEnabled={this.state.scrollEnabled}
          removeClippedSubviews={false}
          onEndReachedThreshold={0.5}
          extraData={modeInfo}
          windowSize={21}
          updateCellsBatchingPeriod={1}
          initialNumToRender={42}
          maxToRenderPerBatch={8}
          disableVirtualization={false}
          renderScrollComponent={props => <global.NestedScrollView {...props}/>}
          getItemLayout={(_, index) => (
            {length: this.ITEM_HEIGHT, offset: this.ITEM_HEIGHT * index, index}
          )}
          viewabilityConfig={{
            minimumViewTime: 1,
            viewAreaCoveragePercentThreshold: 0,
            waitForInteractions: true
          }}
        />
      </View>
    )
  }

  isValueChanged = false
  flatlist: any = false
  refreshControl: any = false

}
