import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ToastAndroid,
  Dimensions,
  TouchableNativeFeedback,
  KeyboardAvoidingView,
  TextInput,
  AsyncStorage,
  Linking,
  Animated,
  Keyboard
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

import { connect } from 'react-redux';

import { standardColor, accentColor } from '../../constants/colorConfig';

import { pngPrefix, getDealURL, getHappyPlusOneURL, getStoreURL } from '../../dao';

import { safeLogin, registURL } from '../../dao/login';
import { postPass } from '../../dao/post';

import { fetchUser } from '../../dao';


let screen = Dimensions.get('window');

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = screen;

let toolbarActions = [

];
let title = "登录";

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      oldpass: '',
      newpass: '',
      newpass2: '',
      oldpassMarginTop: new Animated.Value(0),
      passwordMarginTop: new Animated.Value(0),
      password2MarginTop: new Animated.Value(0),
      avoidKeyboardMarginTop: new Animated.Value(0),
      addIcon: false
    }
  }

  _pressButton = () => {
    this.props.navigation.goBack();
  }

  login = async () => {
    // const { psnid, password } = this.state;

    // if (psnid == '' || password == '') {
    //   global.toast && global.toast('账号或密码未输入', 2000);
    //   return;
    // }

    // let data = await safeLogin(psnid, password);
    // let length = data.length;

    // if (length > 10000) {
    //   await AsyncStorage.setItem('@psnid', psnid);
    //   const user = await fetchUser(psnid);
    //   await AsyncStorage.setItem('@userInfo', JSON.stringify(user));

    //   global.toast && global.toast(`登录成功`, 2000);
    //   this.props.navigation.state.params.setLogin(psnid, user);
    //   this.props.navigation.goBack();
    // } else {

    //   await AsyncStorage.removeItem('@psnid');
    //   const value = await AsyncStorage.getItem('@psnid');
    //   global.toast && global.toast(`登录失败,请检查账号与密码是否输入正确`, 2000);
    // }

  }

  regist = () => {
    Linking.canOpenURL(registURL).then(supported => {
      if (supported)
        Linking.openURL(registURL);
      else
        global.toast && global.toast(`未找到浏览器, 如果您使用了冰箱, 请先解冻浏览器`, 2000);
    }).catch(err => { });
  }

  async componentWillMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      Animated.spring(this.state.avoidKeyboardMarginTop, {
        toValue: 1,
        friction: 10,
        useNativeDriver: true
      }).start();
    })
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      Animated.spring(this.state.avoidKeyboardMarginTop, {
        toValue: 0,
        friction: 10,
        useNativeDriver: true
      }).start();
    })
    const source = await Ionicons.getImageSource('ios-add', 24, '#fff')
    this.setState({
      addIcon: source
    })
  }

  componentWillUnmount = () => {
    this.keyboardDidHideListener.remove();
    this.keyboardDidShowListener.remove();
  }

  onAccountTextFocus = () => {

    let text = this.accountTextInput._lastNativeText;
    if (typeof text != 'undefined' && text !== '')
      return;

    Animated.spring(this.state.oldpassMarginTop, {
      toValue: 1,
      friction: 10,
      // useNativeDriver: true
    }).start();
  }

  onAccountTextBlur = () => {
    let text = this.accountTextInput._lastNativeText;
    if (typeof text != 'undefined' && text !== '')
      return;
    Animated.spring(this.state.oldpassMarginTop, {
      toValue: 0,
      friction: 10,
      // useNativeDriver: true
    }).start();
  }

  onPasswordTextFocus = () => {

    let text = this.passwordTextInput._lastNativeText;
    if (typeof text != 'undefined' && text !== '')
      return;

    Animated.spring(this.state.passwordMarginTop, {
      toValue: 1,
      friction: 10,
      // useNativeDriver: true
    }).start();
  }

  onPasswordTextBlur = () => {
    let text = this.passwordTextInput._lastNativeText;
    if (typeof text != 'undefined' && text !== '')
      return;
    Animated.spring(this.state.passwordMarginTop, {
      toValue: 0,
      friction: 10,
      // useNativeDriver: true
    }).start();
  }

  onPassword2TextFocus = () => {

    let text = this.password2TextInput._lastNativeText;
    if (typeof text != 'undefined' && text !== '')
      return;

    Animated.spring(this.state.password2MarginTop, {
      toValue: 1,
      friction: 10,
      // useNativeDriver: true
    }).start();
  }

  onPassword2TextBlur = () => {
    let text = this.password2TextInput._lastNativeText;
    if (typeof text != 'undefined' && text !== '')
      return;
    Animated.spring(this.state.password2MarginTop, {
      toValue: 0,
      friction: 10,
      // useNativeDriver: true
    }).start();
  }

  onSubmit = () => {
    postPass({
      oldpass: this.state.oldpass,
      newpass: this.state.newpass,
      newpass2: this.state.newpass2,
      changepass: ''
    }).then(res => res.text()).then((html) => {
      // console.log(res.clone().text())
      const matched = html.match(/<div class=\"alert-error pd10\"\>(.*?)<\/div>/)
      if (matched && matched[1]) {
        toast(matched[1])
        return
      }
      toast('修改密码成功，请重新登录')
    }).catch((err) => {
      toast(err.toString())
    })
  }

  focusNextField = (nextField) => {
    this[nextField].focus();
  };

  render() {
    // console.log('Loggin.js rendered');
    let marginLeft = 40;

    const { modeInfo } = this.props.screenProps
    const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
    let avoidKeyboardStyle = {
      bottom: marginLeft * 1.5,
      top: SCREEN_HEIGHT / 10 * 4 - marginLeft * 1.5,
      transform: [{
        translateY: this.state.avoidKeyboardMarginTop.interpolate({
          inputRange: [0, 1],
          outputRange: [0, marginLeft - (SCREEN_HEIGHT / 10 * 4 - marginLeft * 1.5)]
        })
      }]
    }

    let accountTextStyle = {
      transform: [{
        translateY: this.state.oldpassMarginTop.interpolate({
          inputRange: [0, 1],
          outputRange: [40, 10]
        })
      }],
      // top: this.state.accountMarginTop.interpolate({
      //   inputRange: [0, 1],
      //   outputRange: [40, 15]
      // }),
      color: this.state.oldpassMarginTop.interpolate({
        inputRange: [0, 1],
        outputRange: [modeInfo.standardTextColor, modeInfo.standardColor]
      }),
      fontSize: this.state.oldpassMarginTop.interpolate({
        inputRange: [0, 1],
        outputRange: [15, 12]
      }),
    }

    let passwordTextStyle = {
      transform: [{
        translateY: this.state.passwordMarginTop.interpolate({
          inputRange: [0, 1],
          outputRange: [40, 10]
        })
      }],
      // top: this.state.passwordMarginTop.interpolate({
      //   inputRange: [0, 1],
      //   outputRange: [40, 15]
      // }),
      color: this.state.passwordMarginTop.interpolate({
        inputRange: [0, 1],
        outputRange: [modeInfo.standardTextColor, modeInfo.standardColor]
      }),
      fontSize: this.state.passwordMarginTop.interpolate({
        inputRange: [0, 1],
        outputRange: [15, 12]
      }),
    }
    let password2TextStyle = {
      transform: [{
        translateY: this.state.password2MarginTop.interpolate({
          inputRange: [0, 1],
          outputRange: [40, 10]
        })
      }],
      // top: this.state.passwordMarginTop.interpolate({
      //   inputRange: [0, 1],
      //   outputRange: [40, 15]
      // }),
      color: this.state.password2MarginTop.interpolate({
        inputRange: [0, 1],
        outputRange: [modeInfo.standardTextColor, modeInfo.standardColor]
      }),
      fontSize: this.state.password2MarginTop.interpolate({
        inputRange: [0, 1],
        outputRange: [15, 12]
      }),
    }
    return (
      <View style={{ flex: 1, backgroundColor: modeInfo.standardColor }}>

        <Animated.View
          ref={float => this.float = float}
          collapsable={true}
          style={{
            width: 56,
            height: 56,
            borderRadius: 30,
            backgroundColor: modeInfo.accentColor,
            position: 'absolute',
            /*top: this.state.avoidKeyboardMarginTop.interpolate({
              inputRange: [0, 1],
              outputRange: [SCREEN_HEIGHT / 10 * 4 - marginLeft + 28, marginLeft + 28]
            }),*/
            transform: [{
              translateY: this.state.avoidKeyboardMarginTop.interpolate({
                inputRange: [0, 1],
                outputRange: [(SCREEN_HEIGHT / 10 * 4 - marginLeft + 28), 28 + marginLeft * 1.5]
              })
            }],
            right: 12,
            elevation: 6,
            zIndex: 1,
          }}>

          <TouchableNativeFeedback
            onPress={this.regist}
            delayPressIn={0}
            background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
            style={{
              width: 56,
              height: 56,
              borderRadius: 30,
              flex: 1,
              zIndex: 1,
              backgroundColor: modeInfo.accentColor,
            }}>
            <View style={{ borderRadius: 30 }}>
              {this.state.addIcon && (<Image source={this.state.addIcon}
                style={{
                  marginLeft: 16,
                  marginTop: 16,
                  width: 24,
                  height: 24
                }}
              />)}
            </View>
          </TouchableNativeFeedback>
        </Animated.View>

        <Animated.View style={[{
          backgroundColor: modeInfo.backgroundColor,
          position: 'absolute',
          width: SCREEN_WIDTH - marginLeft * 2,
          height: 384,
          marginLeft: marginLeft,
          bottom: marginLeft,
          borderRadius: 5,
          elevation: 6,
        }, avoidKeyboardStyle]}>

          <View style={[styles.loginTextView, { marginLeft: marginLeft / 2 * 1.5, marginTop: 27 }]}>
            <Text style={[styles.mainFont, { fontSize: 30, marginLeft: 0, marginBottom: 0, color: modeInfo.accentColor }]}>修改密码</Text>
          </View>

          <View style={[styles.KeyboardAvoidingView, {
            width: SCREEN_WIDTH - marginLeft * 3,
          }]} >
            <View style={[styles.accountView, { marginTop: 0, }]}>
              <Animated.Text
                style={[{ color: modeInfo.standardTextColor, marginLeft: 5 },
                  accountTextStyle
                ]}>
                {'旧密码'}
              </Animated.Text>
              <TextInput underlineColorAndroid={modeInfo.accentColor}
                onChange={({ nativeEvent }) => { this.setState({ oldpass: nativeEvent.text }) }}
                ref={ref => this.accountTextInput = ref}
                onFocus={this.onAccountTextFocus}
                onBlur={this.onAccountTextBlur}
                blurOnSubmit={false}
                returnKeyType="next"
                onSubmitEditing={() => this.focusNextField('passwordTextInput')}
                style={[styles.textInput, { color: modeInfo.standardTextColor }]}
                placeholderTextColor={modeInfo.standardTextColor}
              />
            </View>

            <View style={[styles.passwordView, { marginTop: 0, marginBottom: 0 }]}>
              <Animated.Text
                style={[{ color: modeInfo.standardTextColor, marginLeft: 5 },
                  passwordTextStyle
                ]}>
                {'新密码'}
              </Animated.Text>
              <TextInput underlineColorAndroid={modeInfo.accentColor} secureTextEntry={true}
                onChange={({ nativeEvent }) => { this.setState({ newpass: nativeEvent.text }) }}
                ref={ref => this.passwordTextInput = ref}
                onFocus={this.onPasswordTextFocus}
                onBlur={this.onPasswordTextBlur}
                blurOnSubmit={false}
                returnKeyType="next"
                onSubmitEditing={() => this.focusNextField('password2TextInput')}
                style={[styles.textInput, { color: modeInfo.standardTextColor }]}
                placeholderTextColor={modeInfo.standardTextColor}
              />
            </View>

            <View style={[styles.passwordView, { marginTop: 0 }]}>
              <Animated.Text
                style={[{ color: modeInfo.standardTextColor, marginLeft: 5 },
                  password2TextStyle
                ]}>
                {'新密码第二次'}
              </Animated.Text>
              <TextInput underlineColorAndroid={modeInfo.accentColor} secureTextEntry={true}
                onChange={({ nativeEvent }) => { this.setState({ newpass2: nativeEvent.text }) }}
                ref={ref => this.password2TextInput = ref}
                onFocus={this.onPassword2TextFocus}
                onBlur={this.onPassword2TextBlur}
                onSubmitEditing={this.onSubmit}
                style={[styles.textInput, { color: modeInfo.standardTextColor }]}
                placeholderTextColor={modeInfo.standardTextColor}
              />
            </View>


          </View>

          <View style={[styles.customView, {
            width: SCREEN_WIDTH - marginLeft * 3
          }]}>
            <View style={styles.submit}>
              <TouchableNativeFeedback
                onPress={this.onSubmit}
              >
                <View style={[styles.submitButton, {backgroundColor: modeInfo.accentColor}]}>
                  <Text style={[styles.textInput, { color: modeInfo.backgroundColor }]}>提交</Text>
                </View>
              </TouchableNativeFeedback>
            </View>
          </View>

        </Animated.View>

      </View>
    );
  }
}


const width = Dimensions.get('window').width;

const styles = StyleSheet.create({
  toolbar: {
    backgroundColor: standardColor,
    height: 56,
    elevation: 4,
  },
  mainFont: {
    fontSize: 15,
    color: accentColor
  },
  textInput: {
    fontSize: 15,
  },
  customView: {
    flex: -1,
    marginTop: -20,
    width: width - 40,
    alignSelf: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  },
  KeyboardAvoidingView: {
    flex: -1,
    marginTop: 0,
    width: width - 40,
    alignSelf: 'center',
    justifyContent: 'space-between',
    flexDirection: 'column'
  },
  loginTextView: {

    flexDirection: 'column',
    justifyContent: 'space-between',

    margin: 10,
    marginTop: 20,
    marginBottom: 0,
  },
  accountView: {

    flexDirection: 'column',
    justifyContent: 'space-between',

    marginLeft: 10,
    marginRight: 10,
    marginTop: 20,
  },
  passwordView: {

    flexDirection: 'column',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 20,
    marginBottom: 20,
  },
  submit: {
    flex: -1,
    height: 30,
    margin: 10,
    marginTop: 40,
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: accentColor,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  regist: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 20,
    margin: 10,
  },
  openURL: {
    color: accentColor,
    textDecorationLine: 'underline',
  },
});


export default Login