import * as ActionTypes from '../constants/actionTypes'

const initialState = {
  battles: {}
}

function reducer(state = initialState, action) {
  let newState = state
  switch (action.type) {
    case ActionTypes.GET_BATTLES_SUCCESS:
      newState = Object.assign({}, state, {
        battles: action.value
      })
      return newState
    case ActionTypes.GET_BATTLES_ERROR:
      newState = Object.assign({}, state, {
        battles: {}
      })
    default:
      return state
  }
}

export default reducer