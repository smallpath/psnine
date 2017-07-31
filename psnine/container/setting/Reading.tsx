import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableNativeFeedback,
  Switch,
  AsyncStorage
} from 'react-native'

import Ionicons from 'react-native-vector-icons/Ionicons'
import { standardColor, idColor, accentColor } from '../../constant/colorConfig'

declare var global

class Theme extends Component<any, any> {

  constructor(props) {
    super(props)
    // console.log(typeof global.shouldSendGA === 'boolean', global.shouldSendGA, typeof global.shouldSendGA)
    this.state = {
      loadImageWithoutWifi: global.loadImageWithoutWifi || false,
      shouldSendGA: typeof global.shouldSendGA === 'boolean' ? global.shouldSendGA : true
    }
  }

  loadImageWithoutWIFI = (_?, index?) => {
    const { modeInfo } = this.props.screenProps
    return (
      <TouchableNativeFeedback onPress={() => {
        const value = !this.state.loadImageWithoutWifi
        this.setState({ loadImageWithoutWifi: value }, () => {
          global.loadImageWithoutWifi = value
          AsyncStorage.setItem('@Theme:loadImageWithoutWifi', value.toString())
        })
      }}>
        <View key={index} style={[styles.themeItem, {
            flex: -1,
            height: 80,
            flexDirection: 'row',
            padding: 10,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: modeInfo.brighterLevelOne
        }]}>
          <View style={{flex: 4, justifyContent: 'center', alignItems: 'flex-start'}}>
            <Text style={[styles.themeName, { marginTop: 12, flex: 1, color: modeInfo.titleTextColor }]}>
              {'使用移动网络时默认加载图片'}
            </Text>
            <Text style={[styles.themeName, { marginTop: -12, fontSize: 13, flex: 1, color: modeInfo.standardTextColor }]}>
              {'当前:' + (this.state.loadImageWithoutWifi ? '是' : '否')}
            </Text>
          </View>
          <Switch
            style={{
              flex: 1
            }}
            onValueChange={(value) => this.setState({ loadImageWithoutWifi: value }, () => {
              global.loadImageWithoutWifi = value
              AsyncStorage.setItem('@Theme:loadImageWithoutWifi', value.toString())
            })}
            value={this.state.loadImageWithoutWifi} />
        </View>
      </TouchableNativeFeedback>
    )
  }

  sendGA = (_?, index?) => {
    const { modeInfo } = this.props.screenProps
    return (
      <TouchableNativeFeedback onPress={() => {
        const value = !this.state.shouldSendGA
        this.setState({ shouldSendGA: value }, () => {
          global.shouldSendGA = value
          AsyncStorage.setItem('@Theme:shouldSendGA', value.toString())
        })
      }}>
        <View key={index} style={[styles.themeItem, {
            flex: -1,
            height: 80,
            flexDirection: 'row',
            padding: 10,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: modeInfo.brighterLevelOne
        }]}>
          <View style={{flex: 4, justifyContent: 'center', alignItems: 'flex-start'}}>
            <Text style={[styles.themeName, { marginTop: 12, flex: 1, color: modeInfo.titleTextColor }]}>
              {'启用数据统计'}
            </Text>
            <Text style={[styles.themeName, { marginTop: -12, fontSize: 13, flex: 1, color: modeInfo.standardTextColor }]}>
              {'仅统计页面名称, 不会统计任何用户数据'}
            </Text>
          </View>
          <Switch
            style={{
              flex: 1
            }}
            onValueChange={(value) => this.setState({ shouldSendGA: value }, () => {
              global.shouldSendGA = value
              AsyncStorage.setItem('@Theme:shouldSendGA', value.toString())
            })}
            value={this.state.shouldSendGA} />
        </View>
      </TouchableNativeFeedback>
    )
  }

  render() {
    const { modeInfo } = this.props.screenProps

    return (
      <View style={{ flex: 1, backgroundColor: modeInfo.backgroundColor }}
        onStartShouldSetResponder={() => false}
        onMoveShouldSetResponder={() => false}>
        <Ionicons.ToolbarAndroid
          navIconName='md-arrow-back'
          overflowIconName='md-more'
          iconColor={modeInfo.isNightMode ? '#000' : '#fff'}
          title={`高级`}
          titleColor={modeInfo.isNightMode ? '#000' : '#fff'}
          style={[styles.toolbar, { backgroundColor: modeInfo.standardColor }]}
          onIconClicked={() => {
            this.props.navigation.goBack()
          }}
        />
        <View style={{flex: 1}}>
          {this.loadImageWithoutWIFI()}
          {this.sendGA()}
        </View>
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
    fontSize: 16
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
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#F5FCFF'
  },
  toolbar: {
    backgroundColor: standardColor,
    height: 56,
    elevation: 4
  },
  selectedTitle: {
    // backgroundColor: '#00ffff'
    // fontSize: 20
  },
  avatar: {
    width: 50,
    height: 50
  },
  a: {
    fontWeight: '300',
    color: idColor // make links coloured pink
  }
})

export default Theme