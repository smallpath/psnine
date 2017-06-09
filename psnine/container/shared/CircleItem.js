import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableNativeFeedback,
  InteractionManager,
  ActivityIndicator,
  StatusBar,
  Animated,
  Easing,
  FlatList,
  PanResponder,
  Modal,
  Keyboard
} from 'react-native';

import HTMLView from '../../components/HtmlToView';
import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { standardColor, nodeColor, idColor, accentColor } from '../../constants/colorConfig';

import {
  getGamePointAPI,
  getTopicURL
} from '../../dao'

let screen = Dimensions.get('window');
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = screen;

export default class CircleItem extends React.PureComponent {
  shouldComponentUpdate = (props) => props.modeInfo.isNightMode !== this.props.modeInfo.isNightMode
  
  _onRowPressed = (rowData) => {
    const { navigation } = this.props;
    // const URL = getBattleURL(rowData.id);
    navigation.navigate('Circle', {
      URL: rowData.href,
      title: rowData.title,
      rowData
    })
  }


  render = () => {
    // console.log(rowData)
    const { modeInfo, rowData, ITEM_HEIGHT, shouldMargin = true } = this.props
    // console.log(rowData)
    return (
      <View style={{
        marginVertical: shouldMargin ? 3.5 : 0,
        backgroundColor: modeInfo.backgroundColor,
        borderBottomWidth: shouldMargin ? 0 : StyleSheet.hairlineWidth,
        borderBottomColor: modeInfo.brighterLevelOne,
        elevation: shouldMargin ? 1 : 0,
        height: ITEM_HEIGHT - (shouldMargin ? 7 : 0),
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <TouchableNativeFeedback
          onPress={() => { this._onRowPressed(rowData) }}
          delayPressIn={100}
          background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
        >
          <View pointerEvents={'box-only'} style={{ flex: -1, flexDirection: 'row', padding: 5, justifyContent: 'space-around', alignItems: 'center' }}>
            <View style={{
              width: 54,
              flexDirection: 'column',
              alignSelf: 'center'
            }} borderRadius={27}>
              <Image
                source={{ uri: rowData.avatar }}
                borderRadius={27}
                style={{
                  width: 54,
                  height: 54,
                  alignSelf: 'center',
                }}
              />
            </View>
            <View style={{ marginLeft: 10, flex: 3, padding: 5, flexDirection: 'column' }}>
              <Text
                ellipsizeMode={'tail'}
                numberOfLines={2}
                style={{ flex: -1, color: modeInfo.titleTextColor, fontSize: 15 }}>
                {rowData.title}
              </Text>
              <Text style={{ flex: -1, color: idColor, textAlignVertical: 'center', fontSize: 12 }} onPress={
                () => {
                  this.props.navigation.navigate('Home', {
                    title: rowData.owner,
                    id: rowData.owner,
                    URL: `http://psnine.com/psnid/${rowData.owner}`
                  })
                }
              }><Text style={{ flex: -1, color: modeInfo.standardTextColor, fontSize: 12 }} numberOfLines={1}>机长：</Text>{rowData.owner}</Text>
            </View>
            <View style={{ marginLeft: 10, flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
              <Text style={{ flex: -1, color: modeInfo.standardTextColor }} numberOfLines={1}>{rowData.type ? '类型' : '状态'}</Text>
              <Text style={{ flex: -1, color: modeInfo.standardTextColor }} numberOfLines={1}>{rowData.type || rowData.type}</Text>
            </View>
            <View style={{ marginLeft: 10, flex: rowData.hot ? 1 : 1.5, flexDirection: 'column', justifyContent: 'center', alignItems: 'center'  }}>
              <Text style={{ flex: -1, color: modeInfo.standardTextColor }} numberOfLines={1}>{rowData.hot ? '热度' : '加入时间'}</Text>
              <Text style={{ flex: -1, color: modeInfo.standardTextColor }} numberOfLines={1}>{rowData.hot || rowData.access}</Text>
            </View>
          </View>
        </TouchableNativeFeedback>
      </View>
    )
  }
}