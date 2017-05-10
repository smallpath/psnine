import React, { Component } from 'react';
import {
  ScrollView,
  Dimensions
} from 'react-native';

import Community from './drawer/Community';
import Qa from './drawer/Qa';
import Game from './drawer/Game';
import Battle from './drawer/Battle';
import Gene from './drawer/Gene';

import {
  DrawerNavigator,
  DrawerItems
} from 'react-navigation';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default DrawerNavigator({
  Community: {
    screen: Community,
  },
  Qa: {
    screen: Qa,
  },
  Game: {
    screen: Game,
  },
  Battle: {
    screen: Battle,
  },
  Gene: {
    screen: Gene,
  }
}, {
  initialRouteName: 'Game',
  drawerWidth: SCREEN_WIDTH / 2,
  drawerPosition: 'right',
  contentComponent: props => <ScrollView><DrawerItems {...props} /></ScrollView>,
  backBehavior: 'none'
});
