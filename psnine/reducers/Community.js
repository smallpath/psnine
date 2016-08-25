import * as ActionTypes from '../constants/actionTypes';

const initialState = {
    topicPage: 0,
    topics: [],
}

function reducer(state = initialState, action){
    let newState = state;
    switch (action.type){
        case ActionTypes.GET_TOPICS_SUCCESS:
            if(action.page === 1) {
                newState = Object.assign({},state,{
                    topics: action.value.data,
                    topicPage: 1,
                });
            } else{
                newState = Object.assign({},state,{
                    topics: state.topics.concat(action.value.data),
                    topicPage: state.topicPage + 1,
                });
            }
            return newState;
        default:
            return state;
    }
}

export default reducer;