import * as ActionTypes from '../../constant/actionTypes'

const initialState = {
  page: 0,
  list: []
}

function reducer(state = initialState, action) {
  let newState = state
  switch (action.type) {
    case ActionTypes.GET_DISCOUNT_SUCCESS:
      if (action.page === 1) {
        newState = Object.assign({}, state, {
          list: action.value,
          page: 1
        })
      } else {
        newState = Object.assign({}, state, {
          list: state.list.concat(action.value),
          page: state.page + 1
        })
      }
      return newState
    case ActionTypes.GET_DISCOUNT_ERROR:
      newState = Object.assign({}, state, {
        page: 0,
        list: []
      })
      return newState
    default:
      return state
  }
}

export default reducer