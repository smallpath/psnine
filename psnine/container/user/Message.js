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
} from 'react-native';

import HTMLView from '../../components/HtmlToView'
import { connect } from 'react-redux';
import { getTopicList } from '../../actions/community.js';
import { standardColor, nodeColor, idColor, accentColor } from '../../constants/colorConfig';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { getTopicURL, fetchMessages, } from '../../dao';

const ds = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2,
});

let toolbarActions = [];

class Message extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      isLoading: true,
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
    if (URL.includes('/gene/')) {
      type = 'GeneTopic'
    } else if (URL.includes('/battle/')) {
      type = 'BattleTopic'
    } else if (URL.includes('/qa/')) {
      type = 'QaTopic'
    }

    navigation.navigate(type, {
      URL,
      title: rowData.from ,
      rowData,
      shouldBeSawBackground: true
    });
  }

  handleImageOnclick = (url) => this.props.navigation.navigate('ImageViewer', {
    images: [
      { url }
    ]
  })

  _renderRow = (rowData,
    sectionID: number | string,
    rowID: number | string,
    highlightRow: (sectionID: number, rowID: number) => void
  ) => {
    const { modeInfo } = this.props.screenProps
    let TouchableElement = TouchableNativeFeedback;

    return (
      <View rowID={rowID} style={{
        marginTop: 7,
        backgroundColor: modeInfo.backgroundColor,
        elevation: 1,
      }}>
        <TouchableElement
          delayPressIn={0}
          background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
          onPress={() => this._pressRow(rowData)}
        >
          <View pointerEvents='box-only' style={{ flex: 1, flexDirection: 'row', padding: 12 }}>
            {/*<Image
              source={{ uri: uri }}
              style={styles.avatar}
              />*/}

            <View style={{ marginLeft: 10, flex: 1, flexDirection: 'column' }}>
              <HTMLView
                value={rowData.content}
                modeInfo={modeInfo}
                stylesheet={styles}
                onImageLongPress={this.handleImageOnclick}
                imagePaddingOffset={30 + 75 + 10}
                shouldForceInline={true}
              />

              <View style={{ flex: 1.1, flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ flex: -1, color: idColor, textAlign: 'center', textAlignVertical: 'center' }}>{rowData.from}</Text>
              </View>

            </View>

          </View>
        </TouchableElement>
      </View>
    )
  }

  componentWillMount = async () => {
    this.fetchMessages();
  }

  fetchMessages = async () => {
    const data = await fetchMessages(this.props.navigation.state.params.psnid);
    this.setState({
      messages: data,
      isLoading: false
    });
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
        <ListView
          refreshControl={
            <RefreshControl
              refreshing={this.state.isLoading}
              onRefresh={this.fetchMessages}
              colors={[standardColor]}
              progressBackgroundColor={modeInfo.backgroundColor}
            />
          }
          pageSize={32}
          removeClippedSubviews={false}
          enableEmptySections={true}
          dataSource={ds.cloneWithRows(this.state.messages)}
          renderRow={this._renderRow}
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
