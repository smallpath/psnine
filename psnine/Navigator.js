import { Provider } from 'react-redux'
import pathToRegexp from 'path-to-regexp';
import {
  StackNavigator,
} from 'react-navigation';

import { GoogleAnalyticsTracker } from 'react-native-google-analytics-bridge';

import App from './container/App.js'

import Home from './container/user/Home'
import Login from './container/user/Login'
import Message from './container/user/Message'
import UserGame from './container/user/UserGame'
import UserBoard from './container/user/UserBoard'
import Favorite from './container/user/Favorite'
import Issue from './container/user/Issue'

import Trophy from './container/game/Trophy'
import GameTopic from './container/game/GameTopic'
import GameNewTopic from './container/game/GameNewTopic'
import GamePage from './container/game/Game'
import GamePoint from './container/game/GamePoint'
import GameBattle from './container/game/GameBattle'
import GameQa from './container/game/GameQa'
import GameRank from './container/game/GameRank'
import GameList from './container/game/GameList'

import CommentList from './container/topic/CommentList'
import CommunityTopic from './container/topic/CommunityTopic'
import QaTopic from './container/topic/QaTopic'
import BattleTopic from './container/topic/BattleTopic'
import TradeTopic from './container/topic/TradeTopic'
import StoreTopic from './container/topic/StoreTopic'

import Circle from './container/circle/Circle'
import CircleRank from './container/circle/CircleRank'

import Reply from './container/new/Reply'
import Toolbar from './container/new/Toolbar'
import NewTopic from './container/new/NewTopic'
import NewBattle from './container/new/NewBattle'
import NewGene from './container/new/NewGene'
import NewTrade from './container/new/NewTrade'
import NewQa from './container/new/NewQa'

import WebView from './components/WebView'
import About from './container/setting/About'
import PsnineAbout from './container/setting/PsnineAbout'
import Setting from './container/setting/Setting'
import Theme from './container/setting/Theme'
import Reading from './container/setting/Reading'
import General from './container/setting/General'
import ImageViewer from './components/ImageViewer'
import Search from './container/Search'
import Pass from './container/user/Pass'
import UserElement from './container/user/Element'
import UserPhoto from './container/user/Photo'
import UserDetail from './container/user/Detail'
import UserCustom from './container/user/Custom'
import UserBlock from './container/user/Block'
import ImageUpload from './container/user/ImageUpload'

import { transitionConfig, onTransitionStart } from './utils/transitionConfig'

const enableGesture = ({ navigation }) => {
  return {
    gesturesEnabled: false
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
  Pass: {
    screen: Pass
  },
  Login: {
    screen: Login,
    path: 'sign/in'
  },
  Issue: {
    screen: Issue
  },
  UserElement: {
    screen: UserElement
  },
  UserDetail: {
    screen: UserDetail
  },
  UserCustom: {
    screen: UserCustom
  },
  UserPhoto: {
    screen: UserPhoto
  },
  ImageUpload: {
    screen: ImageUpload
  },
  Message: {
    screen: Message,
    path: 'my/notice'
  },
  PsnineAbout: {
    screen: PsnineAbout
  },
  GameNewTopic: {
    screen: GameNewTopic
  },
  GameBattle: {
    screen: GameBattle
  },
  GameQa: {
    screen: GameQa
  },
  GameRank: {
    screen: GameRank
  },
  GameList: {
    screen: GameList
  },
  CommentList: {
    screen: CommentList,
    path: 'topic/:linkingID/comment'
  },
  GeneCommentList: {
    screen: CommentList,
    path: 'gene/:linkingID/comment'
  },
  CommunityTopic: {
    screen: CommunityTopic,
    path: 'topic/:linkingID'
  },
  GeneTopic: {
    screen: CommunityTopic,
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
  TradeTopic: {
    screen: TradeTopic,
    navigationOptions: enableGesture,
    path: 'trade/:linkingID'
  },
  GamePage: {
    screen: GamePage,
    navigationOptions: enableGesture,
    path: 'psngame/:linkingID'
  },
  GameTopic: {
    screen: GameTopic,
    path: 'psngame/:linkingID/topic'
  },
  GamePoint: {
    screen: GamePoint,
    path: 'psngame/:linkingID/comment'
  },
  Favorite: {
    screen: Favorite,
    path: 'my/fav'
  },
  StoreTopic: {
    screen: StoreTopic
  },
  Home: {
    screen: Home,
    path: 'psnid/:linkingID',
  },
  Reply: {
    screen: Reply
  },
  Reading: {
    screen: Reading
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
  NewQa: {
    screen: NewQa
  },
  NewTrade: {
    screen: NewTrade
  },
  UserBlock: {
    screen: UserBlock
  },
  Toolbar: {
    screen: Toolbar
  },
  NewGene: {
    screen: NewGene
  },
  NewBattle: {
    screen: NewBattle
  },
  Trophy: {
    screen: Trophy,
    path: 'trophy/:linkingID'
  },
  Circle: {
    screen: Circle,
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

const replyTypeMapper = {
  'CommunityTopic': 'community',
  'GeneTopic': 'gene',
  'QaTopic': 'qa',
  'BattleTopic': 'battle',
  'GamePage': 'game',
}

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
          action.params.type = replyTypeMapper[action.routeName] || 'gene'
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

export function getCurrentRoute(navigationState) {
  if (!navigationState) {
    return null;
  }
  const route = navigationState.routes[navigationState.index]
  // dive into nested navigators
  if (route.routes) {
    return getCurrentRoute(route)
  }
  return route
}

export const tracker = new GoogleAnalyticsTracker('UA-101225387-1')
