import React, {NativeModules} from 'react-native';
import * as ActionTypes from '../constants/actionTypes';

export function changeSegmentIndex(argument) {
    return {
        type: ActionTypes.CHANGE_SEGMENTED_INDEX,
        value: argument
    }
}

export function changeCommunityType(argument) {
    return {
        type: ActionTypes.CHANGE_COMMUNITY_TYPE,
        value: argument
    }
}

export function changeGeneType(argument) {
    return {
        type: ActionTypes.CHANGE_GENE_TYPE,
        value: argument
    }
}

