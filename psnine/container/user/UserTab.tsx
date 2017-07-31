import React from 'react'
import {
  Dimensions
} from 'react-native'

import {
  TabNavigator
} from 'react-navigation'

let screen = Dimensions.get('screen')

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = screen
const minWidth = Math.min(SCREEN_HEIGHT, SCREEN_WIDTH)

import HomeProfile from './HomeProfile'
import UserGame from './UserGame'
import UserBoard from './UserBoard'
import UserDiary from './UserDiary'
import UserTopic from './UserTopic'
import UserGene from './UserGene'

const DefaultTabBar = TabNavigator.Presets.Default.tabBarComponent

const container = {
  Home: {
    screen: HomeProfile
  },
  UserGame: {
    screen: UserGame
  },
  UserDiary: {
    screen: UserDiary
  },
  UserBoard: {
    screen: UserBoard
  },
  UserTopic: {
    screen: UserTopic
  },
  UserGene: {
    screen: UserGene
  }
}

declare var global

const Tab = TabNavigator(container, {
  tabBarComponent: props => {
    const { modeInfo } = props.screenProps
    return (
      <global.NestedScrollView style={{elevation: 0, height: 40, minHeight: 40, maxHeight: 40}}>
      <DefaultTabBar
        {...props}
        activeTintColor={modeInfo.accentColor}
        inactiveTintColor={modeInfo.titleTextColor}
        indicatorStyle={{
          backgroundColor: modeInfo.accentColor
        }}
        style={{
          ...props.style,
          backgroundColor: modeInfo.backgroundColor
        }}
      />
      </global.NestedScrollView>
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
      width: minWidth / 4
    },
    style: {
      elevation: 0,
      height: 40
    }
  }
})

export default class TabContainer extends React.PureComponent<any, any> {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <Tab {...this.props} />
    )
  }
}
