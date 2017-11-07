import * as ActionTypes from '../../constant/actionTypes'
import { getTrophyList as core } from '../../utils/statistics'
declare var global

export function getTrophyList(psnid, data, forceNew) {
  return dispatch => {
    dispatch(changeLoading(true))
    const callback = notifyCallback.bind(data, dispatch)
    return core(psnid, callback, forceNew)
      .then(response => {
        dispatch(getSuccess(response))
        return response
      }).catch(err => {
        console.error('stats.js line12', err)
        dispatch(getError('ww'))
        global.toast && global.toast('网络错误', 2000)
      })
  }
}

function notifyCallback(dispatch, {
  gameIndex,
  gameInfo,
  title
}) {
  const text = title || `正在同步 ${gameInfo.title} (${gameIndex}/${this.playerInfo.allGames})`
  dispatch(notify(text))
}

function getSuccess(argument) {
  return {
    type: ActionTypes.GET_STATS_SUCCESS,
    value: argument
  }
}

function getError(argument) {
  return {
    type: ActionTypes.GET_STATS_ERROR,
    value: argument
  }
}

function notify(argument) {
  return {
    type: ActionTypes.SET_NOTIFY,
    value: argument
  }
}

function changeLoading(argument) {
  return {
    type: ActionTypes.CHANGE_STATS_LOADING,
    value: argument
  }
}
