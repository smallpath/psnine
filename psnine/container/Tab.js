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

let screen = Dimensions.get('window');

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = screen;

import {
  accentColor,
  titleTextColor,
  standardTextColor,
  standardColor
} from '../constants/colorConfig'

import { changeSegmentIndex } from '../actions/app';

import Community from './drawer/Community';
import Qa from './drawer/Qa';
import Game from './drawer/Game';
import Battle from './drawer/Battle';
import Gene from './drawer/Gene';
import Rank from './drawer/Rank';
import Circle from './drawer/Circle';
import Store from './drawer/Store';
import Trade from './drawer/Trade';

import {
  DrawerNavigator,
  DrawerItems,
  TabNavigator
} from 'react-navigation';

const DefaultTabBar = TabNavigator.Presets.Default.tabBarComponent;

const styles = StyleSheet.create({
  icon: {
    width: 26,
    height: 26,
  },
});


export default class TabContainer extends Component {
  constructor(props) {
    super(props)
  }

  shouldComponentUpdate(prop, state) {
    const { communityType, geneType, circleType, modeInfo, searchTitle } = prop.screenProps
    if (searchTitle !== this.props.screenProps.searchTitle) return true
    if (modeInfo.themeName !== this.props.screenProps.modeInfo.themeName) return true
    if (geneType !== this.props.screenProps.geneType) return true
    if (communityType !== this.props.screenProps.communityType) return true
    if (circleType !== this.props.screenProps.circleType) return true
    return false
  }

  render() {
    return (<Tabs
      {...this.props}
    />)
  }
}

const Tabs = TabNavigator({
  Community: {
    screen: Community,
  },
  Qa: {
    screen: Qa,
  },
  Gene: {
    screen: Gene,
  },
  Game: {
    screen: Game,
  },
  Battle: {
    screen: Battle,
  },
  Rank: {
    screen: Rank
  },
  Circle: {
    screen: Circle
  },
  Store: {
    screen: Store,
  },
  Trade: {
    screen: Trade,
  }
}, {
  // initialRouteName: 'Circle',
  tabBarComponent: props => {
    const { modeInfo } = props.screenProps
    const titleTextColor = modeInfo.modeInfo ? '#000' : '#fff'
    return (
        <DefaultTabBar
          {...props}
          activeTintColor={titleTextColor}
          inactiveTintColor={titleTextColor}
          indicatorStyle={{
            backgroundColor: titleTextColor,
          }}
          style={{
            ...props.style,
            backgroundColor: modeInfo.standardColor
          }}
        />
    )
  },
  lazy: true,
  animationEnabled: false,
  scrollEnabled: true,
  backBehavior: 'none',
  tabBarOptions: {
    activeTintColor: '#fff',
    inactiveTintColor: '#fff',
    indicatorStyle: {
      backgroundColor: '#fff',
    },
    scrollEnabled: true,
    animationEnabled: false,
    tabStyle: {
      height: 40,
      width: SCREEN_WIDTH / 6
    },
    style: {
      elevation: 4,
      height: 40
    }
  }
});
