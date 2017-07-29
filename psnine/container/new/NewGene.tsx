import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  TouchableNativeFeedback,
  KeyboardAvoidingView,
  InteractionManager,
  Keyboard,
  TextInput,
  Animated,
  Easing,
  StatusBar,
  Picker,
  Button
} from 'react-native'

import Ionicons from 'react-native-vector-icons/Ionicons'
import { standardColor, accentColor } from '../../constant/colorConfig'

import { getGeneEditAPI } from '../../dao'

import { postCreateTopic } from '../../dao/post'

import Emotion from '../../component/Emotion'

declare var global

let toolbarActions = [

]

let AnimatedKeyboardAvoidingView = Animated.createAnimatedComponent(KeyboardAvoidingView)

let screen = Dimensions.get('window')

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = screen

SCREEN_HEIGHT = SCREEN_HEIGHT - StatusBar.currentHeight + 1

let CIRCLE_SIZE = 56

const emotionToolbarHeight = 190

let config = { tension: 30, friction: 7, ease: Easing.in(Easing.ease(1, 0, 1, 1)), duration: 200 }

export default class NewTopic extends Component<any, any> {

  constructor(props) {
    super(props)
    const { params } = this.props.navigation.state
    const { at = '', shouldShowPoint = false, isOldPage = false } = params
    // console.log(params)
    this.state = {
      icon: false,

      content: '',
      element: '',
      photo: [],
      video: '',
      music: '',
      muparam: '',
      muid: '',
      url: '',
      id: params.id || '',
      key: 'addgene',

      openVal: new Animated.Value(1),
      marginTop: new Animated.Value(0),
      toolbarOpenVal: new Animated.Value(0),
      modalVisible: false,
      selection: { start: 0, end: 0 }
    }
  }

  componentDidMount = () => {
    const { modeInfo } = this.props.screenProps
    let config = { tension: 30, friction: 7 }
    // Animated.spring(this.state.openVal, { toValue: 1, ...config }).start(() => {
      if (modeInfo.settingInfo.psnid === '') {
        global.toast('请首先登录')
        this.props.navigation.goBack()
        return
      }
    // });
  }

  _pressButton = (callback) => {
    const { marginTop, openVal } = this.state
    let value = marginTop._value
    if (Math.abs(value) >= 50) {
      Animated.spring(marginTop, { toValue: 0, ...config }).start()
      return true
    }
    this.content.clear()
    Keyboard.dismiss()
    // Animated.spring(openVal, { toValue: 0, ...config }).start(() => {
      typeof callback === 'function' && callback()
      this.props.navigation.goBack()
    // });

  }

  isKeyboardShowing = false
  _pressEmotion = () => {
    let config = { tension: 30, friction: 7 }
    const target = this.state.toolbarOpenVal._value === 1 ? 0 : 1
    if (target === 1 && this.isKeyboardShowing === true) {
      this.shouldShowEmotion = true
      Keyboard.dismiss()
      return
    }
    Animated.spring(this.state.toolbarOpenVal, { toValue: target, ...config }).start()
  }

  componentWillUnmount = () => {
    this.keyboardDidHideListener.remove()
    this.keyboardDidShowListener.remove()
    this.removeListener && this.removeListener.remove()
  }

  componentWillMount = async () => {
    let config = { tension: 30, friction: 7 }
    const { openVal, marginTop } = this.state
    const { callback } = this.props.navigation.state.params
    const { params } = this.props.navigation.state
    const { modeInfo } = this.props.screenProps

    if (params.URL) {
      InteractionManager.runAfterInteractions(() => {
        getGeneEditAPI(params.URL).then(data => {
          this.setState(data)
        })
      })
    }

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
      })
    })
    this.isToolbarShowing = false

    const icon = await Promise.all([
      Ionicons.getImageSource('md-arrow-back', 20, '#fff'),
      Ionicons.getImageSource('md-happy', 50, '#fff'),
      Ionicons.getImageSource('md-photos', 50, '#fff'),
      Ionicons.getImageSource('md-send', 50, '#fff'),
      Ionicons.getImageSource('md-color-wand', 50, '#fff')
    ])
    this.setState({
      icon: {
        backIcon: icon[0],
        emotionIcon: icon[1],
        photoIcon: icon[2],
        sendIcon: icon[3],
        previewIcon: icon[4]
      }
    })

  }

  sendReply = () => {
    const {
      content,
      photo,
      url,
      key,
      id,
      element,
      video,
      music,
      muparam,
      muid
    }  = this.state
    const result = {
      content, photo: photo.join(',') || '', url,
      key,
      id,
      element,
      video,
      music,
      muparam,
      muid
    }
    result[key] = ''
    if (id !== '') {
      result.geneid = id
    }
    postCreateTopic(result, 'gene').then(res => {
      return res
    }).then(res => res.text()).then(text => {
      if (text.includes('玩脱了')) {
        const arr = text.match(/\<title\>(.*?)\<\/title\>/)
        if (arr && arr[1]) {
          const msg = `发布失败: ${arr[1]}`
          global.toast(msg)
          return
        }
      }
      InteractionManager.runAfterInteractions(() => {
        this._pressButton()
        global.toast('发布成功')
      })
    }).catch(err => {
      const msg = `发布失败: ${arr[1]}`
      global.toast(msg)
    })
  }

  onValueChange = (key: string, value: string) => {
    const newState = {}
    newState[key] = value
    this.setState(newState, () => {
      // this._onRefresh()
    })
  }

  render() {
    let { openVal, marginTop } = this.state
    const { icon, toolbarOpenVal } = this.state
    const { modeInfo } = this.props.screenProps
    let outerStyle = {
      marginTop: marginTop.interpolate({
        inputRange: [0, SCREEN_HEIGHT],
        outputRange: [0, SCREEN_HEIGHT]
      })
    }

    let animatedStyle = {
      left: openVal.interpolate({ inputRange: [0, 1], outputRange: [SCREEN_WIDTH - 56 - 16, 0] }),
      top: openVal.interpolate({ inputRange: [0, 1], outputRange: [SCREEN_HEIGHT - 16 - 56, 0] }),
      width: openVal.interpolate({ inputRange: [0, 1], outputRange: [CIRCLE_SIZE, SCREEN_WIDTH] }),
      height: openVal.interpolate({ inputRange: [0, 1], outputRange: [CIRCLE_SIZE, SCREEN_HEIGHT + 100] }),
      borderWidth: openVal.interpolate({ inputRange: [0, 0.5, 1], outputRange: [2, 2, 0] }),
      borderRadius: openVal.interpolate({ inputRange: [-0.15, 0, 0.5, 1], outputRange: [0, CIRCLE_SIZE / 2, CIRCLE_SIZE * 1.3, 0] }),
      opacity: openVal.interpolate({ inputRange: [0, 0.1, 1], outputRange: [0, 1, 1] }),
      zIndex: openVal.interpolate({ inputRange: [0, 1], outputRange: [0, 3] }),
      backgroundColor: openVal.interpolate({
        inputRange: [0, 1],
        outputRange: [accentColor, modeInfo.backgroundColor]
      })
      //elevation : openVal.interpolate({inputRange: [0 ,1], outputRange: [0, 8]})
    }

    let animatedSubmitStyle = {
      height: openVal.interpolate({ inputRange: [0, 0.9, 1], outputRange: [0, 0, 40] })
    }

    let animatedToolbarStyle = {
      height: openVal.interpolate({ inputRange: [0, 0.9, 1], outputRange: [0, 0, 56] }),
      backgroundColor: modeInfo.standardColor
    }

    const { params } = this.props.navigation.state
    return (
      <Animated.View
        ref={ref => this.ref = ref}
        style={[
          styles.circle, styles.open, animatedStyle, outerStyle
        ]}

      >
        <Animated.View style={[styles.toolbar, animatedToolbarStyle]}>
          <Ionicons.ToolbarAndroid
            navIconName='md-arrow-back'
            overflowIconName='md-more'
            iconColor={modeInfo.isNightMode ? '#000' : '#fff'}
            title={params.URL ? '编辑机因' : '创建机因'}
            style={[styles.toolbar, { backgroundColor: modeInfo.standardColor }]}
            titleColor={modeInfo.isNightMode ? '#000' : '#fff'}
            subtitleColor={modeInfo.isNightMode ? '#000' : '#fff'}
            actions={toolbarActions}
            onIconClicked={this._pressButton}
            onActionSelected={this.onActionSelected}
          />

        </Animated.View >

        <Animated.View style={[styles.KeyboardAvoidingView, {
          flex: openVal.interpolate({ inputRange: [0, 1], outputRange: [0, 10] })
        }]} >
          <AnimatedKeyboardAvoidingView behavior={'padding'} style={[styles.contentView, {
            flex: openVal.interpolate({ inputRange: [0, 1], outputRange: [0, 12] })
          }]}>
            <TextInput placeholder='请说说你对这些图/音乐/视频/电影的感受和看法，不要超过600字哦'
              autoCorrect={false}
              multiline={true}
              keyboardType='default'
              returnKeyType='go'
              returnKeyLabel='go'
              onSelectionChange={this.onSelectionChange}
              blurOnSubmit={true}
              numberOfLines={100}
              ref={ref => this.content = ref}
              onChange={({ nativeEvent }) => { this.setState({ content: nativeEvent.text }) }}
              value={this.state.content}
              style={[styles.textInput, {
                color: modeInfo.titleTextColor,
                textAlign: 'left',
                textAlignVertical: 'top',
                flex: 20
              }]}
              placeholderTextColor={modeInfo.standardTextColor}
              // underlineColorAndroid={accentColor}
              underlineColorAndroid='rgba(0,0,0,0)'
            />
            <Button style={{flex: 1, padding: 5, margin: 5}} title={'编辑元素(选填)'} onPress={() => {
              Keyboard.dismiss()
              this.setState({
                modalVisible: true
              })
            }} color={modeInfo.standardColor}/>
            <Button style={{flex: 1, padding: 5, margin: 5}} title={'点我选择图片(已选择' + this.state.photo.length + '张)'} onPress={() => {
              Keyboard.dismiss()
              this.props.navigation.navigate('UserPhoto', {
                URL: 'http://psnine.com/my/photo?page=1',
                type: 'multi',
                selections: this.state.photo,
                callbackAfterAll: (imageArr) => {
                  this.setState({
                    photo: imageArr
                  })
                }
              })
            }} color={modeInfo.standardColor}/>
            <Animated.View style={[{
              elevation: 4,
              bottom: 0 //toolbarOpenVal.interpolate({ inputRange: [0, 1], outputRange: [0, 1] })
            }, animatedToolbarStyle]}>
              <View style={{
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <View style={{ flexDirection: 'row' }}>
                  <TouchableNativeFeedback
                    onPress={this._pressEmotion}

                    background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
                    style={{ borderRadius: 25 }}
                  >
                    <View style={{ width: 50, height: 50, marginLeft: 0, borderRadius: 25, justifyContent: 'center', alignItems: 'center' }}>
                      {icon && <Image
                        source={icon.emotionIcon}
                        style={{ width: 22, height: 22 }}
                      />}
                    </View>
                  </TouchableNativeFeedback>
                  <TouchableNativeFeedback
                    onPress={this._pressImageButton}

                    background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
                    style={{ borderRadius: 25 }}
                  >
                    <View style={{ width: 50, height: 50, marginLeft: 0, borderRadius: 25, justifyContent: 'center', alignItems: 'center' }}>
                      {icon && <Image
                        source={icon.photoIcon}
                        style={{ width: 22, height: 22}}
                      />}
                    </View>
                  </TouchableNativeFeedback>
                </View>
                <TouchableNativeFeedback
                  onPress={this.toolbar}

                  background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
                  style={{ borderRadius: 25 }}
                >
                  <View style={{ width: 50, height: 50, marginLeft: 0, borderRadius: 25, justifyContent: 'center', alignItems: 'center' }}>
                    {icon && <Image
                      source={icon.previewIcon}
                      style={{ width: 22, height: 22 }}
                    />}
                  </View>
                </TouchableNativeFeedback>
                <TouchableNativeFeedback
                  onPress={this.sendReply}

                  background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
                  style={{ borderRadius: 25 }}
                >
                  <View style={{ width: 50, height: 50, marginLeft: 0, borderRadius: 25, justifyContent: 'center', alignItems: 'center' }}>
                    {icon && <Image
                      source={icon.sendIcon}
                      style={{ width: 22, height: 22}}
                    />}
                  </View>
                </TouchableNativeFeedback>
              </View>
            </Animated.View>
            {
              this.state.modalVisible && (
                <global.MyDialog modeInfo={modeInfo}
                  modalVisible={this.state.modalVisible}
                  onDismiss={() => { this.setState({ modalVisible: false }); this.isValueChanged = false }}
                  onRequestClose={() => { this.setState({ modalVisible: false }); this.isValueChanged = false }}
                  renderContent={() => (
                    <View style={{
                      justifyContent: 'center',
                      alignItems: 'center',
                      backgroundColor: modeInfo.backgroundColor,
                      paddingVertical: 10,
                      paddingHorizontal: 10,
                      elevation: 4,
                      position: 'absolute',
                      left: 20,
                      right: 20,
                      opacity: 1,
                      flex: 0
                    }} borderRadius={2}>
                      <View style={{flex: 1, flexDirection: 'row'}}>
                      <TextInput placeholder='元素，只能由2~15个中文字母数字组成'
                        autoCorrect={false}
                        multiline={false}
                        keyboardType='default'
                        returnKeyType='next'
                        returnKeyLabel='next'
                        blurOnSubmit={false}
                        numberOfLines={1}
                        ref={ref => this.element = ref}
                        onChange={({ nativeEvent }) => { this.setState({ element: nativeEvent.text }) }}
                        value={this.state.element}
                        style={[styles.textInput, {
                          color: modeInfo.titleTextColor,
                          textAlign: 'left',
                          flex: 1,
                          borderBottomColor: modeInfo.brighterLevelOne,
                          borderBottomWidth: StyleSheet.hairlineWidth
                        }]}
                        placeholderTextColor={modeInfo.standardTextColor}
                        // underlineColorAndroid={accentColor}
                        underlineColorAndroid='rgba(0,0,0,0)'
                      />
                      </View>
                      <View style={{flex: 1, flexDirection: 'row'}}>
                      <TextInput placeholder='视频地址，目前仅支持youku和bilibili'
                        autoCorrect={false}
                        multiline={false}
                        keyboardType='default'
                        returnKeyType='next'
                        returnKeyLabel='next'
                        blurOnSubmit={false}
                        numberOfLines={1}
                        ref={ref => this.element = ref}
                        onChange={({ nativeEvent }) => { this.setState({ video: nativeEvent.text }) }}
                        value={this.state.video}
                        style={[styles.textInput, {
                          color: modeInfo.titleTextColor,
                          textAlign: 'left',
                          flex: 1,
                          borderBottomColor: modeInfo.brighterLevelOne,
                          borderBottomWidth: StyleSheet.hairlineWidth
                        }]}
                        placeholderTextColor={modeInfo.standardTextColor}
                        // underlineColorAndroid={accentColor}
                        underlineColorAndroid='rgba(0,0,0,0)'
                      />
                      </View>
                      <View style={{flex: 1, flexDirection: 'row'}}>
                        <Picker style={{
                          flex: 1,
                          borderWidth: 1,
                          color: modeInfo.standardTextColor,
                          borderBottomColor: modeInfo.standardTextColor
                        }}
                          prompt='音乐类型'
                          selectedValue={this.state.muparam}
                          onValueChange={this.onValueChange.bind(this, 'muparam')}>
                          <Picker.Item label='音乐类型' value='' />
                          <Picker.Item label='单曲' value='mu' />
                          <Picker.Item label='专辑' value='al' />
                          <Picker.Item label='电台' value='dj' />
                          <Picker.Item label='歌单' value='pl' />
                        </Picker>
                        <TextInput placeholder='网易音乐的纯数字ID'
                          autoCorrect={false}
                          multiline={false}
                          keyboardType='default'
                          returnKeyType='next'
                          returnKeyLabel='next'
                          blurOnSubmit={false}
                          numberOfLines={1}
                          ref={ref => this.muid = ref}
                          onChange={({ nativeEvent }) => { this.setState({ muid: nativeEvent.text }) }}
                          value={this.state.muid}
                          style={[styles.textInput, {
                            color: modeInfo.titleTextColor,
                            textAlign: 'left',
                            flex: 1.5,
                            borderBottomColor: modeInfo.brighterLevelOne,
                            borderBottomWidth: StyleSheet.hairlineWidth
                          }]}
                          placeholderTextColor={modeInfo.standardTextColor}
                          // underlineColorAndroid={accentColor}
                          underlineColorAndroid='rgba(0,0,0,0)'
                        />
                      </View>
                      <View style={{flex: 1, flexDirection: 'row'}}>
                        <TextInput placeholder='出处，选填，http开头哦'
                          autoCorrect={false}
                          multiline={false}
                          keyboardType='default'
                          returnKeyType='next'
                          returnKeyLabel='next'
                          blurOnSubmit={false}
                          numberOfLines={1}
                          ref={ref => this.url = ref}
                          onChange={({ nativeEvent }) => { this.setState({ url: nativeEvent.text }) }}
                          value={this.state.url}
                          style={[styles.textInput, {
                            color: modeInfo.titleTextColor,
                            textAlign: 'left',
                            height: 56,
                            flex: 1,
                            borderBottomColor: modeInfo.brighterLevelOne,
                            borderBottomWidth: StyleSheet.hairlineWidth
                          }]}
                          placeholderTextColor={modeInfo.standardTextColor}
                          // underlineColorAndroid={accentColor}
                          underlineColorAndroid='rgba(0,0,0,0)'
                        />
                      </View>
                    </View>
                  )} />
              )
            }
            {/* 表情 */}
            <Animated.View style={{
              elevation: 4,
              bottom: 0, //toolbarOpenVal.interpolate({ inputRange: [0, 1], outputRange: [0, 100] }),
              backgroundColor: modeInfo.standardColor,
              height: toolbarOpenVal.interpolate({ inputRange: [-1, 0, 1], outputRange: [0, 0, emotionToolbarHeight] }),
              opacity: openVal.interpolate({ inputRange: [0, 0.9, 1], outputRange: [0, 0, 1] })
            }} >
              <Emotion
                modeInfo={modeInfo}
                onPress={this.onPressEmotion}
              />
            </Animated.View>
            <Animated.View style={{
              elevation: 4,
              bottom: 0,
              backgroundColor: modeInfo.standardColor,
              height: 100,
              opacity: openVal.interpolate({ inputRange: [0, 0.9, 1], outputRange: [0, 0, 1] })
            }} />
          </AnimatedKeyboardAvoidingView>

        </Animated.View>

      </Animated.View>
    )
  }

  onPressEmotion = ({ text, url }) => {
    this.addText(
      text
    )
  }

  toolbar = () => {
    const { params } = this.props.navigation.state
    Keyboard.dismiss()
    this.props.navigation.navigate('Toolbar', {
      callback: ({ text, offset }) => {
        this.addText(text, true)
      }
    })
  }

  addText = (text) => {
    const origin = this.state.content
    let { start = 0, end = 0 } = this.state.selection
    if (start !== end) {
      const exist = origin.slice(start, end)
      text = text.slice(0, start) + exist + text.slice(end)
      end = start + exist.length
    }
    let input = origin.slice(0, start) + text + origin.slice(end)
    this.setState({
      content: input,
      selection: { start, end }
    }, () => {
      this.content && this.content.focus()
    })
  }

  onSelectionChange = ({ nativeEvent }) => {
    // console.log(nativeEvent.selection)
    this.setState({
      selection: nativeEvent.selection
    })
  }

  _pressImageButton = (callback) => {
    const { params } = this.props.navigation.state
    Keyboard.dismiss()
    this.props.navigation.navigate('UserPhoto', {
      URL: 'http://psnine.com/my/photo?page=1',
      callback: ({ url }) => {
        this.addText(`[img]${url}[/img]`)
      }
    })
  }
}

const width = Dimensions.get('window').width

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
    elevation: 12
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
    elevation: 4,
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
    //alignSelf:'center',
    //justifyContent: 'space-between',
    flexDirection: 'column'
  },
  titleView: {
    flex: 1,
    //marginTop: -10,
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
