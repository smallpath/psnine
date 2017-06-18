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
  AsyncStorage,
  NetInfo
} from 'react-native';
import { Provider } from 'react-redux'
import StackNavigator, { getCurrentRoute, tracker, format } from './Navigator'
import ColorConfig, {
  accentColor,
  okColor,
  deepColor,
  getAccentColorFromName
} from './constants/colorConfig';

import configureStore from './store/store.js'
import Animation from 'lottie-react-native';
import checkVersion from './bootstrap/checkVersion'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

let toolbarHeight = 56
const tipHeight = toolbarHeight * 0.8
let backPressClickTimeStamp = 0

const netInfoHandler = (reach) =>  {
  // console.log('Change: ' + reach)
  global.netInfo = reach
}

export default class Root extends React.Component {
  constructor(props) {
    super(props);
    this.store = configureStore();
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
          exp: ''
        },
        isNightMode: false,
        colorTheme: 'lightBlue',
      },
      colorTheme: 'lightBlue',
      secondaryColor: 'pink',
      loadingText: 'PSNINE\nP9 · 酷玩趣友'
    };
  }

  switchModeOnRoot = (theme) => {
    if (!theme) {
      let targetState = !this.state.isNightMode;
      this.setState({
        isNightMode: targetState,
      });
      return AsyncStorage.setItem('@Theme:isNightMode', targetState.toString())
    } else {
      const { colorTheme, secondaryColor } = theme
      if (colorTheme) {
        this.setState({
          colorTheme: colorTheme.toString(),
        });
        return AsyncStorage.setItem('@Theme:colorTheme', colorTheme.toString())
      } else if (secondaryColor) {
        this.setState({
          secondaryColor: secondaryColor.toString(),
        });
        return AsyncStorage.setItem('@Theme:secondaryColor', secondaryColor.toString())
      }
    }
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

  reloadSetting = () => {
    const settingInfo = {}
    return Promise.all([
      AsyncStorage.getItem('@Theme:tabMode'),
      AsyncStorage.getItem('@psnid'),
      AsyncStorage.getItem('@userInfo'),
      AsyncStorage.getItem('@Theme:isNightMode'),
      AsyncStorage.getItem('@Theme:loadImageWithoutWifi'),
      AsyncStorage.getItem('@Theme:colorTheme'),
      AsyncStorage.getItem('@Theme:shouldSendGA'),
      AsyncStorage.getItem('@Theme:secondaryColor'),
    ]).then(result => {
      // console.log('getting psnid: ' + result[1])
      Object.assign(settingInfo, {
        tabMode: result[0] || 'tab',
        psnid: result[1] || '',
        userInfo: JSON.parse(result[2]) || {
          avatar: require('./img/comment_avatar.png'),
          platinum: '白',
          gold: '金',
          silver: '银',
          bronze: '铜',
          isSigned: true,
          exp: '' 
        },
        isNightMode: JSON.parse(result[3]) || false,
        colorTheme: result[5] || 'lightBlue',
        secondaryColor: result[7] || 'pink'
      })
      this.setState({
        settingInfo,
        colorTheme: settingInfo.colorTheme,
        isNightMode: settingInfo.isNightMode,
        secondaryColor: settingInfo.secondaryColor
      })
      global.shouldSendGA = JSON.parse(result[6] || 'true')
      global.loadImageWithoutWifi = JSON.parse(result[4]) || false
    }).catch(err => {
      // console.log(err)
      toast && toast(err.toString())
    })
  }

  loadSetting = () => {
    this.state.progress.setValue(0)
    this.setState({
      isLoadingAsyncStorage: true
    })
    const settingInfo = {}
    Promise.all([
      AsyncStorage.getItem('@Theme:tabMode'),
      AsyncStorage.getItem('@psnid'),
      AsyncStorage.getItem('@userInfo'),
      AsyncStorage.getItem('@Theme:isNightMode'),
      AsyncStorage.getItem('@Theme:loadImageWithoutWifi'),
      AsyncStorage.getItem('@Theme:colorTheme'),
      AsyncStorage.getItem('@Theme:shouldSendGA'),
      AsyncStorage.getItem('@Theme:secondaryColor'),
    ]).then(result => {
      Object.assign(settingInfo, {
        tabMode: result[0] || this.state.settingInfo.tabMode,
        psnid: result[1] || this.state.settingInfo.psnid,
        userInfo: JSON.parse(result[2]) || this.state.settingInfo.userInfo,
        isNightMode: JSON.parse(result[3]) || this.state.settingInfo.isNightMode,
        colorTheme: result[5] || 'lightBlue',
        secondaryColor: result[7] || 'pink'
      })
      // alert(result[7])
      global.loadImageWithoutWifi = JSON.parse(result[4]) || false
      // console.log('==> GA', JSON.parse(result[6]), JSON.parse(result[6] || 'true'), result[6], typeof result[6])
      global.shouldSendGA = JSON.parse(result[6] || 'true')
    })
    Animated.timing(this.state.progress, {
      toValue: 0.65,
      // ease: Easing.in(Easing.ease(1, 0, 1, 1)), 
      duration: 1500
    }).start()
    setTimeout(() => {
      this.setState({
        isLoadingAsyncStorage: false,
        settingInfo,
        colorTheme: settingInfo.colorTheme,
        isNightMode: settingInfo.isNightMode,
        secondaryColor: settingInfo.secondaryColor
      }, () => checkVersion().catch(err => {}))
    }, 1300)
  }

  componentDidMount() {
    
    this.loadSetting()

    Linking.getInitialURL().then((url) => {
      if (url) {
        // console.log('Initial url is: ' + url);
      }
    }).catch(err => console.error('An error occurred linking', err));
    Linking.addEventListener('url', this._handleOpenURL);

    NetInfo.fetch().then((reach) => {
      // console.log('Initial: ' + reach);
      global.netInfo = reach
    });
    NetInfo.addEventListener(
      'change',
      netInfoHandler
    );
  }
  componentWillUnmount() {
    Linking.removeEventListener('url', this._handleOpenURL);
    NetInfo.removeEventListener('change', netInfoHandler)
  }
  _handleOpenURL(event) {
    // console.log(event.url);
  }

  toast = (text) => {
    const value = this.state.tipBarMarginBottom._value
    if (this.state.text === '') {
      this.setText(text)
    } else {
      setTimeout(() => {
        this.toast(text)
      }, 1000)
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
        }).start(({ finished }) => {
          // console.log(this.state.tipBarMarginBottom._value,
          //   this.state.tipBarMarginBottom._offset,
          //   finished)
          this.state.tipBarMarginBottom.setValue(0)
          this.setState({
            text: ''
          })
        });
      });
    }, 2000)
  }

  render() {
    const dayModeInfo = ColorConfig[this.state.colorTheme]
    const nightModeInfo = ColorConfig[this.state.colorTheme + 'Night']
    const targetModeInfo = this.state.isNightMode ? nightModeInfo : dayModeInfo
    const { isLoadingAsyncStorage, progress } = this.state
    const { colorTheme, secondaryColor, isNightMode } = this.state
    const modeInfo = Object.assign({}, targetModeInfo, {
      loadSetting: this.loadSetting,
      reloadSetting: this.reloadSetting,
      settingInfo: this.state.settingInfo,
      isNightMode,
      reverseModeInfo: isNightMode ? dayModeInfo : nightModeInfo,
      dayModeInfo: dayModeInfo,
      nightModeInfo: nightModeInfo,
      switchModeOnRoot: this.switchModeOnRoot,
      themeName: isNightMode ? colorTheme + 'Night:' + secondaryColor  : colorTheme + ':' + secondaryColor,
      colorTheme,
      secondaryColor,
      accentColor: getAccentColorFromName(secondaryColor, isNightMode)
    })

    // console.log(modeInfo.accentColor)

    const onNavigationStateChange = global.shouldSendGA ? (prevState, currentState) => {
      const currentScreen = getCurrentRoute(currentState);
      const prevScreen = getCurrentRoute(prevState);

      if (global.shouldSendGA && prevScreen && currentScreen && prevScreen.routeName !== currentScreen.routeName) {
        const { routeName = 'Unknow'} = currentScreen
        // console.log(routeName)
        tracker.trackScreenView(routeName)
      }
    } : null

    const child = isLoadingAsyncStorage ? (
      <View style={{ flex: 1, backgroundColor: 'rgb(0,208,192)'}}>
        <StatusBar translucent={false} backgroundColor={'rgb(0,208,192)'} barStyle={"light-content"} />
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
        <StatusBar translucent={false} backgroundColor={modeInfo.deepColor} barStyle={"light-content"} />
        <StackNavigator
          uriPrefix={'p9://psnine.com/'}
          onNavigationStateChange={onNavigationStateChange} screenProps={{
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
                inputRange: [-1, 0, 1, 2],
                outputRange: [tipHeight * 2, tipHeight, 0, -tipHeight]
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
      <Provider store={this.store}>
        {child}
      </Provider>
    );
  }
}
