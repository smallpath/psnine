import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableNativeFeedback,
  RefreshControl,
  InteractionManager,
  FlatList
} from 'react-native'

import { standardColor, idColor } from '../../constant/colorConfig'

import { getGameMapperAPI, getTopicURL } from '../../dao'

declare var global

class TopicItem extends React.PureComponent<any, any> {
  _onRowPressed = (rowData) => {
    const { navigation } = this.props
    const id = rowData.id || parseInt(rowData.url.split('/').pop(), 10)
    const URL = getTopicURL(id)
    navigation.navigate('CommunityTopic', {
      URL,
      title: rowData.title,
      rowData,
      type: 'community',
      shouldBeSawBackground: true
    })
  }

  render() {
    const { modeInfo, rowData, ITEM_HEIGHT = 165, shouldMargin = true } = this.props
    const content = rowData.content
    const { width: SCREEN_WIDTH } = Dimensions.get('window')
    return (
      <View style={{
        marginVertical: shouldMargin ? 3.5 : 0,
        backgroundColor: modeInfo.backgroundColor,
        elevation: shouldMargin ? 1 : 0,
        height: ITEM_HEIGHT - (shouldMargin ? 7 : 0),
        alignItems: 'center',
        justifyContent: 'center',
        padding: 5
      }}>
        <TouchableNativeFeedback
          onPress={() => { this._onRowPressed(rowData) }}
          background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
        >
          <View style={{ flex: -1, flexDirection: 'row', padding: 5, paddingHorizontal: 10, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{
              width: 140,
              flexDirection: 'column',
              alignSelf: 'center',
              marginLeft: 20,
              left: 10
            }}>
              <Image
                source={{ uri: rowData.avatar }}
                style={{
                  width: 120,
                  height: 120,
                  marginLeft: 10
                }}
              />
              <View style={{
                position: 'absolute',
                top: 20,
                flex: -1,
                right: 0,
                flexDirection: 'row',
                paddingHorizontal: 4,
                backgroundColor: modeInfo.standardColor,
                zIndex: 2  }}>
                <Text style={{ flex: -1, color: modeInfo.titleTextColor }}>
                  {rowData.platform}
                </Text>
              </View>
              <View style={{
                position: 'absolute',
                bottom: 20,
                flex: -1,
                left: 0,
                flexDirection: 'row',
                paddingHorizontal: 4,
                backgroundColor: modeInfo.standardColor,
                zIndex: 2  }}>
                <Text style={{ flex: -1, color: modeInfo.titleTextColor }}>
                  {rowData.price}
                </Text>
              </View>
            </View>
            <View style={{ padding: 15, flexDirection: 'column',
              justifyContent: 'center', alignItems: 'flex-start',
              maxWidth: SCREEN_WIDTH - 150,
              flexWrap: 'nowrap'
             }}>
              <global.HTMLView
                value={content}
                modeInfo={modeInfo}
                stylesheet={styles}
                onImageLongPress={() => {}}
                imagePaddingOffset={30 + 85 + 10}
                shouldForceInline={true}
              />
            </View>
          </View>
        </TouchableNativeFeedback>
      </View>
    )
  }
}

export default class NewGameGuide extends Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {
      list: [],
      URL: this.props.screenProps.baseUrl + '/discount',
      numberPerPage: 60,
      numPages: 1,
      commentTotal: 1,
      currentPage: 1,
      isRefreshing: false,
      isLoadingMore: false,
      modalVisible: false,
      sliderValue: 1
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
          // console.log(data)
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

  ITEM_HEIGHT = 165

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
          keyExtractor={(item, index) => `${item.id}::${index}`}
          renderItem={this._renderItem}
          onEndReachedThreshold={0.5}
          extraData={modeInfo}
          windowSize={21}
          renderScrollComponent={props => <global.NestedScrollView {...props}/>}
          updateCellsBatchingPeriod={1}
          initialNumToRender={42}
          maxToRenderPerBatch={8}
          disableVirtualization={false}
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
