import React, { ToastAndroid } from 'react-native';
import * as ActionTypes from '../constants/actionTypes';

import { fetchQuestion } from '../dao';

export function getQAList(page, type, sort) {
  return dispatch => {
    return fetchQuestion(page, type, sort)
      .then(response => {
        dispatch(gotQAList(response, page, type));
      }).catch(err => {
        console.error('qa.js line12', err)
        dispatch(gotQAListError());
        global.toast && global.toast('网络错误', 2000);
      });
  }
}

function gotQAList(argument, page, type) {
  return {
    type: ActionTypes.GET_QAS_SUCCESS,
    value: argument,
    page: page,
  };
}

function gotQAListError() {
  return {
    type: ActionTypes.GET_QAS_ERROR,
  };
}
