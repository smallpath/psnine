import * as ActionTypes from '../../constant/actionTypes'
import { fetchTopics } from '../../dao'
declare var global

export function getTopicList(page = 1, {
  type = '',
  title = ''
}) {
  return dispatch => {
    return fetchTopics({ page, type, title })
      .then(response => {
        dispatch(gotTopicList(response, page))
      }).catch(err => {
        console.error('communityError', err)
        dispatch(gotTopicListError())
        global.toast && global.toast('网络错误', 2000)
      })
  }
}

function gotTopicList(argument, page) {
  return {
    type: ActionTypes.GET_TOPICS_SUCCESS,
    value: argument,
    page: page
  }
}

function gotTopicListError() {
  return {
    type: ActionTypes.GET_TOPICS_ERROR
  }
}
