import * as ActionTypes from '../../constant/actionTypes'

const initialState = {
  notifyText: '同步中',
  gameList: [],
  trophyList: [],
  statsInfo: {},
  unearnedTrophyList: [],
  isLoading: false
}

function reducer(state = initialState, action) {
  let newState = state
  switch (action.type) {
    case ActionTypes.CHANGE_STATS_LOADING:
      newState = Object.assign({}, state, {
        isLoading: action.value
      })
      return newState
    case ActionTypes.GET_STATS_SUCCESS:
      newState = Object.assign({}, state, action.value, {
        notifyText: '同步中',
        isLoading: false
      })
      return newState
    case ActionTypes.GET_STATS_ERROR:
      return initialState
    case ActionTypes.SET_NOTIFY:
      newState = Object.assign({}, state, {
        notifyText: action.value
      })
      return newState
    default:
      return state
  }
}

export default reducer