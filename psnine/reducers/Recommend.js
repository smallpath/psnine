import * as ActionTypes from '../constants/actionTypes';
import {
  AsyncStorage,
  Alert,
  Linking
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
    
    const shouldCall = text !== '' && (origin !== text || (origin === text && isDisabled === false))
    if (!shouldCall) {
      // if (isDisabled)
    } else {
      AsyncStorage.setItem('@psnine:disableWarning', '')
      AsyncStorage.setItem('@psnine:warning', text)
      const targetText = text.replace(/<a\s.*?>.*?<\/a>/igm, '').trim().replace('：', '')
      const matched = text.match(/<a\shref=\"(.*?)\">/)
      let button = undefined
      if (matched) {
        let url = matched[1]
        if (url.startsWith('/')) {
          url = 'http://psnine.com' + url
        }
        button = {
          text: '点我查看',
          onPress: () => {
            onP9LinkPress(url)
          }
        }
      }
      // console.log(text, text.length)
      Alert.alert(
        '提示',
        targetText,
        [
          {
            text: '不再提示', onPress: () => {
              AsyncStorage.setItem('@psnine:disableWarning', 'yes')
            }
          },
          button,
          {
            text: '确定', onPress: () => {}
          }
        ]
      )
    }
  })
}

const onP9LinkPress = url => {
  const reg = /^(https|http)\:\/\//
  const errHandler = (err) => Linking.openURL(url).catch(err => console.error('Web linking occurred', err))
  if (reg.exec(url)) {
    const target = url.replace(reg, 'p9://')
    return Linking.openURL(target).catch(errHandler);
  } else if (/^(.*?):\/\//.exec(url)) {
    return Linking.openURL(url).catch(err => console.error('Web linking occurred', err));
  } else {
    const target = 'p9://psnine.com' + url
    return Linking.openURL(target).catch(errHandler);
  }
}