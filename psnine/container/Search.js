import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  ToastAndroid,
  BackHandler,
  Dimensions,
  TouchableNativeFeedback,
  KeyboardAvoidingView,
  InteractionManager,
  Keyboard,
  TextInput,
  Animated,
  Easing,
  PanResponder,
  StatusBar,
  Picker
} from 'react-native';

import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { standardColor, accentColor } from '../constants/colorConfig';

import { pngPrefix, getDealURL, getHappyPlusOneURL, getStoreURL } from '../dao';

import { safeLogin, registURL } from '../dao/login';
import { postReply } from '../dao/post';

import Emotion from '../components/Emotion'

let title = '回复';

let toolbarActions = [

];

let AnimatedKeyboardAvoidingView = Animated.createAnimatedComponent(KeyboardAvoidingView);

let screen = Dimensions.get('window');

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = screen;

SCREEN_HEIGHT = SCREEN_HEIGHT - StatusBar.currentHeight + 1;

let CIRCLE_SIZE = 56;

const emotionToolbarHeight = 190

let config = { tension: 30, friction: 7, ease: Easing.in(Easing.ease(1, 0, 1, 1)), duration: 200 };

export default class Search extends Component {

  constructor(props) {
    super(props);

    this.state = {
      icon: false,
      content: '',
      openVal: new Animated.Value(0),
      marginTop: new Animated.Value(0),
      toolbarOpenVal: new Animated.Value(0)
    }
  }

  componentDidMount = () => {
    let config = { tension: 30, friction: 7 };
    Animated.spring(this.state.openVal, { toValue: 1, ...config }).start();
  }

  _pressBack = (callback) => {
    const { marginTop, openVal, content } = this.state
    if (typeof callback === 'function') {
      if (content === '') {
        ToastAndroid.show('输入为空', 1000)
        return
      }
    }
    let value = marginTop._value;
    if (Math.abs(value) >= 50) {
      Animated.spring(marginTop, { toValue: 0, ...config }).start();
      return true;
    } 
    this.content.clear();
    Keyboard.dismiss()
    Animated.spring(openVal, { toValue: 0, ...config }).start(() => {
      typeof callback === 'function' && callback(content)
      this.props.navigation.goBack()
    });
  }
  isKeyboardShowing = false

  componentWillUnmount = () => {
    this.keyboardDidHideListener.remove();
    this.keyboardDidShowListener.remove();
    this.removeListener && this.removeListener.remove()
  }

  componentWillMount = async () => {
    let config = { tension: 30, friction: 7 };
    const { openVal, marginTop } = this.state
    const { callback } = this.props.navigation.state.params
    const { params } = this.props.navigation.state
    const { modeInfo } = this.props.screenProps

    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      this.isKeyboardShowing = true
      this.state.toolbarOpenVal.setValue(0)
    })
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      this.isKeyboardShowing = false
      this.shouldShowEmotion === true && Animated.spring(this.state.toolbarOpenVal, {
        toValue: 1,
        friction: 10
      }).start(() => {
        this.shouldShowEmotion = false
      });
    })
    this.isToolbarShowing = false
    this.removeListener = BackHandler.addEventListener('hardwareBackPress', () => {
      let config = { tension: 30, friction: 7 };
      if (this.state.toolbarOpenVal._value !== 0) {
        Animated.spring(this.state.toolbarOpenVal, { toValue: 0, ...config }).start();
        return true;
      }
      let value = this.state.marginTop._value
      if (Math.abs(value) >= 50) {
        Animated.spring(marginTop, { toValue: 0, ...config }).start();
        return true;
      } else {
        Keyboard.dismiss()
        Animated.spring(openVal, { toValue: 0, ...config }).start(() => {
          this.props.navigation.goBack()
        });
        return true
      }
    })

    const icon = await Promise.all([
      Ionicons.getImageSource('md-arrow-back', 20, modeInfo.standardColor),
      Ionicons.getImageSource('md-happy', 50, '#fff'),
      Ionicons.getImageSource('md-photos', 50, '#fff'),
      Ionicons.getImageSource('md-search', 20,  modeInfo.standardColor)
    ])
    this.setState({
      icon: {
        backIcon: icon[0],
        emotionIcon: icon[1],
        photoIcon: icon[2],
        sendIcon: icon[3]
      }
    })

  }

  _onSubmitEditing = (event) => {
    const { callback } = this.props.navigation.state.params
    this._pressBack(callback)
  }

  render() {
    let { openVal, marginTop } = this.state;
    const { icon, toolbarOpenVal } = this.state
    const { modeInfo } = this.props.screenProps
    const { callback } = this.props.navigation.state.params

    const searchHeight = 40

    let animatedStyle = {
      left: openVal.interpolate({ inputRange: [0, 1], outputRange: [SCREEN_WIDTH, 0] }),
      bottom: openVal.interpolate({ inputRange: [0, 1], outputRange: [SCREEN_HEIGHT, 0] }),
      borderWidth: 0,
      borderRadius: openVal.interpolate({ inputRange: [-0.15, 0, 1], outputRange: [CIRCLE_SIZE * 1.3, CIRCLE_SIZE * 1.3,  0] }),
      backgroundColor: openVal.interpolate({
        inputRange: [0, 1],
        outputRange: [accentColor, modeInfo.backgroundColor]
      }),
      marginTop: marginTop.interpolate({
        inputRange: [0, SCREEN_HEIGHT],
        outputRange: [0, SCREEN_HEIGHT]
      })
    };

    let animatedSubmitStyle = {
      height: openVal.interpolate({ inputRange: [0, 0.9, 1], outputRange: [0, 0, searchHeight] }),
    }

    let animatedToolbarStyle = {
      height: openVal.interpolate({ inputRange: [0, 0.9, 1], outputRange: [searchHeight, searchHeight, searchHeight] }),
      borderWidth: 0,
      borderRadius: openVal.interpolate({ inputRange: [-0.15, 0, 1], outputRange: [CIRCLE_SIZE * 1.3, CIRCLE_SIZE * 1.3, 0] }),
      zIndex: openVal.interpolate({ inputRange: [0, 1], outputRange: [0, 3] }),
      backgroundColor: openVal.interpolate({
        inputRange: [0, 1],
        outputRange: [accentColor, modeInfo.backgroundColor]
      }),
    }

    return (
      <Animated.View
        ref={ref => this.ref = ref}
        style={[
          styles.circle, styles.open, animatedStyle, {
            top: 0,
            right: 0,
            backgroundColor: 'rgba(0,0,0,0.2)',
            padding: 6,
            borderBottomLeftRadius: openVal.interpolate({
              inputRange: [0, 0.66,1],
              outputRange: [SCREEN_HEIGHT,SCREEN_HEIGHT, 0]
            }),
          }
        ]}
      >

        {/*<Animated.View
          style={{
            position: 'absolute',
            right: 0,
            left: 0,
            top: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.2)',
            borderRadius: openVal.interpolate({
              inputRange: [0, 0.66,1],
              outputRange: [SCREEN_WIDTH/2,SCREEN_WIDTH/2, 0]
            }),
          }}
        />*/}

        <Animated.View style={[styles.KeyboardAvoidingView, {
          //flex: openVal.interpolate({ inputRange: [0, 1], outputRange: [0, 10] }),
          height: searchHeight,
          flexDirection: 'row',
        }]} >

          <Animated.View style={[styles.toolbar, animatedToolbarStyle, {
              alignItems: 'center',
              justifyContent: 'center'
          }]}>
            <View style={{
              height: searchHeight,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <TouchableNativeFeedback
                onPress={this._pressBack}
                delayPressIn={0}
                background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
                style={{ borderRadius: searchHeight/2 }}
              >
                <View style={{ width: searchHeight, height: searchHeight, borderRadius: 25, justifyContent: 'center', alignItems: 'center' }}>
                  {icon && <Image
                    source={icon.backIcon}
                    style={{alignSelf: 'center',alignContent: 'center'}}
                    style={{ width: 20, height: 20}}
                  />}
                </View>
              </TouchableNativeFeedback>
            </View>
          </Animated.View >
          <AnimatedKeyboardAvoidingView behavior={'padding'} style={[styles.contentView, {
            //flex: openVal.interpolate({ inputRange: [0, 1], outputRange: [0, 12] }),
            height: searchHeight,
            justifyContent: 'center',
            alignContent: 'center'
          }]}>
            <TextInput placeholder="输入回复"
              autoCorrect={false}
              multiline={false}
              keyboardType="default"
              returnKeyType='go'
              returnKeyLabel='go'
              blurOnSubmit={true}
              onSubmitEditing={this._onSubmitEditing}
              ref={ref => this.content = ref}
              onChange={({ nativeEvent }) => { this.setState({ content: nativeEvent.text }) }}
              value={this.state.content}
              style={[styles.textInput, {
                color: modeInfo.titleTextColor,
                textAlign: 'left',
                textAlignVertical: 'top',
                flex: 1,
                backgroundColor: modeInfo.backgroundColor
              }]}
              placeholderTextColor={modeInfo.standardTextColor}
              // underlineColorAndroid={accentColor}
              underlineColorAndroid='rgba(0,0,0,0)'
            />

          </AnimatedKeyboardAvoidingView>

          <Animated.View style={[styles.toolbar, animatedToolbarStyle, {
              alignItems: 'center',
              justifyContent: 'center',
              height: searchHeight
          }]}>
            <View style={{
              height: searchHeight,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <TouchableNativeFeedback
                onPress={() => this._pressBack(callback)}
                delayPressIn={0}
                background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
                style={{ borderRadius: searchHeight/2 }}
              >
                <View style={{ width: searchHeight, height: searchHeight, borderRadius: 25, justifyContent: 'center', alignItems: 'center' }}>
                  {icon && <Image
                    source={icon.sendIcon}
                    style={{alignSelf: 'center',alignContent: 'center'}}
                    style={{ width: 20, height: 20}}
                  />}
                </View>
              </TouchableNativeFeedback>
            </View>
          </Animated.View >
        </Animated.View>

      </Animated.View>
    );
  }

}


const width = Dimensions.get('window').width;

const styles = StyleSheet.create({
  circle: {
    flex: 1,
    position: 'absolute',
    backgroundColor: 'white',
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    borderWidth: 2,
    borderColor: accentColor,
    // elevation: 12,
  },
  open: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    width: undefined, // unset value from styles.circle
    height: undefined, // unset value from styles.circle
    borderRadius: CIRCLE_SIZE / 2, // unset value from styles.circle
  },
  toolbar: {
    backgroundColor: standardColor,
    height: 56,
    // elevation: 4,
    flex: -1,
  },
  mainFont: {
    fontSize: 15,
    color: accentColor
  },
  textInput: {
    fontSize: 15,
  },
  KeyboardAvoidingView: {
    flex: 10,
    // width: width,
    //alignSelf:'center',
    //justifyContent: 'space-between',
    flexDirection: 'column'
  },
  titleView: {
    flex: 1,
    //marginTop: -10,
    justifyContent: 'center',
    // flexDirection: 'column',
    // justifyContent: 'space-between',
  },
  isPublicView: {
    flex: 1,
    flexDirection: 'row',
    // flexDirection: 'column',
    alignItems: 'center',
  },
  contentView: {
    flex: 12,
    // flexDirection: 'column', 
  },
  submit: {
    // flex: -1, 
    // height: 20,
    // //margin: 10,
    // marginTop: 30,
    // marginBottom: 20,
  },
  submitButton: {
    // backgroundColor: accentColor,
    // height: 40,
    // alignItems: 'center',
    // justifyContent: 'center',
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
})
