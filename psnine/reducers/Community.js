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
        case ActionTypes.REFRESHING_TOPICS:
            newState = Object.assign({},state,{
                topicPage: 1,
                topics: state.topics.map(topic=>topic)
            });
            return state;
        case ActionTypes.INCREASE_TOPIC_PAGE_NUMBER:
            newState = Object.assign({},state,{
                topicPage: state.topicPage + 1,
                topics: state.topics.map(topic=>topic)
            });
            return state;
        default:
            return state;
    }
}

export default reducer;