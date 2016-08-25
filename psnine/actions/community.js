import React, {NativeModules} from 'react-native';
import * as ActionTypes from '../constants/actionTypes';

import { fetchTopics } from '../dao/dao';
import { changeRefreshing, changeLoadingMore } from './app';

export function getTopicList(page = 1, type = '') {
    return dispatch => {
        if (page === 1) {
            dispatch(changeRefreshing(true));
        }else{
         	dispatch(changeLoadingMore(true)); 
        };

        return fetchTopics(page, type)
            .then(response => {
                dispatch(gotTopicList(response,page));
                if (page === 1) {
                    dispatch(changeRefreshing(false));
                } else {
                    dispatch(changeLoadingMore(false));
                }
            }).catch(err => {
                dispatch(changeRefreshing(false));
                dispatch(changeLoadingMore(false));
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
