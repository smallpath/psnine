import React, {NativeModules} from 'react-native';
import * as ActionTypes from '../constants/actionTypes';

import { fetchGenes } from '../dao/dao';

export function getGeneList(page = 1, type = '') {
    return dispatch => {
        if (page === 1) {
            dispatch(changeGeneRefreshing(true));
        }else{
         	dispatch(changeGeneLoadingMore(true)); 
        };

        return fetchGenes(page, type)
            .then(response => {
                dispatch(gotGeneList(response,page,type));
                if (page === 1) {
                    dispatch(changeGeneRefreshing(false));
                } else {
                    dispatch(changeGeneLoadingMore(false));
                }
            }).catch(err => {
                dispatch(changeGeneRefreshing(false));
                dispatch(changeGeneLoadingMore(false));
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


export function changeGeneRefreshing(argument) {
    return {
        type: ActionTypes.GENE_IS_REFRESHING,
        value: argument,
    }
}

export function changeGeneLoadingMore(argument) {
    return {
        type: ActionTypes.GENE_IS_LOADINGD_MORE,
        value: argument
    }
}

