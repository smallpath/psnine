import * as ActionTypes from '../constants/actionTypes';

const initialState = {
  page: 0,
  ranks: [],
  totalPage: 0
}

function reducer(state = initialState, action) {
  let newState = state;
  switch (action.type) {
    case ActionTypes.GET_RANK_SUCCESS:
      if (action.page === 1) {
        newState = Object.assign({}, state, {
          ranks: action.value,
          page: 1,
          totalPage: action.totalPage
        });
      } else {
        newState = Object.assign({}, state, {
          ranks: state.ranks.concat(action.value),
          page: state.page + 1,
          totalPage: action.totalPage
        });
      }
      return newState;
    case ActionTypes.GET_RANK_ERROR:
      newState = Object.assign({}, state, {
        page: 0,
        ranks: [],
        totalPage: 0
      });
    default:
      return state;
  }
}

export default reducer;