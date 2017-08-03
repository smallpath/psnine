import * as ActionTypes from '../../constant/actionTypes'
import { fetchDiscountList } from '../../dao'
declare var global

export function getDiscountList(page = 1, {
  ddstatus = 'all',
  pf = 'all',
  region = 'all',
  title = ''
}) {
  return dispatch => {
    return fetchDiscountList({ page, title, ddstatus, region, pf })
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
    type: ActionTypes.GET_DISCOUNT_SUCCESS,
    value: argument,
    page: page
  }
}

function gotListError() {
  return {
    type: ActionTypes.GET_DISCOUNT_ERROR
  }
}
