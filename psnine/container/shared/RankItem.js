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

import { getHomeURL } from '../../dao';

import {
  getGamePointAPI,
  getTopicURL
} from '../../dao'

let screen = Dimensions.get('window');
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = screen;

export default class extends React.PureComponent {

  shouldComponentUpdate = (props) => props.modeInfo.isNightMode !== this.props.modeInfo.isNightMode

  _onRowPressed = (rowData) => {
    const { navigation } = this.props;
    const URL = getHomeURL(rowData.psnid);
    navigation.navigate('Home', {
      // URL: 'http://psnine.com/psngame/5424?psnid=Smallpath',
      URL,
      title: rowData.psnid,
      rowData
    })
  }


  handleImageOnclick = () => {}

  render = () => {
    const { modeInfo, rowData } = this.props

    return (
      <View style={{
        marginTop: 7,
        backgroundColor: modeInfo.backgroundColor,
        elevation: 1
      }}>
        <TouchableNativeFeedback
          onPress={() => {
            this._onRowPressed(rowData)
          }}
          useForeground={true}
          delayPressIn={100}
          background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
        >
          <View pointerEvents={'box-only'} style={{ flex: 1, flexDirection: 'row', padding: 12, justifyContent: 'space-around', alignItems: 'center' }}>
            <Image
              source={{ uri: rowData.avatar }}
              style={[styles.avatar, { width: 50 }]}
            />
            <View style={{ flex: 2, padding: 5}}>
              <Text style={{color: modeInfo.accentColor}}>{rowData.psnid}</Text>
              <Text style={{color: modeInfo.titleTextColor}}>No.{rowData.rank}</Text>
              <HTMLView
                value={rowData.content}
                modeInfo={modeInfo}
                stylesheet={styles}
                onImageLongPress={this.handleImageOnclick}
                imagePaddingOffset={30 + 10}
                shouldForceInline={true}
              />
            </View>
            { rowData.type === 'general' ? this.renderGeneral(rowData) : this.renderOther(rowData) }
          </View>
        </TouchableNativeFeedback>
      </View>
    )
  }

  renderGeneral = (rowData) => {

    const { modeInfo } = this.props
    return (
      <View style={{flex: 4, flexDirection: 'row'}}>
        <View style={{flex: 2, flexDirection: 'column'}}>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <Text style={{color: modeInfo.standardTextColor}}>{rowData.level}</Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <Text style={{color: modeInfo.standardTextColor}}>{rowData.games}</Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <Text style={{color: modeInfo.standardTextColor}}>{rowData.perfectRate}</Text>
          </View>
        </View>
        <View style={{flex: 2, flexDirection: 'column'}}>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <Text style={{color: modeInfo.standardTextColor}}>{rowData.platinum}</Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <Text style={{color: modeInfo.standardTextColor}}>{rowData.gold}</Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <Text style={{color: modeInfo.standardTextColor}}>{rowData.silver}</Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <Text style={{color: modeInfo.standardTextColor}}>{rowData.bronze}</Text>
          </View>
        </View>
      </View>
    )
  }

  renderOther = (rowData) => {
    const { modeInfo } = this.props

    return (
      <View style={{flex: 4, flexDirection: 'row'}}>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <HTMLView
            value={rowData.level}
            modeInfo={modeInfo}
            stylesheet={styles}
            onImageLongPress={this.handleImageOnclick}
            imagePaddingOffset={30 + 0 + 10}
            shouldForceInline={true}
          />
          <Text style={{color: modeInfo.standardTextColor}}>{rowData.exp}</Text>
        </View>
        { rowData.games && <View style={{ flex: 1, flexDirection: 'column' }}>
          <Text style={{color: modeInfo.standardTextColor}}>{rowData.games}</Text>
        </View> || undefined}
      </View>
    )
  }

}

const styles = StyleSheet.create({
  avatar: {
    width: 50,
    height: 50,
  }
});
