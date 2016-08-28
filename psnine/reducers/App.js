import * as ActionTypes from '../constants/actionTypes';

const initialState = {
    segmentedIndex: 0,
}

function reducer(state = initialState, action){
    let newState = state;
    switch (action.type){
        case ActionTypes.CHANGE_SEGMENTED_INDEX:
            newState = Object.assign({},state,{
                segmentedIndex: action.value,
            });
            return newState; 
        default:
            return state;
    }
}

export default reducer;