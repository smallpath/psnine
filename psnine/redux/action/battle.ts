import * as ActionTypes from '../../constant/actionTypes'

import { fetchBattles } from '../../dao'

declare var global

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

function gotBattleListError() {
  return {
    type: ActionTypes.GET_BATTLES_ERROR
  }
}