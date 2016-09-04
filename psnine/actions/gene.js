import React, {NativeModules} from 'react-native';
import * as ActionTypes from '../constants/actionTypes';

import { fetchGenes } from '../dao/dao';

export function getGeneList(page = 1, type = '') {
    return dispatch => {
        return fetchGenes(page, type)
            .then(response => {
                dispatch(gotGeneList(response,page,type));
            }).catch(err => {
                console.log(err);
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

