import * as ActionTypes from '../constants/actionTypes';
import {
  AsyncStorage,
  Alert
} from 'react-native'

const initialState = {
  hotGames: [],
  nodes: [],
  tips: [],
  comment: [],
  warning: ''
}

function reducer(state = initialState, action) {
  let newState = state;
  switch (action.type) {
    case ActionTypes.GET_RECOMMEND_SUCCESS:
      const { hotGames, nodes, comment, tips, warning } = action.value
      newState = Object.assign({}, state, {
        hotGames: hotGames.slice(),
        nodes: nodes.slice(),
        tips: tips.slice(),
        comment: comment.slice(),
        warning: warning.toString(),
      });
      callWarning(warning)
      return newState;
    case ActionTypes.GET_RECOMMEND_ERROR:
      return state
    default:
      return state;
  }
}

export default reducer;

function callWarning (text) {
  Promise.all([
    AsyncStorage.getItem('@psnine:disableWarning'),
    AsyncStorage.getItem('@psnine:warning')
  ]).then(arr => {
    const isDisabled = !!arr[0]
    const origin = arr[1] || ''
    
    const shouldCall = origin !== text || (origin === text && isDisabled === false)
    if (!shouldCall) {
      // if (isDisabled)
    } else {
      AsyncStorage.setItem('@psnine:disableWarning', '')
      AsyncStorage.setItem('@psnine:warning', text)
      Alert.alert(
        '提示',
        text,
        [
          {
            text: '不再提示', onPress: () => {
              AsyncStorage.setItem('@psnine:disableWarning', 'yes')
            }
          },

          ,
          {
            text: '确定', onPress: () => {}
          }
        ]
      )
    }
  })
}