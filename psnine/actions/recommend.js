import React, { ToastAndroid } from 'react-native';
import * as ActionTypes from '../constants/actionTypes';

import { getMainAPI } from '../dao';

export function getRecommend() {
  return dispatch => {
    return getMainAPI()
      .then(response => {
        dispatch(got(response));
      }).catch(err => {
        console.error(err)
        dispatch(gotError());
        global.toast && global.toast('网络错误', 2000);
        dispatch(got([]));
      });
  }
}

function got(argument) {
  return {
    type: ActionTypes.GET_RECOMMEND_SUCCESS,
    value: argument,
  };
}

function gotError(argument, page, type) {
  return {
    type: ActionTypes.GET_RECOMMEND_ERROR,
  };
}