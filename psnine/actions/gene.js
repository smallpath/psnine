import React, { ToastAndroid } from 'react-native';
import * as ActionTypes from '../constants/actionTypes';

import { fetchGenes } from '../dao/dao';

export function getGeneList(page = 1, type = '') {
    return dispatch => {
        return fetchGenes(page, type)
            .then(response => {
                dispatch(gotGeneList(response,page,type));
            }).catch(err => {
                dispatch(gotGeneListError());
                console.log(err)
                global.toast && global.toast('网络错误',2000);
            });
    }
}

function gotGeneList(argument, page, type) {
    return {
        type: ActionTypes.GET_GENES_SUCCESS,
        value: argument,
        page: page,
    };
}

function gotGeneListError(argument, page, type) {
    return {
        type: ActionTypes.GET_GENES_ERROR,
    };
}
