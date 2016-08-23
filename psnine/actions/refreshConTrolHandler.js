import * as ActionTypes from '../constants/actionTypes';

export function showIndicator(argument){
    return {
        type: ActionTypes.INDICATOR_SHOULD_SHOW,
        value: argument
    }
}