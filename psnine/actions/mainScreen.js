import React, {NativeModules} from 'react-native';
import * as ActionTypes from '../constants/actionTypes';

import { fetchTopics } from '../dao/dao';

export function getTopicList(page = 1, type = '') {
    return dispatch => {
        if (page === 1) {
            dispatch(changeTopicListRefreshing(true));
        }else{
         	dispatch(changeTopicListLoadingMore(true)); 
        };

        return fetchTopics(page, type)
            .then(response => {
                dispatch(gotTopicList(response,page));
                // console.log(`---> 成功加载${response.data.length}条`);
                if (page === 1) {
                    dispatch(changeTopicListRefreshing(false));
                    // dispatch(changePageNumberToDefault());
                } else {
                    dispatch(changeTopicListLoadingMore(false));
                    // dispatch(changePageNumberIncreasing());
                }
            }).catch(err => {
                dispatch(changeTopicListRefreshing(false));
                dispatch(changeTopicListLoadingMore(false));
                console.log(err);
            });
    }
}

function gotTopicList(argument, page, type) {
    return {
        type: ActionTypes.GET_TOPICS_SUCCESS,
        value: argument,
        page: page,
    };
}

export function changePageNumberIncreasing(argument){
    return {
        type: ActionTypes.INCREASE_TOPIC_PAGE_NUMBER,
        value: argument,
    }
}

export function changePageNumberToDefault(argument){
    return {
        type: ActionTypes.REFRESHING_TOPICS,
        value: argument,
    }
}

export function changeTopicListRefreshing(argument) {
    return {
        type: ActionTypes.IS_REFRESHING_TOPICS,
        value: argument,
    }
}

export function changeTopicListLoadingMore(argument) {
    return {
        type: ActionTypes.LOAD_MORE_TOPICS,
        value: argument
    }
}
