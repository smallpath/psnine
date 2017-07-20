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

  onPress = () => {
    const { modeInfo, rowData, navigation } = this.props
    navigation.navigate('GamePoint', {
      URL: `${rowData.href}`,
      rowData: {
        id: (rowData.href.match(/\/psngame\/(\d+)\/comment/) || [0,-1])[1]
      }
    })
  }

  render() {
    const { modeInfo, rowData, navigation } = this.props
    const width = (SCREEN_WIDTH - 19) / 2 / modeInfo.numColumns
    return (
      <TouchableNativeFeedback
        useForeground={true}
        onPress={this.onPress}
        background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
      >
        <View style={{ 
          flex: 1, flexDirection: 'row', padding: 2, alignItems: 'center', 
          alignSelf: 'flex-start',
          alignContent: 'flex-end',
          backgroundColor: modeInfo.backgroundColor,
          height: 56,
          width: width 
        }}>
          <Image
            source={{ uri: rowData.img || rowData.href }}
            style={[styles.avatar, { marginHorizontal: 2 }]}
          />
          <View style={{flex: 2}}>
            <Text numberOfLines={1} ellipsizeMode='tail' selectable={false} style={{ flex: -1, color: modeInfo.standardColor, textAlign: 'center', textAlignVertical: 'center' }} onPress={() => {
                // this.flatlist.getNode().recordInteraction()
                navigation.navigate('Home', {
                  title: rowData.psnid,
                  id: rowData.psnid,
                  URL: `http://psnine.com/psnid/${rowData.psnid}`
                })
              }}>{rowData.psnid}</Text>
            <Text numberOfLines={1} ellipsizeMode='tail' selectable={false} style={{ flex: -1, color: modeInfo.standardTextColor, textAlign: 'center', textAlignVertical: 'center', fontSize: 12 }}>{rowData.date}</Text>
          </View>
        </View>
      </TouchableNativeFeedback>
    )
  }

}

const styles = StyleSheet.create({
  avatar: {
    width: 91,
    height: 50,
  }
});
