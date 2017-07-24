import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableNativeFeedback,
  ListView,
  ScrollView,
  Picker,
  TextInput
} from 'react-native'

import Ionicons from 'react-native-vector-icons/Ionicons'
import { standardColor, accentColor } from '../../constant/colorConfig'

let dataSource = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2
})

const items = [
  {
    text: '加粗',
    tip: '要加粗的文字',
    onPress: function(index) {
      const { params } = this.props.navigation.state
      const { callback } = params
      if (callback) {
        this.setState({
          modalIndex: index,
          completeCallback: (text) => {
            this.props.navigation.goBack()
            callback({
              text: `[b]${text}[/b]`
            })
          }
        })
      }
    }
  },
  {
    text: '彩色字体',
    onPress: null,
    tip: '要使用彩色字体的文字',
    renderComponent: function(index) {
      const { modeInfo } = this.props.screenProps
      return (
        <Picker style={{
          flex: 1,
          borderWidth: 1,
          color: modeInfo.standardTextColor
        }}
          prompt='选择颜色'
          selectedValue={this.state.color}
          onValueChange={(value) => {
            if (value === 'select') return
            const { params } = this.props.navigation.state
            const { callback } = params
            this.setState({
              color: value
            })
            if (callback) {
              this.setState({
                modalIndex: index,
                completeCallback: (text) => {
                  this.props.navigation.goBack()
                  callback({
                    text: `[color=${value}]${text}[/color]`
                  })
                }
              })
            }
          }}>
          <Picker.Item label='选择颜色' value='select' />
          <Picker.Item label='红色' color='red' value='red' />
          <Picker.Item label='橘黄' color='orange'  value='orange' />
          <Picker.Item label='棕色' color='brown'  value='brown' />
          <Picker.Item label='蓝色' color='blue'  value='blue' />
          <Picker.Item label='深紫' color='deeppink'  value='deeppink' />
        </Picker>
      )
    }
  },
  {
    text: '居中',
    tip: '要居中的文字',
    onPress: function(index) {
      const { params } = this.props.navigation.state
      const { callback } = params
      if (callback) {
        this.setState({
          modalIndex: index,
          completeCallback: (text) => {
            this.props.navigation.goBack()
            callback({
              text: `[align=center]${text}[/align]`
            })
          }
        })
      }
    }
  },
  {
    text: '链接',
    tip: '需插入的链接地址',
    onPress: function(index) {
      const { params } = this.props.navigation.state
      const { callback } = params
      if (callback) {
        this.setState({
          modalIndex: index,
          completeCallback: (text) => {
            this.props.navigation.goBack()
            callback({
              text: `[url]${text}[/url]`
            })
          }
        })
      }
    }
  },
  {
    text: '视频',
    tip: '需插入的flash视频链接地址',
    onPress: function(index) {
      const { params } = this.props.navigation.state
      const { callback } = params
      if (callback) {
        this.setState({
          modalIndex: index,
          completeCallback: (text) => {
            this.props.navigation.goBack()
            callback({
              text: `[flash]${text}[/flash]`
            })
          }
        })
      }
    }
  },
  {
    text: '引用',
    tip: '需要引用的文字内容',
    onPress: function(index) {
      const { params } = this.props.navigation.state
      const { callback } = params
      if (callback) {
        this.setState({
          modalIndex: index,
          completeCallback: (text) => {
            this.props.navigation.goBack()
            callback({
              text: `[quote]${text}[/quote]`
            })
          }
        })
      }
    }
  },
  {
    text: '图片',
    tip: '图片的地址',
    onPress: function(index) {
      const { params } = this.props.navigation.state
      const { callback } = params
      if (callback) {
        this.setState({
          modalIndex: index,
          completeCallback: (text) => {
            this.props.navigation.goBack()
            callback({
              text: `[img]${text}[/img]`
            })
          }
        })
      }
    }
  },
  {
    text: '刮刮卡',
    tip: '需要使用刮刮卡隐藏的文字',
    onPress: function(index) {
      const { params } = this.props.navigation.state
      const { callback } = params
      if (callback) {
        this.setState({
          modalIndex: index,
          completeCallback: (text) => {
            this.props.navigation.goBack()
            callback({
              text: `[mark]${text}[/mark]`
            })
          }
        })
      }
    }
  },
  {
    text: '删除线',
    tip: '需应用删除线的文字',
    onPress: function(index) {
      const { params } = this.props.navigation.state
      const { callback } = params
      if (callback) {
        this.setState({
          modalIndex: index,
          completeCallback: (text) => {
            this.props.navigation.goBack()
            callback({
              text: `[s]${text}[/s]`
            })
          }
        })
      }
    }
  },
  {
    text: '分页',
    tip: '分页的标题',
    onPress: function(index) {
      const { params } = this.props.navigation.state
      const { callback } = params
      if (callback) {
        this.setState({
          modalIndex: index,
          completeCallback: (text) => {
            this.props.navigation.goBack()
            callback({
              text: `[title]${text}[/title]`
            })
          }
        })
      }
    }
  }
]

const getMapper = index => {
  const mapper = items[index].tip
  if (mapper) return mapper
  return items[0].tip
}

class About extends Component {

  constructor(props) {
    super(props)

    this.state = {
      color: 'select',
      text: '',
      modalIndex: -1,
      completeCallback: () => {}
    }
  }

  cb = () => {
    this.setState({
      modalIndex: -1
    }, () => {
      this.state.completeCallback && this.state.completeCallback(this.state.text)
    })
  }

  render() {
    const { modeInfo } = this.props.screenProps

    return (
      <View style={{ flex: 1, backgroundColor: modeInfo.backgroundColor }}>
        <Ionicons.ToolbarAndroid
          navIconName='md-arrow-back'
          overflowIconName='md-more'
          iconColor={modeInfo.isNightMode ? '#000' : '#fff'}
          title={`花式回复`}
          titleColor={modeInfo.isNightMode ? '#000' : '#fff'}
          style={[styles.toolbar, { backgroundColor: modeInfo.standardColor }]}
          onIconClicked={() => {
            this.props.navigation.goBack()
          }}
        />
        {
          this.state.modalIndex !== -1 && (
            <global.MyDialog modeInfo={modeInfo}
              modalVisible={this.state.modalIndex !== -1}
              onDismiss={() => { this.setState({ modalIndex: -1 }); this.isValueChanged = false }}
              onRequestClose={() => { this.setState({ modalIndex: -1 }); this.isValueChanged = false }}
              renderContent={() => (
                <View style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: modeInfo.backgroundColor,
                  paddingVertical: 20,
                  paddingHorizontal: 20,
                  elevation: 4,
                  position: 'absolute',
                  left: 20,
                  right: 20,
                  opacity: 1,
                  flex: 0
                }} borderRadius={2}>
                  <Text style={{ alignSelf: 'flex-start', fontSize: 15, color: modeInfo.titleTextColor }}>{'请输入' + getMapper(this.state.modalIndex)}</Text>
                  <View style={{flex: 1, flexDirection: 'row'}}>
                    <TextInput placeholder=''
                      autoCorrect={false}
                      multiline={false}
                      autoFocus={true}
                      numberOfLines={1}
                      onSubmitEditing={this.cb}
                      ref={ref => this.text = ref}
                      onChange={({ nativeEvent }) => { this.setState({ text: nativeEvent.text }) }}
                      value={this.state.text}
                      style={[styles.textInput, {
                        color: modeInfo.titleTextColor,
                        textAlign: 'left',
                        flex: 1,
                        borderBottomColor: modeInfo.brighterLevelOne,
                        borderBottomWidth: StyleSheet.hairlineWidth
                      }]}
                      placeholderTextColor={modeInfo.standardTextColor}
                      // underlineColorAndroid={accentColor}
                      underlineColorAndroid={modeInfo.accentColor}
                    />
                  </View>
                  <TouchableNativeFeedback onPress={this.cb}>
                    <View style={{ alignSelf: 'flex-end', paddingHorizontal: 8, paddingVertical: 5 }}>
                      <Text style={{color: '#009688'}}>确定</Text>
                    </View>
                  </TouchableNativeFeedback>
                </View>
              )}>
            </global.MyDialog>
          )
        }
        <ScrollView style={{ flex: 2, backgroundColor: modeInfo.backgroundColor }}>
          {items.map((item, index) => {
            const inner = (
              <View pointerEvents={item.renderComponent ? 'auto' : 'box-only'} style={{ height: 60, backgroundColor: modeInfo.backgroundColor,
                padding: 6,
                flexDirection: 'row',
                alignItems: 'center',
                borderBottomColor: modeInfo.brighterLevelOne, borderBottomWidth: StyleSheet.hairlineWidth}}>
                <Text style={[styles.themeName, { flex: 1, color: modeInfo.titleTextColor }]}>
                  {item.text}
                </Text>
                {item.renderComponent && item.renderComponent.bind(this)(index) || undefined}
              </View>
            )
            return item.renderComponent ? (
              <View key={index} style={{flex: 1}}>
                {inner}
              </View>
            ) : (
              <TouchableNativeFeedback key={index} onPress={item.onPress ? item.onPress.bind(this, index) : null}>
                {inner}
              </TouchableNativeFeedback>
            )
          })}
        </ScrollView>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  themeItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6
  },
  themeName: {
    flex: 1,
    fontSize: 16,
    marginLeft: 16
  },
  toolbar: {
    backgroundColor: standardColor,
    height: 56,
    elevation: 4
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

export default About