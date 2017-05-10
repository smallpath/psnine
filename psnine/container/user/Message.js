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

import { connect } from 'react-redux';
import { getTopicList } from '../../actions/community.js';
import { standardColor, nodeColor, idColor } from '../../constants/colorConfig';

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
    let URL = rowData.id;
    navigation.navigate('CommunityTopic', {
      URL,
      title: rowData.content,
      rowData,
      shouldBeSawBackground: true
    });
  }


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
              <Text
                ellipsizeMode={'tail'}
                numberOfLines={3}
                style={{ flex: 2.5, color: modeInfo.titleTextColor, }}>
                {rowData.content}
              </Text>

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
});

export default Message;
