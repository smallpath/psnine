import React, { ToastAndroid } from 'react-native'
import * as ActionTypes from '../constants/actionTypes'

import { fetchBattles } from '../dao'

export function getBattleList() {
  return dispatch => {
    return fetchBattles()
      .then(response => {
        dispatch(gotBattleList(response))
      }).catch(err => {
        console.error(err)
        dispatch(gotBattleListError())
        global.toast && global.toast('网络错误', 2000)
        dispatch(gotBattleList([]))
      })
  }
}

function gotBattleList(argument) {
  return {
    type: ActionTypes.GET_BATTLES_SUCCESS,
    value: argument
  }
}

function gotBattleListError(argument, page, type) {
  return {
    type: ActionTypes.GET_BATTLES_ERROR
  }
}