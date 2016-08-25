import React from 'react-native';
import app from './app';
import community from './community';
import refreshConTrolHandler from './refreshConTrolHandler';

let actions = {};

Object.assign(actions, app);
Object.assign(actions, community);
Object.assign(actions, refreshConTrolHandler);

module.exports = actions;
