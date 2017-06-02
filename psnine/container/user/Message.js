import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  Image,
  Dimensions,
  TouchableNativeFeedback,
  RefreshControl,
  InteractionManager,
  FlatList
} from 'react-native';

import HTMLView from '../../components/HtmlToView'
import { connect } from 'react-redux';
import { getTopicList } from '../../actions/community.js';
import { standardColor, nodeColor, idColor, accentColor } from '../../constants/colorConfig';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { getTopicURL, fetchMessages, } from '../../dao';

import MessageItem from '../shared/MessageItem'
import FooterProgress from '../shared/FooterProgress'

let toolbarActions = [];

class Message extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      isRefreshing: true,
      icon: false
    }
  }

  onNavClicked = (rowData) => {
    const { navigation } = this.props;
    navigation.goBack()
  }

  _pressRow = (rowData) => {
    const { navigation } = this.props;
    let URL = rowData.url;
    let type = 'CommunityTopic'
    let replyType = 'community'
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
    } else if (URL.includes('/psnid/') && URL.includes('#comment')) {
      type = 'Home'
      replyType = ''
      navigation.navigate(type, {
        URL: URL.replace(/#comment-\d+$/, ''),
        title: rowData.psnid
      });
      return
    }
    navigation.navigate(type, {
      URL,
      title: '@' + rowData.psnid ,
      type: replyType,
      rowData
    });
  }

  handleImageOnclick = (url) => this.props.navigation.navigate('ImageViewer', {
    images: [
      { url }
    ]
  })

  componentWillMount = async () => {
    this.fetchMessages();
  }

  fetchMessages = async () => {
    const data = await fetchMessages(this.props.navigation.state.params.psnid);
    this.setState({
      messages: data,
      isRefreshing: false
    });
  }

  _renderItem = ({ item: rowData, index }) => {
    const { modeInfo } = this.props.screenProps
    const { ITEM_HEIGHT, _pressRow: onPress } = this
    const { navigation } = this.props
    return <MessageItem {...{
      navigation,
      rowData,
      modeInfo,
      onPress
    }} />
  }

  render() {
    const { modeInfo } = this.props.screenProps
    // console.log('Message.js rendered');
    return (
      <View
        style={{ flex: 1, backgroundColor: modeInfo.backgroundColor }}
        onStartShouldSetResponder={() => false}
        onMoveShouldSetResponder={() => false}
      >
        <Ionicons.ToolbarAndroid
          navIconName="md-arrow-back"
          overflowIconName="md-more"
          titleColor={modeInfo.isNightMode ? '#000' : '#fff'}
          iconColor={modeInfo.isNightMode ? '#000' : '#fff'}
          title={'我的消息'}
          style={[styles.toolbar, { backgroundColor: modeInfo.standardColor }]}
          actions={toolbarActions}
          onIconClicked={this.onNavClicked}
        />
        <FlatList style={{
          flex: 1,
          backgroundColor: modeInfo.backgroundColor
        }}
          ref={flatlist => this.flatlist = flatlist}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this.fetchMessages}
              colors={[modeInfo.standardColor]}
              progressBackgroundColor={modeInfo.backgroundColor}
              ref={ref => this.refreshControl = ref}
            />
          }
          data={this.state.messages}
          keyExtractor={(item, index) => `${item.url}::${index}`}
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
    height: 50,
  },
  toolbar: {
    backgroundColor: standardColor,
    height: 56,
    elevation: 4,
  },
  a: {
    color: accentColor,
    fontWeight: '300'
  }
});

export default Message;
