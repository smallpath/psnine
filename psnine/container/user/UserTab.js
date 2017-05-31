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
import UserBoard from './UserBoard'
import UserCircle from './UserCircle'

const DefaultTabBar = TabNavigator.Presets.Default.tabBarComponent;

const styles = StyleSheet.create({
  icon: {
    width: 26,
    height: 26,
  },
});

const container = {
  Home: {
    screen: HomeProfile
  },
  UserGame: {
    screen: UserGame
  },
  UserBoard: {
    screen: UserBoard
  },
  UserCircle: {
    screen: UserCircle
  }
}

const Tab = TabNavigator(container, {
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

export default class TabContainer extends React.PureComponent {
  constructor(props){
    super(props)
  }
  shouldComponentUpdate(nextProps, nextState) {
    // console.log('shouldComponent called')
    return false
  }
  render() {
    return (
      <Tab {...this.props} />
    )
  }
}
