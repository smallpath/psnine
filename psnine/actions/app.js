import React, {NativeModules} from 'react-native';
import * as ActionTypes from '../constants/actionTypes';

export function changeSegmentIndex(argument) {
    return {
        type: ActionTypes.CHANGE_SEGMENTED_INDEX,
        value: argument
    }
}
