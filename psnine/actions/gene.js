import React, {NativeModules} from 'react-native';
import * as ActionTypes from '../constants/actionTypes';

import { fetchGenes } from '../dao/dao';
import { changeRefreshing, changeLoadingMore } from './app';

export function getGeneList(page = 1, type = '') {
    return dispatch => {
        if (page === 1) {
            dispatch(changeRefreshing(true));
        }else{
         	dispatch(changeLoadingMore(true)); 
        };

        return fetchGenes(page, type)
            .then(response => {
                dispatch(gotGeneList(response,page,type));
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

function gotGeneList(argument, page, type) {
    return {
        type: ActionTypes.GET_GENES_SUCCESS,
        value: argument,
        page: page,
    };
}
