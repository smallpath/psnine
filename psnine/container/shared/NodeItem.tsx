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
import MyDialog from '../../components/Dialog'

import { getHomeURL } from '../../dao';

let screen = Dimensions.get('window');
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = screen;

export default class PhotoItem extends React.PureComponent {

  shouldComponentUpdate = (props, state) => {
    if (props.modeInfo.themeName !== this.props.modeInfo.themeName) return true
    return false
  }

  render() {
    const { modeInfo, onPress, rowData, navigation } = this.props

    return (
      <TouchableNativeFeedback
        useForeground={true}
        onPress={onPress}
        background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
      >
        <View style={{ 
          flex: -1, flexDirection: 'row', padding: 5, backgroundColor: modeInfo.backgroundColor, 
          alignSelf: 'flex-start',
          alignContent: 'flex-end',
          backgroundColor: modeInfo.backgroundColor,
          flex: -1,
          padding: 4 }}>
          <Text style={{color: modeInfo.accentColor}}>{rowData.text}</Text>
        </View>
      </TouchableNativeFeedback>
    )
  }

}

const styles = StyleSheet.create({
  avatar: {
    width: 150,
    height: 150,
  }
});
