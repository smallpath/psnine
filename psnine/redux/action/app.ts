import * as ActionTypes from '../../constant/actionTypes'

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

export function changeCircleType(argument) {
  return {
    type: ActionTypes.CHANGE_CIRCLE_TYPE,
    value: argument
  }
}

export function changeScrollType(argument) {
  return {
    type: ActionTypes.CHANGE_SCROLL_TYPE,
    value: argument
  }
}
