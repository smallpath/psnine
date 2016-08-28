import React from 'react-native';
import app from './app';
import community from './community';

let actions = {};

Object.assign(actions, app);
Object.assign(actions, community);

module.exports = actions;
