import React from 'react-native';
import app from './app';
import community from './community';
import battle from './battle';
import qa from './qa';
import game from './game';
import rank from './rank';
import gene from './gene';

let actions = {};

Object.assign(actions, app);
Object.assign(actions, community);
Object.assign(actions, qa)
Object.assign(actions, battle)
Object.assign(actions, rank)
Object.assign(actions, game)
Object.assign(actions, gene)

module.exports = actions;
