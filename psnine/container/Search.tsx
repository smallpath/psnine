import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Image,
  BackHandler,
  Dimensions,
  TouchableNativeFeedback,
  KeyboardAvoidingView,
  InteractionManager,
  Keyboard,
  TextInput,
  Animated,
  StatusBar,
  Platform
} from 'react-native'

import Ionicons from 'react-native-vector-icons/Ionicons'
import { standardColor, accentColor } from '../constant/colorConfig'

let AnimatedKeyboardAvoidingView = Animated.createAnimatedComponent(KeyboardAvoidingView)

let screen = Dimensions.get('window')

let { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = screen

SCREEN_HEIGHT = SCREEN_HEIGHT - (StatusBar.currentHeight || 0) + 1

let CIRCLE_SIZE = 56

let backConfig = { tension: 30, friction: 7 }

const isIOS = Platform.OS === 'ios'
const method = isIOS ? 'timing' : 'spring'
const duration = isIOS ? { duration: 200 } : {}

export default class Search extends Component<any, any> {

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state

    this.state = {
      icon: false,
      content: params.content || '',
      openVal: new Animated.Value(0),
      marginTop: new Animated.Value(0),
      toolbarOpenVal: new Animated.Value(0),
      placeholder: params.placeholder || '搜索标题'
    }
  }

  componentDidMount() {
    Animated[method](this.state.openVal, { toValue: 1, ...duration }).start()
  }

  _pressBack = (callback) => {
    const { openVal } = this.state
    // Keyboard.dismiss()
    Animated[method](openVal, { toValue: 0, ...backConfig, ...duration }).start(() => {
      const _lastNativeText = this.content._lastNativeText
      this.props.navigation.goBack()
      InteractionManager.runAfterInteractions(() => {
        typeof callback === 'function' && callback(_lastNativeText)
        Keyboard.dismiss()
      })
    })
  }
  isKeyboardShowing = false
  keyboardDidHideListener: any = false
  keyboardDidShowListener: any = false
  removeListener: any = false
  isToolbarShowing: any = false
  componentWillUnmount() {
    this.keyboardDidHideListener.remove()
    this.keyboardDidShowListener.remove()
    this.removeListener && this.removeListener.remove()
  }

  async componentWillMount() {
    const { openVal } = this.state
    const { modeInfo } = this.props.screenProps

    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
      this.isKeyboardShowing = true
    })
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
      this.isKeyboardShowing = false
    })
    this.isToolbarShowing = false
    this.removeListener = BackHandler.addEventListener('hardwareBackPress', () => {
      Animated[method](openVal, { toValue: 0, ...backConfig, ...duration }).start(() => {
        this.props.navigation.goBack()
        Keyboard.dismiss()
      })
      return true
    })

    const icon = await Promise.all([
      Ionicons.getImageSource('md-arrow-back', 20, modeInfo.standardColor),
      Ionicons.getImageSource('md-search', 20,  modeInfo.standardColor)
    ])
    this.setState({
      icon: {
        backIcon: icon[0],
        sendIcon: icon[1]
      }
    })

  }

  _onSubmitEditing = () => {
    const { callback } = this.props.navigation.state.params
    // console.log(event.nativeEvent, event.nativeEvent.text)
    this._pressBack(callback)
  }

  ref: any = null

  render() {
    let { openVal, marginTop } = this.state
    const { icon } = this.state
    const { modeInfo } = this.props.screenProps
    const { callback } = this.props.navigation.state.params

    const searchHeight = 40

    let animatedStyle = {
      left: openVal.interpolate({ inputRange: [0, 1], outputRange: [SCREEN_WIDTH, 0] }),
      bottom: openVal.interpolate({ inputRange: [0, 1], outputRange: [SCREEN_HEIGHT, 0] }),
      borderWidth: 0,
      backgroundColor: modeInfo.backgroundColor,
      borderRadius: openVal.interpolate({ inputRange: [-0.15, 0, 1], outputRange: [CIRCLE_SIZE * 1.3, CIRCLE_SIZE * 1.3,  0] }),
      // backgroundColor: openVal.interpolate({
      //   inputRange: [0, 1],
      //   outputRange: [accentColor, modeInfo.backgroundColor]
      // }),
      marginTop: marginTop.interpolate({
        inputRange: [0, SCREEN_HEIGHT],
        outputRange: [0, SCREEN_HEIGHT]
      })
    }

    let animatedToolbarStyle = {
      height: openVal.interpolate({ inputRange: [0, 0.9, 1], outputRange: [searchHeight, searchHeight, searchHeight] }),
      borderWidth: 0,
      backgroundColor: modeInfo.backgroundColor
      // borderRadius: openVal.interpolate({ inputRange: [-0.15, 0, 1], outputRange: [CIRCLE_SIZE * 1.3, CIRCLE_SIZE * 1.3, 0] }),
      // zIndex: openVal.interpolate({ inputRange: [0, 1], outputRange: [0, 3] }),
      // backgroundColor: openVal.interpolate({
      //   inputRange: [0, 1],
      //   outputRange: [accentColor, modeInfo.backgroundColor]
      // }),
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
              inputRange: [0, 9 / 16, 1],
              outputRange: [SCREEN_HEIGHT / 2, SCREEN_HEIGHT / 2, 0]
            })
          }
        ]}
      >
        <Animated.View style={[styles.KeyboardAvoidingView, {
          height: searchHeight,
          flexDirection: 'row',
          borderRadius: 4
        }]} >

          <Animated.View style={[styles.toolbar, animatedToolbarStyle, {
            alignItems: 'center',
            justifyContent: 'center',
            borderBottomLeftRadius: 4,
            borderTopLeftRadius: 4
          }]}>
            <View style={{
              height: searchHeight,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <TouchableNativeFeedback
                onPress={this._pressBack}
                background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
                style={{ borderRadius: searchHeight / 2 }}
              >
                <View style={{ width: searchHeight, height: searchHeight, borderRadius: 25, justifyContent: 'center', alignItems: 'center' }}>
                  {icon && <Image
                    source={icon.backIcon}
                    style={{ width: 15, height: 15, alignSelf: 'center', alignContent: 'center'}}
                  />}
                </View>
              </TouchableNativeFeedback>
            </View>
          </Animated.View >
          <AnimatedKeyboardAvoidingView behavior={'padding'} style={[styles.contentView, {
            height: searchHeight,
            justifyContent: 'center',
            alignContent: 'center'
          }]}>
            <TextInput placeholder={this.state.placeholder}
              autoCorrect={false}
              multiline={false}
              keyboardType='default'
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
            height: searchHeight,
            borderTopRightRadius: 4,
            borderBottomRightRadius: 4
          }]}>
            <View style={{
              height: searchHeight,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <TouchableNativeFeedback
                onPress={() => this._pressBack(callback)}

                background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
                style={{ borderRadius: searchHeight / 2 }}
              >
                <View style={{ width: searchHeight, height: searchHeight, borderRadius: 25, justifyContent: 'center', alignItems: 'center' }}>
                  {icon && <Image
                    source={icon.sendIcon}
                    style={{ width: 15, height: 15, alignSelf: 'center', alignContent: 'center'}}
                  />}
                </View>
              </TouchableNativeFeedback>
            </View>
          </Animated.View >
        </Animated.View>

      </Animated.View>
    )
  }

}

const styles = StyleSheet.create({
  circle: {
    flex: 1,
    position: 'absolute',
    backgroundColor: 'white',
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    borderWidth: 2,
    borderColor: accentColor
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
    borderRadius: CIRCLE_SIZE / 2 // unset value from styles.circle
  },
  toolbar: {
    backgroundColor: standardColor,
    height: 56,
    // elevation: 4,
    flex: -1
  },
  mainFont: {
    fontSize: 15,
    color: accentColor
  },
  textInput: {
    fontSize: 15
  },
  KeyboardAvoidingView: {
    flex: 10,
    // width: width,
    flexDirection: 'column'
  },
  titleView: {
    flex: 1,
    justifyContent: 'center'
    // flexDirection: 'column',
    // justifyContent: 'space-between',
  },
  isPublicView: {
    flex: 1,
    flexDirection: 'row',
    // flexDirection: 'column',
    alignItems: 'center'
  },
  contentView: {
    flex: 12
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
    margin: 10
  },
  openURL: {
    color: accentColor,
    textDecorationLine: 'underline'
  }
})
