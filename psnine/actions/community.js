import React, {NativeModules} from 'react-native';
import * as ActionTypes from '../constants/actionTypes';

import { fetchTopics } from '../dao/dao';

export function getTopicList(page = 1, type = '') {
    return dispatch => {
        return fetchTopics(page, type)
            .then(response => {
                dispatch(gotTopicList(response,page,type));
            }).catch(err => {
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
