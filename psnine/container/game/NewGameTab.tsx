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
} from '../../constant/colorConfig'
import {
  DrawerNavigator,
  DrawerItems,
  TabNavigator
} from 'react-navigation';

let screen = Dimensions.get('screen');

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = screen
const minWidth = Math.min(SCREEN_HEIGHT, SCREEN_WIDTH)

import NewGameProfile from './NewGameProfile'
import NewGameNews from './NewGameNews'
import NewGameGuide from './NewGameGuide'
import NewGameExp from './NewGameExp'
import NewGameQa from './NewGameQa'
import NewGameDiscount from './NewGameDiscount'

const names = [
  '游戏', '新闻', '攻略', '心得', '问答', '折扣'
]

const DefaultTabBar = TabNavigator.Presets.Default.tabBarComponent

const styles = StyleSheet.create({
  icon: {
    width: 26,
    height: 26,
  },
});

const container = {
  NewGameProfile: {
    screen: NewGameProfile
  },
  NewGameNews: {
    screen: NewGameNews
  },
  NewGameGuide: {
    screen: NewGameGuide
  },
  NewGameExp: {
    screen: NewGameExp
  },
  NewGameQa: {
    screen: NewGameQa
  },
  NewGameDiscount: {
    screen: NewGameDiscount
  }
}

Object.keys(container).forEach((name, index) => {
  container[name].screen.navigationOptions = {
    tabBarLabel: names[index]
  }
})

const Tab = TabNavigator(container, {
  tabBarComponent: props => {
    const { modeInfo } = props.screenProps
    return (
      <NestedScrollView style={{elevation: 0, height: 40, minHeight: 40, maxHeight: 40}}>
      <DefaultTabBar
        {...props}
        activeTintColor={modeInfo.accentColor}
        inactiveTintColor={modeInfo.titleTextColor}
        indicatorStyle={{
          backgroundColor: modeInfo.accentColor,
        }}
        style={{
          ...props.style,
          backgroundColor: modeInfo.backgroundColor
        }}
      />
      </NestedScrollView>
    )
  },
  lazy: true,
  animationEnabled: false,
  scrollEnabled: true,
  backBehavior: 'none',
  tabBarOptions: {
    scrollEnabled: true,
    animationEnabled: false,
    tabStyle: {
      height: 40,
      width: minWidth / 6
    },
    style: {
      elevation: 0,
      height: 40
    }
  }
})

export default class TabContainer extends React.PureComponent {
  constructor(props){
    super(props)
  }
  shouldComponentUpdate(nextProps, nextState) {
    // console.log('shouldComponent called')
    if (nextProps.screenProps.modeInfo.themeName !== this.props.screenProps.modeInfo.themeName) return true
    return false
  }
  render() {
    return (
      <Tab {...this.props} />
    )
  }
}
