import React, {NativeModules} from 'react-native';
import * as ActionTypes from '../constants/actionTypes';

import { fetchTopics } from '../dao/dao';

export function getTopicList(page = 1, type = '', callback) {
    return dispatch => {
        if (page === 1) {
            dispatch(changeTopicRefreshing(true));
        }else{
         	dispatch(changeTopicLoadingMore(true)); 
        };

        return fetchTopics(page, type)
            .then(response => {
                dispatch(gotTopicList(response,page,type));
                if (typeof callback == 'function'){
                    callback(); 
                }
                if (page === 1) {
                    dispatch(changeTopicRefreshing(false));
                } else {
                    dispatch(changeTopicLoadingMore(false));
                }
            }).catch(err => {
                dispatch(changeTopicRefreshing(false));
                dispatch(changeTopicLoadingMore(false));
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

export function changeTopicRefreshing(argument) {
    return {
        type: ActionTypes.TOPIC_IS_REFRESHING,
        value: argument,
    }
}

export function changeTopicLoadingMore(argument) {
    return {
        type: ActionTypes.TOPIC_IS_LOADING_MORE,
        value: argument
    }
}
