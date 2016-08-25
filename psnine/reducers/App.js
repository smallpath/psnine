import * as ActionTypes from '../constants/actionTypes';

const initialState = {
    segmentedIndex: 0,
    isRefreshing: false,
    isLoadingMore: false,
}

function reducer(state = initialState, action){
    let newState = state;
    switch (action.type){
        case ActionTypes.CHANGE_SEGMENTED_INDEX:
            newState = Object.assign({},state,{
                segmentedIndex: action.value,
            });
            return newState; 

        case ActionTypes.IS_REFRESHING:
            newState = Object.assign({},state,{
                isRefreshing: action.value,
            });
            return newState;

        case ActionTypes.IS_LOAD_MORE:
            newState = Object.assign({},state,{
                isLoadingMore: action.value,
            });
            return newState;


        default:
            return state;
    }
}

export default reducer;