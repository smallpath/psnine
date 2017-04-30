import React from 'react-native';
import app from './app';
import community from './community';
import battle from './battle';
import qa from './qa';

let actions = {};

Object.assign(actions, app);
Object.assign(actions, community);
Object.assign(actions, qa)

module.exports = actions;
