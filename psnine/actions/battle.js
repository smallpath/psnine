import React, {NativeModules} from 'react-native';
import * as ActionTypes from '../constants/actionTypes';

import { fetchBattles } from '../dao/dao';

export function getBattleList() {
    return dispatch => {
        return fetchBattles()
            .then(response => {
                dispatch(gotBattleList(response.data));
            }).catch(err => {
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
