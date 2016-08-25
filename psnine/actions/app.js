import React, {NativeModules} from 'react-native';
import * as ActionTypes from '../constants/actionTypes';

export function changeRefreshing(argument) {
    return {
        type: ActionTypes.IS_REFRESHING,
        value: argument,
    }
}

export function changeLoadingMore(argument) {
    return {
        type: ActionTypes.IS_LOAD_MORE,
        value: argument
    }
}

export function changeSegmentIndex(argument) {
    return {
        type: ActionTypes.CHANGE_SEGMENTED_INDEX,
        value: argument
    }
}
