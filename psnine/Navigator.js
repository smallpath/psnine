import { Provider } from 'react-redux'
import pathToRegexp from 'path-to-regexp';
import {
  StackNavigator,
} from 'react-navigation';

import App from './container/App.js'

import Home from './container/user/Home'
import Login from './container/user/Login'
import Message from './container/user/Message'
import UserGame from './container/user/UserGame'
import UserBoard from './container/user/UserBoard'
import Favorite from './container/user/Favorite'

import Trophy from './container/game/Trophy'
import GameTopic from './container/game/GameTopic'
import GamePage from './container/game/Game'
import GamePoint from './container/game/GamePoint'

import CommentList from './container/topic/CommentList'
import CommunityTopic from './container/topic/CommunityTopic'
import QaTopic from './container/topic/QaTopic'
import BattleTopic from './container/topic/BattleTopic'

import Circle from './container/circle/Circle'
import CircleTopic from './container/circle/CircleTopic'
import CircleRank from './container/circle/CircleRank'

import Reply from './container/new/Reply'
import NewTopic from './container/new/NewTopic'

import WebView from './components/WebView'
import About from './container/setting/About'
import Setting from './container/setting/Setting'
import Theme from './container/setting/Theme'
import General from './container/setting/General'
import ImageViewer from './components/ImageViewer'
import Search from './container/Search'

import { transitionConfig, onTransitionStart } from './utils/transitionConfig'

const enableGesture = ({ navigation }) => {
  return {
    gesturesEnabled: true
  }
}

const Navigator = StackNavigator({
  Main: {
    screen: App,
    path: '',
  },
  Search: {
    screen: Search,
    path: '',
  },
  Login: {
    screen: Login,
    navigationOptions: enableGesture,
    path: 'sign/in'
  },
  Message: {
    screen: Message,
    navigationOptions: enableGesture,
    path: 'my/notice'
  },
  CommentList: {
    screen: CommentList,
    navigationOptions: enableGesture,
    path: 'topic/:linkingID/comment'
  },
  GeneCommentList: {
    screen: CommentList,
    navigationOptions: enableGesture,
    path: 'gene/:linkingID/comment'
  },
  CommunityTopic: {
    screen: CommunityTopic,
    navigationOptions: enableGesture,
    path: 'topic/:linkingID'
  },
  GeneTopic: {
    screen: CommunityTopic,
    navigationOptions: enableGesture,
    path: 'gene/:linkingID'
  },
  QaTopic: {
    screen: QaTopic,
    navigationOptions: enableGesture,
    path: 'qa/:linkingID'
  },
  BattleTopic: {
    screen: BattleTopic,
    navigationOptions: enableGesture,
    path: 'battle/:linkingID'
  },
  GamePage: {
    screen: GamePage,
    navigationOptions: enableGesture,
    path: 'psngame/:linkingID'
  },
  GameTopic: {
    screen: GameTopic,
    psngame: 'psngame/:linkingID/topic'
  },
  GamePoint: {
    screen: GamePoint,
    psngame: 'psngame/:linkingID/comment'
  },
  Favorite: {
    screen: Favorite,
    psngame: 'my/fav'
  },
  Home: {
    screen: Home,
    path: 'psnid/:linkingID',
  },
  Reply: {
    screen: Reply
  },
  UserGame: {
    screen: UserGame,
    path: 'psnid/:linkingID/psngame'
  },
  UserBoard: {
    screen: UserGame,
    path: 'psnid/:linkingID/comment'
  },
  NewTopic: {
    screen: NewTopic
  },
  Trophy: {
    screen: Trophy,
    path: 'trophy/:linkingID'
  },
  Circle: {
    screen: Circle,
  },
  CircleTopic: {
    screen: CircleTopic
  },
  CircleRank: {
    screen: CircleRank
  },
  About: {
    screen: About,
    navigationOptions: enableGesture
  },
  General: {
    screen: General,
    navigationOptions: enableGesture
  },
  Theme: {
    screen: Theme,
    navigationOptions: enableGesture
  },
  Setting: {
    screen: Setting,
    navigationOptions: enableGesture
  },
  WebView: {
    screen: WebView
  },
  ImageViewer: {
    screen: ImageViewer
  }
}, {
    initialRouteName: 'Main',
    headerMode: 'none',
    mode: 'card',
    navigationOptions: {
      cardStack: {
        gesturesEnabled: true,
      }
    },
    cardStyle: {
      backgroundColor: 'transparent',
      // opacity: 0.99
    },
    transitionConfig,
    onTransitionStart
  });

let backPressClickTimeStamp = 0

const previousGetActionForPathAndParams = Navigator.router.getActionForPathAndParams;

Object.assign(Navigator.router, {
  getActionForPathAndParams(path, params) {
    const action = previousGetActionForPathAndParams(path, params)
    if (action && action.params && action.params.linkingID) {
      const id = action.params.linkingID
      switch (action.routeName) {
        case 'Home':
          action.params.title = `${id}`
          action.params.URL = `http://psnine.com/${path}`
          break;
        case 'CommunityTopic':
        case 'GeneTopic':
        case 'QaTopic':
        case 'BattleTopic':
        case 'GamePage':
          action.params.URL = `http://psnine.com/${path}`
          action.params.rowData = {
            id
          }
          break;
        case 'CommentList':
        case 'GeneCommentList':
        case 'GameTopic':
        case 'UserGame':
          action.params.URL = `http://psnine.com/${path}?page=1`
          break;
        case 'Trophy':
          action.params.URL = `http://psnine.com/${path}`
          action.params.title = `No.${id}`
          break;
      }
    }

    return action
  }
})

export default Navigator