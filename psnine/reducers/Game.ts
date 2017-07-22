import * as ActionTypes from '../constants/actionTypes'

const initialState = {
  page: 0,
  games: []
}

function reducer(state = initialState, action) {
  let newState = state
  switch (action.type) {
    case ActionTypes.GET_GAMES_SUCCESS:
      if (action.page === 1) {
        newState = Object.assign({}, state, {
          games: action.value,
          page: 1
        })
      } else {
        newState = Object.assign({}, state, {
          games: state.games.concat(action.value),
          page: state.page + 1
        })
      }
      return newState
    case ActionTypes.GET_GAMES_ERROR:
      newState = Object.assign({}, state, {
        page: 0,
        games: []
      })
    default:
      return state
  }
}

export default reducer