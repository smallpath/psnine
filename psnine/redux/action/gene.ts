import * as ActionTypes from '../../constant/actionTypes'

import { fetchGenes } from '../../dao'

export function getGeneList(page = 1, {
  type = '',
  title = ''
}) {
  return dispatch => {
    // console.log(page, type, title)
    return fetchGenes({ page, type, title })
      .then(response => {
        dispatch(gotGeneList(response, page, type))
      }).catch(err => {
        dispatch(gotGeneListError())
        console.log(err)
        global.toast && global.toast('网络错误', 2000)
      })
  }
}

function gotGeneList(argument, page, type) {
  return {
    type: ActionTypes.GET_GENES_SUCCESS,
    value: argument,
    page: page
  }
}

function gotGeneListError(argument, page, type) {
  return {
    type: ActionTypes.GET_GENES_ERROR
  }
}
