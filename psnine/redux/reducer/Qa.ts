import * as ActionTypes from '../../constant/actionTypes'

const initialState = {
  page: 0,
  qas: []
}

function reducer(state = initialState, action) {
  let newState = state
  switch (action.type) {
    case ActionTypes.GET_QAS_SUCCESS:
      if (action.page === 1) {
        newState = Object.assign({}, state, {
          qas: action.value,
          page: 1
        })
      } else {
        newState = Object.assign({}, state, {
          qas: state.qas.concat(action.value),
          page: state.page + 1
        })
      }
      return newState
    case ActionTypes.GET_QAS_ERROR:
      newState = Object.assign({}, state, {
        page: 0,
        qas: []
      })
    default:
      return state
  }
}

export default reducer