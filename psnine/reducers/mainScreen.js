import * as ActionTypes from '../constants/actionTypes';

const initialState = {
    segmentedIndex: 0,
    topicPage: 0,
    isRefreshing: false,
    isLoadingMore: false,
    indicatorShouldShow: false,
    totalTopicCount: 200,
    topics: [
        'John', 'Joel', 'James', 'Jimmy', 'Jackson', 'Jillian', 'Julie', 'Devin'
    ],
}

function reducer(state = initialState, action){
    let newState = state;
    switch (action.type){
        case ActionTypes.GET_TOPICS_SUCCESS:
            if(action.page === 1) {
                // console.log('刷新topics',action.value.data.length);
                newState = Object.assign({},state,{
                    topics: action.value.data,
                    topicPage: 1,
                });
            } else{
                // console.log('加载更多topics',action.value.data.length);
                newState = Object.assign({},state,{
                    topics: state.topics.concat(action.value.data),
                    topicPage: state.topicPage + 1,
                });
            }
            return newState;
        case ActionTypes.LOAD_MORE_TOPICS:
            // console.log(`加载更多?${action.value}`);
            newState = Object.assign({},state,{
                isLoadingMore: action.value,
                topics: state.topics.map(topic=>topic)
            });
            return newState;
        case ActionTypes.INDICATOR_SHOULD_SHOW:
            // console.log(`显示刷新indicator: ${action.value}`);
            newState = Object.assign({},state,{
                indicatorShouldShow: action.value,
                topics: state.topics.map(topic=>topic)
            });
            return newState;
        case ActionTypes.REFRESHING_TOPICS:
            // console.log(`设置主题页数为1`);
            newState = Object.assign({},state,{
                topicPage: 1,
                topics: state.topics.map(topic=>topic)
            });
            // console.log('Action结束时的主题页数:',newState.topicPage);
            return state;
        case ActionTypes.INCREASE_TOPIC_PAGE_NUMBER:
            // console.log(`主题页数+1`);
            newState = Object.assign({},state,{
                topicPage: state.topicPage + 1,
                topics: state.topics.map(topic=>topic)
            });
            // console.log('Action结束时的主题页数:',newState.topicPage);
            return state;
        case ActionTypes.IS_REFRESHING_TOPICS:
            // console.log(`开始或者结束刷新:`);
            newState = Object.assign({},state,{
                isRefreshing: !state.isLoadingMore,
                topics: state.topics.map(topic=>topic)
            })
            return state;
        default:
            return state;
    }
}

export default reducer;