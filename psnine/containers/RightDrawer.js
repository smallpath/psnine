import React, { Component } from 'react';
import {
  ScrollView,
  Dimensions
} from 'react-native';

import Community from './viewPagers/Community';
import Qa from './viewPagers/Qa';
import Game from './viewPagers/Game';
import Battle from './viewPagers/Battle';
import Gene from './viewPagers/Gene';

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
