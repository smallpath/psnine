import * as ActionTypes from '../../constant/actionTypes'

import { fetchStores } from '../../dao'

export function getList(page = 1, {
  server = 'hk',
  ob = 'reledate',
  pf = 'all',
  plus = 'all',
  title = ''
}) {
  return dispatch => {
    return fetchStores({ page, title, server, ob, pf, plus })
      .then(response => {
        dispatch(gotList(response, page))
      }).catch(err => {
        console.error('communityError', err)
        dispatch(gotListError())
        global.toast && global.toast('网络错误', 2000)
      })
  }
}

function gotList(argument, page) {
  return {
    type: ActionTypes.GET_STORE_SUCCESS,
    value: argument,
    page: page
  }
}

function gotListError() {
  return {
    type: ActionTypes.GET_STORE_ERROR
  }
}
