import React, { ToastAndroid } from 'react-native';
import * as ActionTypes from '../constants/actionTypes';

import { fetchGames } from '../dao';

export function getGameList(page, {
  sort, pf, dlc,
  title = ''
}) {
  return dispatch => {
    return fetchGames({ page, sort, pf, dlc, title })
      .then(response => {
        dispatch(gotGameList(response, page));
      }).catch(err => {
        console.error('game.js line12', err)
        dispatch(gotGameListError());
        global.toast && global.toast('网络错误', 2000);
      });
  }
}

function gotGameList(argument, page) {
  return {
    type: ActionTypes.GET_GAMES_SUCCESS,
    value: argument,
    page: page,
  };
}

function gotGameListError() {
  return {
    type: ActionTypes.GET_GAMES_ERROR,
  };
}
