import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  Image,
  TouchableNativeFeedback,
  RefreshControl,
  InteractionManager,
  FlatList,
  ProgressBarAndroid,
  Animated
} from 'react-native';

import { accentColor } from '../../constants/colorConfig'

export default class FooterProgress extends React.PureComponent {
  shouldComponentUpdate = (nextProps) => {
    if (nextProps.isLoadingMore !== this.props.isLoadingMore) return true
    if (nextProps.modeInfo.themeName !== this.props.modeInfo.themeName) return true
    return false
  }
  render() {
    return this.props.isLoadingMore ? (
      <View style={{flexDirection:'row', flex: 1, height: 4, alignItems: 'flex-end'}}>
        <ProgressBarAndroid color={this.props.modeInfo.accentColor} style={{flex:1,
          height: 40,
          marginBottom: -18,
          transform: [
            {
              rotateZ: '180deg'
            }
          ]
        }}  styleAttr="Horizontal"/>
        <ProgressBarAndroid style={{flex:1,height: 40,marginBottom: -18}} color={this.props.modeInfo.accentColor} styleAttr="Horizontal" />
      </View>
    ) : (<View style={{flexDirection:'row', flex: 1, height: 4, alignItems: 'flex-end'}}/>)
  }
}