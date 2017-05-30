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
  InteractionManager,
  AsyncStorage
} from 'react-native';
import { Provider } from 'react-redux'
import StackNavigator from './Navigator'
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
import Animation from 'lottie-react-native';

const store = configureStore();

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

let toolbarHeight = 56
const tipHeight = toolbarHeight * 0.8
let backPressClickTimeStamp = 0

class Root extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
      isNightMode: false,
      tipBarMarginBottom: new Animated.Value(0),
      progress: new Animated.Value(0),
      isLoadingAsyncStorage: true,
      settingInfo: {
        tabMode: 'tab',
        psnid: '',
        userInfo: {
          avatar: require('./img/comment_avatar.png'),
          platinum: '白',
          gold: '金',
          silver: '银',
          bronze: '铜',
          isSigned: true,
        },
        isNightMode: false
      },
      loadingText: 'PSNINE\nP9 · 酷玩趣友'
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
      okColor,
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
    AsyncStorage.setItem('@Theme:isNightMode', targetState.toString())
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

  loadSetting = () => {
    this.state.progress.setValue(0)
    this.setState({
      isLoadingAsyncStorage: false
    })
    const settingInfo = {}
    Promise.all([
      AsyncStorage.getItem('@Theme:tabMode'),
      AsyncStorage.getItem('@psnid'),
      AsyncStorage.getItem('@userInfo'),
      AsyncStorage.getItem('@Theme:isNightMode')
    ]).then(result => {
      Object.assign(settingInfo, {
        tabMode: result[0] || this.state.settingInfo.tabMode,
        psnid: result[1] || this.state.settingInfo.psnid,
        userInfo: JSON.parse(result[2]) || this.state.settingInfo.userInfo,
        isNightMode: JSON.parse(result[3]) || this.state.settingInfo.isNightMode
      })
      this.setState({
        isLoadingAsyncStorage: false,
        settingInfo,
        isNightMode: settingInfo.isNightMode
      })
    })
    // Animated.timing(this.state.progress, {
    //   toValue: 0.65,
    //   // ease: Easing.in(Easing.ease(1, 0, 1, 1)), 
    //   duration: 1500
    // }).start()
    // setTimeout(() => {
      // this.setState({
      //   isLoadingAsyncStorage: false,
      //   settingInfo,
      //   isNightMode: settingInfo.isNightMode
      // })
    // }, 1300)
  }

  componentDidMount() {
    
    this.loadSetting()
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
        toValue: 1,
        duration: 200,
        easing: Easing.ease,
        useNativeDriver: true
      }).start();
    });


    setTimeout(() => {
      InteractionManager.runAfterInteractions(() => {
        Animated.timing(this.state.tipBarMarginBottom, {
          toValue: 0,
          duration: 200,
          easing: Easing.ease,
          useNativeDriver: true
        }).start(() => {
          this.setState({
            text: ''
          })
        });
      });
    }, 2000)
  }

  render() {
    const targetModeInfo = this.state.isNightMode ? this.nightModeInfo : this.dayModeInfo
    const { isLoadingAsyncStorage, progress } = this.state
    const modeInfo = Object.assign({}, targetModeInfo, {
      loadSetting: this.loadSetting,
      settingInfo: this.state.settingInfo,
      reverseModeInfo: this.state.isNightMode ? this.dayModeInfo : this.nightModeInfo
    })

    const child = isLoadingAsyncStorage ? (
      <View style={{ flex: 1, backgroundColor: 'rgb(0,208,192)'}}>
        <Animation
          ref={animation => { this.animation = animation; }}
          style={{
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT - StatusBar.currentHeight * 6,
          }}
          progress={progress}
          source={require('./animations/LottieLogo1.json')}
        />
        <Text numberOfLines={2} style={{
          position: 'absolute',
          left: 0,
          top: SCREEN_HEIGHT / 10 * 1,
          textAlign: 'center',
          textAlignVertical: 'center',
          right: 0,
          bottom: 0
        }}>{this.state.loadingText}</Text>
      </View>
    ) : (
      <View style={{ flex: 1 }}>
        <StatusBar translucent={false} backgroundColor={this.state.isNightMode ? nightDeepColor : deepColor} barStyle="light-content" />
        <StackNavigator
          uriPrefix={'p9://psnine.com/'}
          onNavigationStateChange={null} screenProps={{
            modeInfo,
            switchModeOnRoot: this.switchModeOnRoot,
            tipBarMarginBottom: this.state.tipBarMarginBottom,
            bottomText: this.state.text
          }} />
        <Animated.View style={{
          height: tipHeight,
          position: 'absolute',
          bottom: 0,
          elevation: 6,
          width: SCREEN_WIDTH,
          backgroundColor: modeInfo.reverseModeInfo.backgroundColor,
          transform: [
            {
              translateY: this.state.tipBarMarginBottom.interpolate({
                inputRange: [0, 1],
                outputRange: [tipHeight, 0]
              })
            }
          ]
        }}>
          <View style={{
            flex: 1,
            justifyContent: 'center',
            padding: 20
          }}>
            <Text style={{
              fontSize: 15,
              color: modeInfo.reverseModeInfo.titleTextColor
            }}>{this.state.text}</Text>
          </View>
        </Animated.View>
      </View>
    )
    return (
      <Provider store={store}>
        {child}
      </Provider>
    );
  }
}

export default Root