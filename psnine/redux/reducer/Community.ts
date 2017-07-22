import * as ActionTypes from '../../constant/actionTypes'

const initialState = {
  topicPage: 0,
  topics: []
}

function reducer(state = initialState, action) {
  let newState = state
  switch (action.type) {
    case ActionTypes.GET_TOPICS_SUCCESS:
      if (action.page === 1) {
        newState = Object.assign({}, state, {
          topics: action.value,
          topicPage: 1
        })
      } else {
        newState = Object.assign({}, state, {
          topics: state.topics.concat(action.value),
          topicPage: state.topicPage + 1
        })
      }
      return newState
    case ActionTypes.GET_TOPICS_RECOMMEND_SUCCESS:
      if (state.topicPage === 0) {
        return newState = Object.assign({}, state, {
          topics: state.topics.concat(action.value),
          topicPage: 1
        })
      } else {
        return state
      }
    case ActionTypes.GET_TOPICS_ERROR:
      newState = Object.assign({}, state, {
        topicPage: 0,
        topics: []
      })
    default:
      return state
  }
}

export default reducer