import React from 'react'
import {
  BackHandler,
  Dimensions,
  ToastAndroid,
  StatusBar,
  View,
  Animated,
  Button,
  Text,
  Easing,
  Linking,
  InteractionManager
} from 'react-native';
import { Provider } from 'react-redux'
import pathToRegexp from 'path-to-regexp';
import {
  StackNavigator,
} from 'react-navigation';
import {
  accentColor,
  deepColor, standardColor, tintColor,
  nightDeepColor, nightStandardColor, nightTintColor,

  backgroundColor, nightBackgroundColor,
  backgroundColorBrighterLevelOne,
  nightBackgroundColorBrighterLevelOne,
  standardTextColor, nightStandardTextColor,
  titleTextColor, nightTitleTextColor,
  okColor
} from './constants/colorConfig';

import configureStore from './store/store.js'
import moment from './utils/moment';

const store = configureStore();

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

let toolbarHeight = 56
const tipHeight = toolbarHeight * 0.8

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

class Root extends React.Component {
  constructor(props) {
    super(props);

    let hour = ~~moment().format('HH');

    this.state = {
      text: '',
      isNightMode: false,//hour >= 22 || hour < 7,
      tipBarMarginBottom: new Animated.Value(0)
    };

    this.dayModeInfo = {
      isNightMode: false,
      accentColor: accentColor,
      deepColor: deepColor,
      standardColor: standardColor,
      tintColor: tintColor,
      backgroundColor: backgroundColor,
      brighterLevelOne: backgroundColorBrighterLevelOne,
      standardTextColor: standardTextColor,
      titleTextColor: titleTextColor,
      okColor
    }

    this.nightModeInfo = {
      isNightMode: true,
      accentColor: accentColor,
      deepColor: nightDeepColor,
      standardColor: nightStandardColor,
      tintColor: nightTintColor,
      backgroundColor: nightBackgroundColor,
      brighterLevelOne: nightBackgroundColorBrighterLevelOne,
      standardTextColor: nightStandardTextColor,
      titleTextColor: nightTitleTextColor,
      okColor
    }
    this.dayModeInfo.dayModeInfo = this.dayModeInfo
    this.dayModeInfo.nightModeInfo = this.nightModeInfo
    this.nightModeInfo.dayModeInfo = this.dayModeInfo
    this.nightModeInfo.nightModeInfo = this.nightModeInfo
  }

  switchModeOnRoot = () => {
    let targetState = !this.state.isNightMode;
    this.setState({
      isNightMode: targetState,
    });
    return targetState;
  }

  componentWillMount = () => {
    global.toast = this.toast
    const listeners = BackHandler.addEventListener('hardwareBackPress', () => {
      let timestamp = new Date();
      if (timestamp - backPressClickTimeStamp > 2000) {
        backPressClickTimeStamp = timestamp;
        global.toast && global.toast('再按一次退出程序');
        return true;
      } else {
        return false;
      }
    });
  }

  componentDidMount() {
    Linking.getInitialURL().then((url) => {
      if (url) {
        console.log('Initial url is: ' + url);
      }
    }).catch(err => console.error('An error occurred linking', err));
    Linking.addEventListener('url', this._handleOpenURL);
  }
  componentWillUnmount() {
    Linking.removeEventListener('url', this._handleOpenURL);
  }
  _handleOpenURL(event) {
    // console.log(event.url);
  }

  toast = (text) => {
    const value = this.state.tipBarMarginBottom._value
    if (value === 0) {
      this.setText(text)
    } else {
      setTimeout(() => {
        this.toast(text)
      }, 3000)
    }
  }

  setText = (text) => {
    this.setState({
      text
    })
    InteractionManager.runAfterInteractions(() => {
      Animated.timing(this.state.tipBarMarginBottom, {
        toValue: this.state.tipBarMarginBottom._value === 1 ? 0 : 1,
        duration: 200,
        easing: Easing.ease
      }).start();
    });


    setTimeout(() => {
      InteractionManager.runAfterInteractions(() => {
        Animated.timing(this.state.tipBarMarginBottom, {
          toValue: this.state.tipBarMarginBottom._value === 1 ? 0 : 1,
          duration: 200,
          easing: Easing.ease
        }).start(() => {
          this.setState({
            text: ''
          })
        });
      });
    }, 2000)
  }

  render() {
    const modeInfo = this.state.isNightMode ? this.dayModeInfo : this.nightModeInfo
    return (
      <Provider store={store}>
        <View style={{ flex: 1 }}>
          <StatusBar translucent={false} backgroundColor={this.state.isNightMode ? nightDeepColor : deepColor} barStyle="light-content" />
          <Navigator
            uriPrefix={'p9://psnine.com/'}
            onNavigationStateChange={null} screenProps={{
              modeInfo: this.state.isNightMode ? this.nightModeInfo : this.dayModeInfo,
              switchModeOnRoot: this.switchModeOnRoot,
              tipBarMarginBottom: this.state.tipBarMarginBottom,
              bottomText: this.state.text
            }} />
          <Animated.View style={{
            height: tipHeight,
            position: 'absolute',
            bottom: this.state.tipBarMarginBottom.interpolate({
              inputRange: [0, 1],
              outputRange: [-tipHeight, 0]
            }),
            elevation: 6,
            width: SCREEN_WIDTH,
            backgroundColor: modeInfo.backgroundColor
          }}>
            <View style={{
              flex: 1,
              justifyContent: 'center',
              padding: 20
            }}>
              <Text style={{
                fontSize: 15,
                color: modeInfo.titleTextColor
              }}>{this.state.text}</Text>
            </View>
          </Animated.View>
        </View>
      </Provider>
    );
  }
}

export default Root