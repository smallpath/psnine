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
import ColorConfig, {
  accentColor,
  okColor,
  deepColor
} from './constants/colorConfig';

import configureStore from './store/store.js'
import Animation from 'lottie-react-native';
import checkVersion from './bootstrap/checkVersion'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

let toolbarHeight = 56
const tipHeight = toolbarHeight * 0.8
let backPressClickTimeStamp = 0

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
        loadImageWithoutWifi: true,
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
      loadingText: 'PSNINE\nP9 · 酷玩趣友'
    };
  }

  switchModeOnRoot = (themeName) => {
    if (!themeName) {
      let targetState = !this.state.isNightMode;
      this.setState({
        isNightMode: targetState,
      });
      return AsyncStorage.setItem('@Theme:isNightMode', targetState.toString())
    } else {
      this.setState({
        colorTheme: themeName.toString(),
      });
      return AsyncStorage.setItem('@Theme:colorTheme', themeName.toString())
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
        loadImageWithoutWifi: result[4] || true,
        colorTheme: result[5] || 'lightBlue'
      })
      this.setState({
        settingInfo,
        colorTheme: settingInfo.colorTheme,
        isNightMode: settingInfo.isNightMode
      })
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
    ]).then(result => {
      Object.assign(settingInfo, {
        tabMode: result[0] || this.state.settingInfo.tabMode,
        psnid: result[1] || this.state.settingInfo.psnid,
        userInfo: JSON.parse(result[2]) || this.state.settingInfo.userInfo,
        isNightMode: JSON.parse(result[3]) || this.state.settingInfo.isNightMode,
        loadImageWithoutWifi: result[4] || true,
        colorTheme: result[5] || 'lightBlue'
      })
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
        isNightMode: settingInfo.isNightMode
      }, () => checkVersion().catch(err => {}))
    }, 1300)
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
    const dayModeInfo = ColorConfig[this.state.colorTheme]
    const nightModeInfo = ColorConfig[this.state.colorTheme + 'Night']
    const targetModeInfo = this.state.isNightMode ? nightModeInfo : dayModeInfo
    const { isLoadingAsyncStorage, progress } = this.state
    const modeInfo = Object.assign({}, targetModeInfo, {
      loadSetting: this.loadSetting,
      reloadSetting: this.reloadSetting,
      settingInfo: this.state.settingInfo,
      isNightMode: this.state.isNightMode,
      reverseModeInfo: this.state.isNightMode ? dayModeInfo : nightModeInfo,
      dayModeInfo: dayModeInfo,
      nightModeInfo: nightModeInfo,
      switchModeOnRoot: this.switchModeOnRoot,
      themeName: this.state.isNightMode ? this.state.colorTheme + 'Night' : this.state.colorTheme,
      colorTheme: this.state.colorTheme
    })

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
      <Provider store={this.store}>
        {child}
      </Provider>
    );
  }
}
