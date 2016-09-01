import * as ActionTypes from '../constants/actionTypes';

const initialState = {
    battles: {},
    isRefreshing: false,
}

function reducer(state = initialState, action){
    let newState = state;
    switch (action.type){
        case ActionTypes.GET_BATTLES_SUCCESS:
                newState = Object.assign({},state,{
                    battles: action.value,
                });
            return newState;

        case ActionTypes.BATTLE_IS_REFRESHING:
            newState = Object.assign({},state,{
                isRefreshing: action.value,
            });
            return newState;

        default:
            return state;
    }
}

export default reducer;