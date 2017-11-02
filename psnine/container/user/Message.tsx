import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  RefreshControl,
  FlatList,
  Alert
} from 'react-native'

import { standardColor, accentColor } from '../../constant/colorConfig'

import Ionicons from 'react-native-vector-icons/Ionicons'
import { fetchMessages } from '../../dao'

import MessageItem from '../../component/MessageItem'

let toolbarActions = []

class Message extends Component<any, any> {
  constructor(props) {
    super(props)
    this.state = {
      messages: [],
      isRefreshing: true,
      icon: false
    }
  }

  onNavClicked = () => {
    const { navigation } = this.props
    navigation.goBack()
  }

  _pressRow = (rowData, getParams = false) => {
    const { navigation } = this.props
    let URL = rowData.url
    let type = 'CommunityTopic'
    let replyType = 'community'
    let customId = 0
    if (URL.includes('/gene/')) {
      type = 'GeneTopic'
      replyType = 'gene'
    } else if (URL.includes('/battle/')) {
      type = 'BattleTopic'
      replyType = 'battle'
    } else if (URL.includes('/qa/')) {
      type = 'QaTopic'
      replyType = 'qa'
    } else if (URL.includes('/trade/')) {
      type = 'TradeTopic'
      replyType = 'trade'
    } else if (URL.includes('/trophy/')) {
      type = 'Trophy'
      replyType = 'game'
    } else if (URL.includes('/psngame/')) {
      type = 'GamePoint'
      replyType = 'psngame'
      customId = (URL.match(/\/psngame\/(\d+)\/comment/) || [0, -1])[1]
    } else if (URL.includes('/psnid/') && URL.includes('comment')) {
      type = 'Home'
      replyType = ''
      if (getParams) return [type, {
        URL: URL.replace(/\/comment(.*?)$/, ''),
        title: rowData.psnid
      }]
      navigation.navigate(type, {
        URL: URL.replace(/\/comment(.*?)$/, ''),
        title: rowData.psnid
      })
      return
    }
    const customObj = {}
    if (customId) customObj.id = customId
    const options = {
      URL,
      title: '@' + rowData.psnid ,
      type: replyType,
      rowData: Object.assign({}, rowData, customObj)
    }
    if (getParams) return [type, options]
    navigation.navigate(type, options)
  }

  handleImageOnclick = (url) => this.props.navigation.navigate('ImageViewer', {
    images: [
      { url }
    ]
  })

  async componentWillMount() {
    this.fetchMessages()
  }

  fetchMessages = async () => {
    const data = await fetchMessages()
    this.setState({
      messages: data,
      isRefreshing: false
    })
  }

  _renderItem = ({ item: rowData, index }) => {
    const { modeInfo } = this.props.screenProps
    const { _pressRow: onPress } = this
    const { navigation } = this.props
    const { nums = 0 } = navigation.state.params
    return <MessageItem {...{
      navigation,
      rowData,
      modeInfo,
      onPress,
      isChecked: nums >= index + 1,
      modalList: [{
        text: '回复',
        onPress: (rowData) => {
          const [type, params]: any = this._pressRow(rowData, true)
          if (type === 'Home') return Alert.alert('提示', '留言板暂不支持快捷回复')
          navigation.navigate('Reply', {
            type: params.type,
            id: params.rowData.id,
            at: rowData.psnid,
            shouldSeeBackground: true
          })
        }
      }]
    }} />
  }

  render() {
    const { modeInfo } = this.props.screenProps
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
          titleColor={modeInfo.isNightMode ? '#000' : '#fff'}
          iconColor={modeInfo.isNightMode ? '#000' : '#fff'}
          title={'我的消息'}
          style={[styles.toolbar, { backgroundColor: modeInfo.standardColor }]}
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
              onRefresh={this.fetchMessages}
              colors={[modeInfo.accentColor]}
              progressBackgroundColor={modeInfo.backgroundColor}
            />
          }
          data={this.state.messages}
          keyExtractor={(item, index) => `${item.url}::${index}`}
          renderItem={this._renderItem}
          onEndReachedThreshold={0.5}
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
  avatar: {
    width: 50,
    height: 50
  },
  toolbar: {
    backgroundColor: standardColor,
    height: 56,
    elevation: 4
  },
  a: {
    color: accentColor,
    fontWeight: '300'
  }
})

export default Message
