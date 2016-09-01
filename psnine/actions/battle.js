import React, {NativeModules} from 'react-native';
import * as ActionTypes from '../constants/actionTypes';

import { fetchBattles } from '../dao/dao';

export function getBattleList() {
    return dispatch => {

        dispatch(changeBattleRefreshing(true));

        return fetchBattles()
            .then(response => {
                dispatch(gotBattleList(response.data));
                dispatch(changeBattleRefreshing(false));
            }).catch(err => {
                dispatch(changeBattleRefreshing(false));
                console.log(err);
            });
    }
}

function gotBattleList(argument) {
    return {
        type: ActionTypes.GET_BATTLES_SUCCESS,
        value: argument,
    };
}

export function changeBattleRefreshing(argument) {
    return {
        type: ActionTypes.BATTLE_IS_REFRESHING,
        value: argument,
    }
}