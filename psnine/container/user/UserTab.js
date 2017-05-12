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

const DefaultTabBar = TabNavigator.Presets.Default.tabBarComponent;
class MyHomeScreen extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Home',
    // Note: By default the icon is only shown on iOS. Search the showIcon option below.
  };

  render() {
    return (
      <Button style={{flex:1}}
        onPress={() => this.props.navigation.navigate('Notifications')}
        title="Go to notifications"
      />
    );
  }
}

class MyNotificationsScreen extends React.Component {
  static navigationOptions = {
    tabBarLabel: 'Notifications'
  };

  render() {
    return (
      <Button style={{flex:1}}
        onPress={() => this.props.navigation.goBack()}
        title="Go back home"
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
        container.game = {
          screen: MyNotificationsScreen
        }
        break;
      case '留言板':
        container.island = {
          screen: MyNotificationsScreen
        }
        break;
      case '圈子':
        container.circle = {
          screen: MyNotificationsScreen
        }
        break;
    }
  })

  return TabNavigator(container, {
    tabBarComponent: props => {
      const { modeInfo } = props.screenProps
      return (
        <DefaultTabBar
          {...props}
          activeTintColor={modeInfo.nightModeInfo.titleTextColor}
          inactiveTintColor={modeInfo.nightModeInfo.standardTextColor}
          indicatorStyle={{
            backgroundColor: modeInfo.nightModeInfo.standardTextColor,
          }}
          scrollEnabled={false}
          tabStyle={{
            height: 40,
          }}
          style={{
            elevation: 4,
            height: 40,
            backgroundColor: modeInfo.standardColor
          }}
        />
      )
    },
    lazy: true,
    animationEnabled: false,
    backBehavior: 'none'
  })
}
