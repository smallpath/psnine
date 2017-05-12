import React, { Component, Children } from 'react';
import {
  ScrollView,
  Dimensions,
  Platform,
  View,
  StyleSheet,
  TouchableNativeFeedback,
  Text,
  Button
} from 'react-native';

import {
  accentColor,
  titleTextColor,
  standardTextColor,
  standardColor
} from '../../constants/colorConfig'
import {
  DrawerNavigator,
  DrawerItems,
  TabNavigator
} from 'react-navigation';

import HomeProfile from './HomeProfile'
import UserGame from './UserGame'

const DefaultTabBar = TabNavigator.Presets.Default.tabBarComponent;
class MyHomeScreen extends React.Component {
  static navigationOptions = {
    tabBarLabel: '留言板',
    // Note: By default the icon is only shown on iOS. Search the showIcon option below.
  };

  render() {
    return (
      <Button style={{flex:1}}
        onPress={() => this.props.navigation.goBack()}
        title="Not implemented yet"
      />
    );
  }
}

class MyNotificationsScreen extends React.Component {
  static navigationOptions = {
    tabBarLabel: '圈子'
  };

  render() {
    return (
      <Button style={{flex:1}}
        onPress={() => this.props.navigation.goBack()}
        title="Not implemented yet"
      />
    );
  }
}

const styles = StyleSheet.create({
  icon: {
    width: 26,
    height: 26,
  },
});

export default (maps) => {
  const container = {}
  maps.forEach(({ text, url }) => {
    switch (text) {
      case '主页':
        container.Home = {
          screen: HomeProfile
        }
        break;
      case '游戏':
        container.UserGame = {
          screen: UserGame
        }
        break;
      case '留言板':
        // container.island = {
        //   screen: MyHomeScreen
        // }
        break;
      case '圈子':
        // container.circle = {
        //   screen: MyNotificationsScreen
        // }
        break;
    }
  })

  return TabNavigator(container, {
    tabBarComponent: props => {
      const { modeInfo } = props.screenProps
      return (
        <DefaultTabBar
          {...props}
          activeTintColor={modeInfo.accentColor}
          inactiveTintColor={modeInfo.titleTextColor}
          indicatorStyle={{
            backgroundColor: modeInfo.accentColor,
          }}
          scrollEnabled={false}
          tabStyle={{
            height: 40,
            elevation: 0
          }}
          style={{
            elevation: 0,
            height: 40,
            backgroundColor: modeInfo.backgroundColor
          }}
        />
      )
    },
    lazy: true,
    animationEnabled: false,
    backBehavior: 'none'
  })
}
