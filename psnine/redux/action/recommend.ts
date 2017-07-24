import * as ActionTypes from '../../constant/actionTypes'
import { getMainAPI } from '../../dao'
declare var global

export function getRecommend() {
  return dispatch => {
    return getMainAPI()
      .then(response => {
        dispatch(got(response))
        dispatch({
          type: ActionTypes.GET_TOPICS_RECOMMEND_SUCCESS,
          value: response.list,
          page: 1
        })
      }).catch(err => {
        console.error(err)
        dispatch(gotError())
        global.toast('网络错误', 2000)
        dispatch(got([]))
      })
  }
}

function got(argument) {
  return {
    type: ActionTypes.GET_RECOMMEND_SUCCESS,
    value: argument
  }
}

function gotError() {
  return {
    type: ActionTypes.GET_RECOMMEND_ERROR
  }
}
