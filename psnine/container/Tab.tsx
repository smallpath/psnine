import React, { Component } from 'react'
import {
  Dimensions,
  StyleSheet
} from 'react-native'

let screen = Dimensions.get('screen')

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = screen

const minWidth = Math.min(SCREEN_HEIGHT, SCREEN_WIDTH)

import Recommend from './drawer/Recommend'
import Community from './drawer/Community'
import Qa from './drawer/Qa'
import Game from './drawer/Game'
import Battle from './drawer/Battle'
import Gene from './drawer/Gene'
import Rank from './drawer/Rank'
import Store from './drawer/Store'
import Trade from './drawer/Trade'

import {
  TabNavigator
} from 'react-navigation'

const DefaultTabBar = TabNavigator.Presets.Default.tabBarComponent

export default class TabContainer extends Component<any, any> {
  constructor(props) {
    super(props)
  }

  shouldComponentUpdate(prop) {
    const { geneType, circleType, modeInfo, searchTitle } = prop.screenProps
    if (searchTitle !== this.props.screenProps.searchTitle) return true
    if (modeInfo.themeName !== this.props.screenProps.modeInfo.themeName) return true
    if (geneType !== this.props.screenProps.geneType) return true
    if (circleType !== this.props.screenProps.circleType) return true
    return false
  }

  render() {
    return (<Tabs
      {...this.props}
    />)
  }
}

export const routes = {
  Recommend: {
    screen: Recommend
  },
  Community: {
    screen: Community
  },
  Qa: {
    screen: Qa
  },
  Gene: {
    screen: Gene
  },
  Game: {
    screen: Game
  },
  Battle: {
    screen: Battle
  },
  Rank: {
    screen: Rank
  },
  // Circle: {
  //   screen: Circle
  // },
  Store: {
    screen: Store
  },
  Trade: {
    screen: Trade
  }
}

const Tabs = TabNavigator(routes, {
  initialRouteName: 'Community',
  tabBarComponent: props => {
    const { modeInfo } = props.screenProps
    const titleTextColor = modeInfo.modeInfo ? '#000' : '#fff'
    return (
        <DefaultTabBar
          {...props}
          onTabPress={props.screenProps.onTabPress}
          activeTintColor={titleTextColor}
          inactiveTintColor={titleTextColor}
          indicatorStyle={{
            backgroundColor: titleTextColor
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
  backBehavior: 'none',
  tabBarOptions: {
    activeTintColor: '#fff',
    inactiveTintColor: '#fff',
    indicatorStyle: {
      backgroundColor: '#fff'
    },
    scrollEnabled: true,
    tabStyle: {
      height: 40,
      width: minWidth / 6
    },
    style: {
      elevation: 4,
      height: 40
    }
  }
})
