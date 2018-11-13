import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Dimensions,
  InteractionManager,
  Keyboard,
  TextInput,
  Animated,
  StatusBar,
  Picker,
  Button
} from 'react-native'

import Ionicons from 'react-native-vector-icons/Ionicons'
import { standardColor, accentColor } from '../../constant/colorConfig'

import { getTradeEditAPI } from '../../dao'

import { postCreateTopic } from '../../dao/post'

let toolbarActions = [

]

let screen = Dimensions.get('window')

let { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = screen

SCREEN_HEIGHT = SCREEN_HEIGHT - (StatusBar.currentHeight || 0) + 1

let CIRCLE_SIZE = 56

declare var global
/* tslint:disable */
let config = { tension: 30, friction: 7 }
const areasInfo = [{'text': '北京', 'value': 'beijing'}, {'text': '上海', 'value': 'shanghai'}, {'text': '天津', 'value': 'tianjin'}, {'text': '重庆', 'value': 'chongqing'}, {'text': '广东', 'value': 'guangdong'}, {'text': '福建', 'value': 'fujian'}, {'text': '广西', 'value': 'guangxi'}, {'text': '海南', 'value': 'hainan'}, {'text': '河北', 'value': 'hebei'}, {'text': '山西', 'value': 'shanxi'}, {'text': '内蒙古', 'value': 'neimenggu'}, {'text': '山东', 'value': 'shandong'}, {'text': '江苏', 'value': 'jiangsu'}, {'text': '浙江', 'value': 'zhejiang'}, {'text': '安徽', 'value': 'anhui'}, {'text': '河南', 'value': 'henan'}, {'text': '湖北', 'value': 'hubei'}, {'text': '湖南', 'value': 'hunan'}, {'text': '江西', 'value': 'jiangxi'}, {'text': '辽宁', 'value': 'liaoning'}, {'text': '黑龙江', 'value': 'heilongjiang'}, {'text': '吉林', 'value': 'jilin'}, {'text': '四川', 'value': 'sichuan'}, {'text': '云南', 'value': 'yunnan'}, {'text': '贵州', 'value': 'guizhou'}, {'text': '西藏', 'value': 'xizang'}, {'text': '陕西', 'value': 'shanxi2'}, {'text': '新疆', 'value': 'xinjiang'}, {'text': '甘肃', 'value': 'gansu'}, {'text': '宁夏', 'value': 'ningxia'}, {'text': '青海', 'value': 'qinghai'}]
/* tslint:enable */
export default class NewTopic extends Component<any, any> {

  constructor(props) {
    super(props)
    // console.log(params)
    this.state = {
      icon: false,
      title: '',
      photo: [],
      price: '',
      qq: '',
      tb: '',
      content: '',
      category: 'game',
      type: 'sell',
      pf: 'psv',
      way: 'freepost',
      version: 'hk',
      lang: 'cn',
      province: 'beijing',
      id: '',
      key: 'addtrade',
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
    const { marginTop } = this.state
    let value = marginTop._value
    if (Math.abs(value) >= 50) {
      Animated.spring(marginTop, { toValue: 0, ...config }).start()
      return true
    }
    // this.content.clear();
    Keyboard.dismiss()
    // Animated.spring(openVal, { toValue: 0, ...config }).start(() => {
      typeof callback === 'function' && callback()
      this.props.navigation.goBack()
    // });

  }

  isKeyboardShowing = false
  shouldShowEmotion = false
  keyboardDidHideListener: any = false
  keyboardDidShowListener: any = false
  removeListener: any = false
  isToolbarShowing: any = false
  ref: any = false
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

  async componentWillMount() {
    const { params } = this.props.navigation.state

    if (params.URL) {
      InteractionManager.runAfterInteractions(() => {
        getTradeEditAPI(params.URL).then(data => {
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
    // return
    const { title, photo, price, qq, tb, content, category, type, pf,
      id, key, way, version, lang, province } = this.state
    const result: any = {
      title,
      photo: photo.join(',') || '',
      price,
      qq,
      tb,
      content,
      category,
      type,
      pf,
      way,
      version,
      lang,
      province
    }
    result[key] = ''
    if (id !== '') {
      result.tradeid = id
    }

    postCreateTopic(result, 'trade').then(res => {
      // console.log(res)
      // res.url
      return res
    }).then(res => res.text()).then(text => {
      // console.log(text, text.length)
      if (text.includes('玩脱了')) {
        const arr = text.match(/\<title\>(.*?)\<\/title\>/)
        if (arr && arr[1]) {
          const msg = `发布失败: ${arr[1]}`
          // ToastAndroid.show(msg, ToastAndroid.SHORT);
          global.toast(msg)
          return
        }
      }
      InteractionManager.runAfterInteractions(() => {
        // ToastAndroid.show('评论成功', ToastAndroid.SHORT);
        // global.toast('评论成功')
        this.props.navigation.goBack()
        // this._pressButton(() => params.callback && params.callback())
        global.toast('发布成功')
      })
    }).catch(err => {
      // console.log(err.toString())
      const msg = `发布失败: ${err}`
      global.toast(msg)
      // ToastAndroid.show(msg, ToastAndroid.SHORT);
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
    const areas = areasInfo.map((item, index) => <Picker.Item key={index} value={item.value} label={'地区: ' + item.text}></Picker.Item>)

    let { openVal, marginTop } = this.state
    const { modeInfo } = this.props.screenProps
    const statusHeight = global.isIOS ? 0 : (StatusBar.currentHeight || 0)
    let outerStyle = {
      marginTop: marginTop.interpolate({
        inputRange: [0, SCREEN_HEIGHT],
        outputRange: [0, SCREEN_HEIGHT]
      })
    }

    let animatedStyle = {
      // left: openVal.interpolate({ inputRange: [0, 1], outputRange: [SCREEN_WIDTH - 56 - 16, 0] }),
      // top: openVal.interpolate({ inputRange: [0, 1], outputRange: [SCREEN_HEIGHT - 16 - 56, 0] }),
      width: openVal.interpolate({ inputRange: [0, 1], outputRange: [CIRCLE_SIZE, SCREEN_WIDTH] }),
      height: openVal.interpolate({ inputRange: [0, 1], outputRange: [CIRCLE_SIZE, SCREEN_HEIGHT + 100 + statusHeight] }),
      borderWidth: openVal.interpolate({ inputRange: [0, 0.5, 1], outputRange: [2, 2, 0] }),
      borderRadius: openVal.interpolate({ inputRange: [-0.15, 0, 0.5, 1], outputRange: [0, CIRCLE_SIZE / 2, CIRCLE_SIZE * 1.3, 0] }),
      opacity: openVal.interpolate({ inputRange: [0, 0.1, 1], outputRange: [0, 1, 1] }),
      zIndex: openVal.interpolate({ inputRange: [0, 1], outputRange: [0, 3] }),
      backgroundColor: openVal.interpolate({
        inputRange: [0, 1],
        outputRange: [accentColor, modeInfo.backgroundColor]
      })
      // elevation : openVal.interpolate({inputRange: [0 ,1], outputRange: [0, 8]})
    }

    let animatedToolbarStyle = {
      height: openVal.interpolate({ inputRange: [0, 0.9, 1], outputRange: [0, 0, 56 + statusHeight] }),
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
            title={params.URL ? '编辑交易' : '发布交易'}
            style={[styles.toolbar, { backgroundColor: modeInfo.standardColor }]}
            titleColor={modeInfo.isNightMode ? '#000' : '#fff'}
            subtitleColor={modeInfo.isNightMode ? '#000' : '#fff'}
            actions={toolbarActions}
            onIconClicked={this._pressButton}
          />

        </Animated.View >
          <View style={{height: 56, flexDirection: 'row'}}>
              <TextInput placeholder='游戏 or 数码产品名'
                autoCorrect={false}
                multiline={false}
                keyboardType='default'
                returnKeyType='next'
                returnKeyLabel='next'
                blurOnSubmit={false}
                numberOfLines={1}
                ref={ref => this.title = ref}
                onChange={({ nativeEvent }) => { this.setState({ title: nativeEvent.text }) }}
                value={this.state.title}
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
        <Animated.View style={[styles.KeyboardAvoidingView, {
          flex: openVal.interpolate({ inputRange: [0, 1], outputRange: [0, 10] })
        }]} >
          <Animated.View behavior={'position'} keyboardVerticalOffset={-50} contentContainerStyle={{flex: 1}} style={[styles.contentView, {
            flex: openVal.interpolate({ inputRange: [0, 1], outputRange: [0, 12] })
          }]}>
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
                      flex: 0,
                      borderRadius: 2
                    }} >
                    <View style={{flex: 1, flexDirection: 'row'}}>
                      <Picker style={{
                        flex: 1,
                        borderWidth: 1,
                        borderBottomColor: modeInfo.standardTextColor,
                        color: modeInfo.standardTextColor
                      }}
                        prompt='分类'
                        selectedValue={this.state.category}
                        onValueChange={this.onValueChange.bind(this, 'category')}>
                        <Picker.Item label='分类: 游戏' value='game' />
                        <Picker.Item label='分类: 游戏机' value='console' />
                        <Picker.Item label='分类: 数码产品' value='digital' />
                      </Picker>
                      <Picker style={{
                        flex: 1,
                        borderWidth: 1,
                        borderBottomColor: modeInfo.standardTextColor,
                        color: modeInfo.standardTextColor
                      }}
                        prompt='类型'
                        selectedValue={this.state.type}
                        onValueChange={this.onValueChange.bind(this, 'type')}>
                        <Picker.Item label='类型: 出售' value='sell' />
                        <Picker.Item label='类型: 求购' value='buy' />
                      </Picker>
                    </View>
                    <View style={{flex: 1, flexDirection: 'row'}}>
                      <Picker style={{
                        flex: 1,
                        borderWidth: 1,
                        borderBottomColor: modeInfo.standardTextColor,
                        color: modeInfo.standardTextColor
                      }}
                        prompt='平台'
                        selectedValue={this.state.pf}
                        onValueChange={this.onValueChange.bind(this, 'pf')}>
                        <Picker.Item label='平台: PSV' value='psv' />
                        <Picker.Item label='平台: PS3' value='ps3' />
                        <Picker.Item label='平台: PS4' value='ps4' />
                        <Picker.Item label='平台: Xboxone' value='xboxone' />
                        <Picker.Item label='平台: Xbox360' value='xbox360' />
                        <Picker.Item label='平台: 3DS' value='3ds' />
                        <Picker.Item label='平台: WiiU' value='wiiu' />
                      </Picker>
                      <Picker style={{
                        flex: 1,
                        borderWidth: 1,
                        borderBottomColor: modeInfo.standardTextColor,
                        color: modeInfo.standardTextColor
                      }}
                        prompt='方式'
                        selectedValue={this.state.way}
                        onValueChange={this.onValueChange.bind(this, 'way')}>
                        <Picker.Item label='方式: 包邮' value='freepost' />
                        <Picker.Item label='方式: 不包邮' value='paypost' />
                        <Picker.Item label='方式: 面交' value='face' />
                      </Picker>
                    </View>
                    <View style={{flex: 1, flexDirection: 'row'}}>
                      <Picker style={{
                        flex: 1,
                        borderWidth: 1,
                        borderBottomColor: modeInfo.standardTextColor,
                        color: modeInfo.standardTextColor
                      }}
                        prompt='版本'
                        selectedValue={this.state.version}
                        onValueChange={this.onValueChange.bind(this, 'version')}>
                        <Picker.Item label='版本: 港版' value='hk' />
                        <Picker.Item label='版本: 日版' value='jp' />
                        <Picker.Item label='版本: 美版' value='us' />
                        <Picker.Item label='版本: 国行' value='cn' />
                        <Picker.Item label='版本: 欧版' value='eu' />
                        <Picker.Item label='版本: 韩版' value='kr' />
                        <Picker.Item label='版本: 台版' value='tw' />
                      </Picker>
                      <Picker style={{
                        flex: 1,
                        borderWidth: 1,
                        borderBottomColor: modeInfo.standardTextColor,
                        color: modeInfo.standardTextColor
                      }}
                        prompt='语言'
                        selectedValue={this.state.lang}
                        onValueChange={this.onValueChange.bind(this, 'lang')}>
                        <Picker.Item label='语言: 中文' value='cn' />
                        <Picker.Item label='语言: 日文' value='jp' />
                        <Picker.Item label='语言: 英文' value='en' />
                        <Picker.Item label='语言: 韩文' value='kr' />
                      </Picker>
                    </View>
                    <View style={{flex: 1, flexDirection: 'row'}}>
                      <Picker style={{
                        flex: 1,
                        borderWidth: 1,
                        borderBottomColor: modeInfo.standardTextColor,
                        color: modeInfo.standardTextColor
                      }}
                        prompt='地区'
                        selectedValue={this.state.province}
                        onValueChange={this.onValueChange.bind(this, 'province')}>
                        {areas}
                      </Picker>
                    </View>
                  </View>
                )}/>
              )
            }

            <View style={{height: 56, flexDirection: 'row'}}>
              <TextInput placeholder='价格'
                autoCorrect={false}
                multiline={false}
                keyboardType='default'
                returnKeyType='next'
                returnKeyLabel='next'
                blurOnSubmit={false}
                numberOfLines={1}
                onChange={({ nativeEvent }) => { this.setState({ price: nativeEvent.text }) }}
                value={this.state.price}
                style={[styles.textInput, {
                  color: modeInfo.titleTextColor,
                  textAlign: 'left',
                  flex: 1,
                  borderBottomColor: modeInfo.brighterLevelOne,
                  borderBottomWidth: StyleSheet.hairlineWidth
                }]}
                placeholderTextColor={modeInfo.standardTextColor}
                underlineColorAndroid='rgba(0,0,0,0)'
              />
              <TextInput placeholder='请填写你的QQ号'
                autoCorrect={false}
                multiline={false}
                keyboardType='default'
                returnKeyType='next'
                returnKeyLabel='next'
                blurOnSubmit={false}
                numberOfLines={1}
                onChange={({ nativeEvent }) => { this.setState({ qq: nativeEvent.text }) }}
                value={this.state.qq}
                style={[styles.textInput, {
                  color: modeInfo.titleTextColor,
                  textAlign: 'left',
                  flex: 1,
                  borderBottomColor: modeInfo.brighterLevelOne,
                  borderBottomWidth: StyleSheet.hairlineWidth
                }]}
                placeholderTextColor={modeInfo.standardTextColor}
                underlineColorAndroid='rgba(0,0,0,0)'
              />
            </View>
            <TextInput placeholder='请填写闲鱼链接'
              autoCorrect={false}
              multiline={false}
              keyboardType='default'
              returnKeyType='next'
              returnKeyLabel='next'
              blurOnSubmit={false}
              numberOfLines={1}
              onChange={({ nativeEvent }) => { this.setState({ tb: nativeEvent.text }) }}
              value={this.state.tb}
              style={[styles.textInput, {
                color: modeInfo.titleTextColor,
                textAlign: 'left',
                height: 56,
                borderBottomColor: modeInfo.brighterLevelOne,
                borderBottomWidth: StyleSheet.hairlineWidth
              }]}
              placeholderTextColor={modeInfo.standardTextColor}
              underlineColorAndroid='rgba(0,0,0,0)'
            />
            <View style={{flex: 2}}>
              <TextInput placeholder='简述'
                autoCorrect={false}
                multiline={true}
                keyboardType='default'
                returnKeyType={global.isIOS ? 'default' : 'go'}
                blurOnSubmit={global.isIOS ? false : true}
                returnKeyLabel='go'
                ref={ref => this.content = ref}
                onChange={({ nativeEvent }) => { this.setState({ content: nativeEvent.text }) }}
                value={this.state.content}
                style={[styles.textInput, {
                  color: modeInfo.titleTextColor,
                  textAlign: 'left',
                  textAlignVertical: 'top',
                  flex: 2
                }]}
                placeholderTextColor={modeInfo.standardTextColor}
                // underlineColorAndroid={accentColor}
                underlineColorAndroid='rgba(0,0,0,0)'
              />
            </View>
            <View style={{flex: 5}}>
              <Button title={'编辑选填项'} onPress={() => {
                Keyboard.dismiss()
                this.setState({
                  modalVisible: true
                })
              }} color={modeInfo.standardColor}/>
              <Button title={'点我选择图片(已选择' + this.state.photo.length + '张)'} onPress={() => {
                Keyboard.dismiss()
                this.props.navigation.navigate('UserPhoto', {
                  URL: 'https://psnine.com/my/photo?page=1',
                  type: 'multi',
                  selections: this.state.photo,
                  callbackAfterAll: (imageArr) => {
                    this.setState({
                      photo: imageArr
                    })
                  }
                })
              }} color={modeInfo.standardColor}/>
              <Button title={'提交'} onPress={this.sendReply} color={modeInfo.standardColor}/>
            </View>
          </Animated.View>

        </Animated.View>

      </Animated.View>
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

  content: any = false

  onSelectionChange = ({ nativeEvent }) => {
    // console.log(nativeEvent.selection)
    this.setState({
      selection: nativeEvent.selection
    })
  }

  _pressImageButton = () => {
    Keyboard.dismiss()
    this.props.navigation.navigate('UserPhoto', {
      URL: 'https://psnine.com/my/photo?page=1',
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
