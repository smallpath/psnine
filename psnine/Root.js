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
  NetInfo,
  DeviceEventEmitter,
  Image,
  Platform
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

const toolbarHeight = 56
const tipHeight = toolbarHeight * 0.8
let backPressClickTimeStamp = 0

const netInfoHandler = (reach) => {
  global.netInfo = reach
}

const shouldChangeBackground = Platform.OS !== 'android' || (Platform.OS === 'android' && Platform.Version <= 20)

export default class Root extends React.Component {
  constructor(props) {
    super(props);
    const { height, width } = Dimensions.get('window')
    this.store = configureStore();
    this.state = {
      text: '',
      width,
      height,
      minWidth: Math.min(height, width),
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
      loadingText: 'P9 · 酷玩趣友'
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
    // setTimeout(() => {
    Animated.timing(this.state.progress, {
      toValue: 1,
      // ease: Easing.in(Easing.ease(1, 0, 1, 1)), 
      duration: 800
    }).start()
    // }, 400)

    setTimeout(() => {
      this.setState({
        isLoadingAsyncStorage: false,
        settingInfo,
        colorTheme: settingInfo.colorTheme,
        isNightMode: settingInfo.isNightMode,
        secondaryColor: settingInfo.secondaryColor
      }, () => checkVersion().catch(err => { }))
    }, 1400)
  }

  componentDidMount() {

    this.animation && this.animation.play()
    this.loadSetting()

    Linking.getInitialURL().then((url) => {
      if (url) {
        // console.log('Initial url is: ' + url);
      }
    }).catch(err => console.error('An error occurred linking', err));
    Linking.addEventListener('url', this._handleOpenURL);

    NetInfo.fetch().then((reach) => {
      global.netInfo = reach
    })
    NetInfo.addEventListener(
      'change',
      netInfoHandler
    )
    this._orientationSubscription = DeviceEventEmitter.addListener('namedOrientationDidChange', this._handleOrientation)
  }
  componentWillUnmount() {
    Linking.removeEventListener('url', this._handleOpenURL);
    NetInfo.removeEventListener('change', netInfoHandler)
    this._orientationSubscription && this._orientationSubscription.remove()
  }
  _handleOpenURL(event) {
    // console.log(event.url);
  }

  _handleOrientation = orientation => {
    let screen = {}
    const { height, width } = Dimensions.get('window')
    const min = Math.min(height, width)
    const max = Math.max(height, width)
    const { isLandscape } = orientation
    screen = {
      height: isLandscape ? min : max,
      width: isLandscape ? max : min
    }
    // console.log(orientation, screen)
    this.setState({
      width: screen.width,
      height: screen.height,
      minWidth: min
    })
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
    const { colorTheme, secondaryColor, isNightMode, width, height, minWidth } = this.state
    const modeInfo = Object.assign({}, targetModeInfo, {
      loadSetting: this.loadSetting,
      reloadSetting: this.reloadSetting,
      settingInfo: this.state.settingInfo,
      isNightMode,
      reverseModeInfo: isNightMode ? dayModeInfo : nightModeInfo,
      dayModeInfo: dayModeInfo,
      nightModeInfo: nightModeInfo,
      switchModeOnRoot: this.switchModeOnRoot,
      themeName: isNightMode ? `${colorTheme}Night:${secondaryColor}:${width}` : `${colorTheme}:${secondaryColor}:${width}`,
      colorTheme,
      secondaryColor,
      width,
      height,
      minWidth,
      numColumns: Math.max(1, Math.floor(width / 360)),
      accentColor: getAccentColorFromName(secondaryColor, isNightMode),
      background: (shouldChangeBackground || isNightMode) ? targetModeInfo.brighterLevelOne : targetModeInfo.backgroundColor
    })

    const onNavigationStateChange = global.shouldSendGA ? (prevState, currentState) => {
      const currentScreen = getCurrentRoute(currentState);
      const prevScreen = getCurrentRoute(prevState);
      if (prevScreen && currentScreen && prevScreen.routeName !== currentScreen.routeName) {
        // if (currentScreen.routeName === 'Home') {
        //   StatusBar.setHidden(true)
        // } else if (prevScreen.routeName === 'Home') {
        //   StatusBar.setHidden(false)
        // }
        if (global.shouldSendGA) {
          const { routeName = 'Unknow' } = currentScreen
          tracker.trackScreenView(routeName)
        }
      }
    } : null

    const child = isLoadingAsyncStorage ? (
      <View style={{ flex: 1, backgroundColor: 'rgb(0,208,192)' }}>
        <StatusBar translucent={false} backgroundColor={'rgb(0,208,192)'} barStyle={"light-content"} />
        {/* <Animation
          ref={animation => { this.animation = animation; }}
          style={{
            
          }}
          source={lottie}
        /> */}
        <Image
          source={{
            uri: 'http://ww4.sinaimg.cn/large/bfae17b6gy1fhpjvt6jukg21hc0u0ds5.jpg', width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT - StatusBar.currentHeight * 4
          }}
          style={{
            width: SCREEN_WIDTH,
            height: SCREEN_HEIGHT - StatusBar.currentHeight * 4
          }}
          resizeMode='contain'
          resizeMethod={'resize'}
        />
        <Animated.View style={{
          position: 'absolute',
          left: 0,
          top: SCREEN_HEIGHT / 10 * 5,
          right: 0,
          bottom: 0,
          opacity: progress
        }}>
          <Text numberOfLines={1} style={{
            textAlign: 'center',
            textAlignVertical: 'center',
          }}>{this.state.loadingText}</Text>
        </Animated.View>
      </View>
    ) : (
        <View style={{ flex: 1 }}>
          <StatusBar translucent={false} backgroundColor={modeInfo.deepColor} barStyle={"light-content"} />
          <StackNavigator
            uriPrefix={'p9://psnine.com/'}
            onNavigationStateChange={onNavigationStateChange} screenProps={{
              modeInfo,
              switchModeOnRoot: this.switchModeOnRoot,
              bottomText: this.state.text
            }} />
          <Animated.View style={{
            height: tipHeight,
            position: 'absolute',
            bottom: 0,
            elevation: 6,
            left: 0,
            right: 0,
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
