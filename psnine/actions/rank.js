import React, { ToastAndroid } from 'react-native';
import * as ActionTypes from '../constants/actionTypes';

import { fetchRanks } from '../dao';

export function getRankList(page, sort, server, cheat) {
  return dispatch => {
    return fetchRanks(page, sort, server, cheat)
      .then(response => {
        dispatch(gotRankList(response.list, page, response.totalPage));
      }).catch(err => {
        console.error('rank.js line12', err)
        dispatch(gotRankListError());
        global.toast && global.toast('网络错误', 2000);
      });
  }
}

function gotRankList(argument, page, totalPage) {
  return {
    type: ActionTypes.GET_RANK_SUCCESS,
    value: argument,
    page: page,
    totalPage: totalPage
  };
}

function gotRankListError() {
  return {
    type: ActionTypes.GET_RANK_ERROR,
  };
}
