import React from 'react-native';
import mainScreen from './mainScreen';
import refreshConTrolHandler from './refreshConTrolHandler';

let actions = {};

Object.assign(actions, mainScreen);
Object.assign(actions, refreshConTrolHandler);

module.exports = actions;
