import React, { ToastAndroid } from 'react-native';
import * as ActionTypes from '../constants/actionTypes';

import { fetchBattles } from '../dao/dao';

export function getBattleList() {
    return dispatch => {
        return fetchBattles()
            .then(response => {
                dispatch(gotBattleList(response.data));
            }).catch(err => {
                dispatch(gotBattleListError());
                ToastAndroid.show('网络错误',2000);
            });
    }
}

function gotBattleList(argument) {
    return {
        type: ActionTypes.GET_BATTLES_SUCCESS,
        value: argument,
    };
}

function gotBattleListError(argument, page, type) {
    return {
        type: ActionTypes.GET_BATTLES_ERROR,
    };
}