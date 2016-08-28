import * as ActionTypes from '../constants/actionTypes';

const initialState = {
    topicPage: 0,
    topics: [],
    isRefreshing: false,
    isLoadingMore: false,
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

        case ActionTypes.TOPIC_IS_REFRESHING:
            newState = Object.assign({},state,{
                isRefreshing: action.value,
                topics: [].concat(state.topics),
            });
            return newState;

        case ActionTypes.TOPIC_IS_LOADING_MORE:
            newState = Object.assign({},state,{
                isLoadingMore: action.value,
                topics: [].concat(state.topics),
            });
            return newState;
        default:
            return state;
    }
}

export default reducer;