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
  StatusBar,
  Picker
} from 'react-native'

import Ionicons from 'react-native-vector-icons/Ionicons'
import { standardColor, accentColor } from '../../constant/colorConfig'

import { getTopicEditAPI } from '../../dao'

import { postCreateTopic } from '../../dao/post'
import Emotion from '../../component/Emotion'

let toolbarActions = [

]

declare var global

let screen = Dimensions.get('window')

let { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = screen

SCREEN_HEIGHT = SCREEN_HEIGHT - (StatusBar.currentHeight || 0) + 1

let CIRCLE_SIZE = 56

const emotionToolbarHeight = 190

export default class NewTopic extends Component<any, any> {

  constructor(props) {
    super(props)
    // console.log(params)
    this.state = {
      icon: false,
      content: '',
      open: '1',
      node: 'talk',
      title: '',
      key: 'addtopic',
      id: '',
      openVal: new Animated.Value(1),
      marginTop: new Animated.Value(0),
      toolbarOpenVal: new Animated.Value(0),
      modalVisible: false,
      selection: { start: 0, end: 0 }
    }
  }

  componentDidMount() {
    const { modeInfo } = this.props.screenProps
    // Animated.spring(this.state.openVal, { toValue: 1, ...config }).start(() => {
      if (modeInfo.settingInfo.psnid === '') {
        global.toast('请首先登录')
        this.props.navigation.goBack()
        return
      }
    // });
  }

  _pressButton = (callback) => {
    Keyboard.dismiss()
    typeof callback === 'function' && callback()
    this.props.navigation.goBack()
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

  componentWillUnmount() {
    this.keyboardDidHideListener.remove()
    this.keyboardDidShowListener.remove()
    this.removeListener && this.removeListener.remove()
  }

  shouldShowEmotion: any = false
  keyboardDidHideListener: any = false
  keyboardDidShowListener: any = false
  removeListener: any = false
  isToolbarShowing: any = false

  async componentWillMount() {
    const { params } = this.props.navigation.state

    if (params.URL) {
      InteractionManager.runAfterInteractions(() => {
        getTopicEditAPI(params.URL).then(data => {
          const match = params.URL.match(/node\/(.*?)\//)
          if (data.node === 'talk' && (match && match[1] !== 'talk')) {
            global.toast('本板块无法发布新帖')
            return this.props.navigation.goBack()
          }

          if (match && match[1]) {
            global.toast('已设置为对应板块' + match[1])
          }
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

  afterExist = ''
  sendReply = () => {
    const result: any = {
      content: this.state.content,
      open: this.state.open,
      node: this.state.node,
      title: this.state.title
    }
    result[this.state.key] = ''
    if (this.state.id !== '') {
      result.topicid = this.state.id
    }
    postCreateTopic(result).then(res => {
      // if (res.url) Linking
      //     .openURL(res.url.replace('http:', 'p9:').replace('https:', 'p9:'))
      //     .catch(err => {})
      return res
    }).then(res => res.text()).then(text => {
      // console.log(text)
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
      const msg = `发布失败: ${err}`
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
    const { icon, toolbarOpenVal } = this.state
    const { modeInfo } = this.props.screenProps
    let outerStyle = {
      marginTop: 0
    }

    let animatedStyle = {
      left: 0,
      top: 0,
      width: SCREEN_WIDTH,
      height: SCREEN_HEIGHT + 100,
      borderWidth: 0,
      borderRadius: 0,
      opacity: 1,
      zIndex: 3,
      backgroundColor: modeInfo.backgroundColor
      // elevation : openVal.interpolate({inputRange: [0 ,1], outputRange: [0, 8]})
    }
    let animatedToolbarStyle = {
      height: 56,
      backgroundColor: modeInfo.standardColor
    }
    const { params } = this.props.navigation.state
    return (
      <View
        ref={ref => this.ref = ref}
        style={[
          styles.circle, styles.open, animatedStyle, outerStyle
        ]}

      >
        <View style={[styles.toolbar, animatedToolbarStyle]}>
          <Ionicons.ToolbarAndroid
            navIconName='md-arrow-back'
            overflowIconName='md-more'
            iconColor={modeInfo.isNightMode ? '#000' : '#fff'}
            title={params.URL ? '编辑讨论' : '创建讨论'}
            style={[styles.toolbar, { backgroundColor: modeInfo.standardColor }]}
            titleColor={modeInfo.isNightMode ? '#000' : '#fff'}
            subtitleColor={modeInfo.isNightMode ? '#000' : '#fff'}
            actions={toolbarActions}
            onIconClicked={this._pressButton}
          />

        </View >

        <View style={[styles.KeyboardAvoidingView, {
          flex: 10
        }]} >
          <TextInput placeholder='标题'
            autoCorrect={false}
            multiline={false}
            keyboardType='default'
            returnKeyType='next'
            returnKeyLabel='next'
            blurOnSubmit={false}
            numberOfLines={100}
            ref={ref => this.title = ref}
            onChange={({ nativeEvent }) => { this.setState({ title: nativeEvent.text }) }}
            value={this.state.title}
            style={[styles.textInput, {
              color: modeInfo.titleTextColor,
              textAlign: 'left',
              height: 56,
              borderBottomColor: modeInfo.brighterLevelOne,
              borderBottomWidth: StyleSheet.hairlineWidth
            }]}
            placeholderTextColor={modeInfo.standardTextColor}
            // underlineColorAndroid={accentColor}
            underlineColorAndroid='rgba(0,0,0,0)'
          />
          <Picker style={{
            flex: 1,
            borderWidth: 1,
            borderBottomColor: modeInfo.standardTextColor
          }}
            prompt='选择'
            selectedValue={this.state.open}
            onValueChange={this.onValueChange.bind(this, 'open')}>
            <Picker.Item label='发布文章（2分钟内会在首页展示）' value='0' />
            <Picker.Item label='保存草稿（仅自己可见）' value='1' />
          </Picker>
          <KeyboardAvoidingView behavior={'padding'} style={[styles.contentView, {
            flex: 12
          }]}>
            <TextInput placeholder='内容'
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
                flex: 1
              }]}
              placeholderTextColor={modeInfo.standardTextColor}
              // underlineColorAndroid={accentColor}
              underlineColorAndroid='rgba(0,0,0,0)'
            />
            <View style={[{
              elevation: 4,
              bottom: 0 // toolbarOpenVal.interpolate({ inputRange: [0, 1], outputRange: [0, 1] })
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
                        style={{ width: 22, height: 22 }}
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
                      style={{ width: 22, height: 22 }}
                    />}
                  </View>
                </TouchableNativeFeedback>
              </View>
            </View>
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
                      borderRadius: 2
                    }} >
                      <global.HTMLView
                        value={this.state.content || '暂无内容'}
                        modeInfo={modeInfo}
                        stylesheet={styles}
                        onImageLongPress={(url) => this.props.navigation.navigate('ImageViewer', {
                          images: [
                            { url }
                          ]
                        })}
                        imagePaddingOffset={60}
                        shouldForceInline={true}
                      />
                    </View>
                  )} />
              )
            }
            {/* 表情 */}
            <Animated.View style={{
              elevation: 4,
              bottom: 0, // toolbarOpenVal.interpolate({ inputRange: [0, 1], outputRange: [0, 100] }),
              backgroundColor: modeInfo.standardColor,
              height: toolbarOpenVal.interpolate({ inputRange: [-1, 0, 1], outputRange: [0, 0, emotionToolbarHeight] }),
              opacity: 1
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
              opacity: 1
            }} />
          </KeyboardAvoidingView>

        </View>

      </View>
    )
  }

  onPressEmotion = ({ text }) => {
    this.addText(
      text
    )
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

  isValueChanged = false
  content: any = false
  toolbar = () => {
    Keyboard.dismiss()
    this.props.navigation.navigate('Toolbar', {
      callback: ({ text }) => {
        this.addText(text)
      }
    })
  }

  onSelectionChange = ({ nativeEvent }) => {
    // console.log(nativeEvent.selection)
    this.setState({
      selection: nativeEvent.selection
    })
  }

  _pressImageButton = () => {
    Keyboard.dismiss()
    this.props.navigation.navigate('UserPhoto', {
      URL: 'http://psnine.com/my/photo?page=1',
      callback: ({ url }) => {
        this.addText(`[img]${url}[/img]`)
      }
    })
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
    // alignSelf:'center',
    // justifyContent: 'space-between',
    flexDirection: 'column'
  },
  titleView: {
    flex: 1,
    // marginTop: -10,
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
