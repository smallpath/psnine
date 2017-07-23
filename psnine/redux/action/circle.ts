import * as ActionTypes from '../../constant/actionTypes'

import { fetchCircles } from '../../dao'

export function getCircleList(page = 1, {
  type = '',
  title = ''
}) {
  return dispatch => {
    return fetchCircles({ page, type, title })
      .then(response => {
        dispatch(gotList(response, page, type))
      }).catch(err => {
        console.error('circleActionError', err)
        dispatch(gotListError())
        global.toast && global.toast('网络错误', 2000)
      })
  }
}

function gotList(argument, page, type) {
  return {
    type: ActionTypes.GET_CIRCLE_SUCCESS,
    value: argument,
    page: page
  }
}

function gotListError() {
  return {
    type: ActionTypes.GET_CIRCLE_ERROR
  }
}
