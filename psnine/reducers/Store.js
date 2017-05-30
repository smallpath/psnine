import * as ActionTypes from '../constants/actionTypes';

const initialState = {
  page: 0,
  list: [],
  numPages: 10
}

function reducer(state = initialState, action) {
  let newState = state;
  switch (action.type) {
    case ActionTypes.GET_STORE_SUCCESS:
      if (action.page === 1) {
        newState = Object.assign({}, state, {
          list: action.value.list,
          page: 1,
          numPages: action.value.numPages
        });
      } else {
        newState = Object.assign({}, state, {
          list: state.list.concat(action.value.list),
          page: state.page + 1,
          numPages: action.value.numPages
        });
      }
      return newState;
    case ActionTypes.GET_STORE_ERROR:
      newState = Object.assign({}, state, {
        page: 0,
        list: [],
        numPages: 10,
      });
    default:
      return state;
  }
}

export default reducer;