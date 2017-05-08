import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableNativeFeedback,
  Linking
} from 'react-native';

import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { standardColor, accentColor } from '../constants/colorConfig';

import { pngPrefix, getDealURL, getHappyPlusOneURL, getStoreURL } from '../dao/dao';

import { safeLogin, registURL } from '../dao/login';

class About extends Component {

  constructor(props) {
    super(props);

    this.state = {
      checkUpdateTip: '点击检查更新',
      sourceCodeURL: 'https://github.com/smallpath/psnine',
      icon: false
    }
  }

  componentDidMount = () => {

  }

  _pressButton = () => {


  }

  componentWillUnmount = async () => {

  }

  checkUpdate = () => {
    this.setState({
      checkUpdateTip: '正在检查更新',
    })
    setTimeout(() => {
      this.setState({
        checkUpdateTip: '当前已是最新版本',
      })
    }, 1000);
  }

  goSourceCode = async () => {
    let supported = await Linking.canOpenURL(this.state.sourceCodeURL);
    try {
      if (supported)
        Linking.openURL(this.state.sourceCodeURL);
      else
        global.toast && global.toast(`未找到浏览器, 如果您使用了冰箱, 请先解冻浏览器`, 2000);
    } catch (err) { }
  }

  render() {
    const { modeInfo } = this.props.screenProps
    return (
      <View style={{ flex: 1, backgroundColor: modeInfo.backgroundColor }}>

        <View style={{
          flex: 1, backgroundColor: modeInfo.standardColor,
          justifyContent: 'center',
          alignItems: 'center',
          elevation: 2,
        }}>
          <View style={{}} >
            <Text style={{
              textAlign: 'center',
              fontSize: 40,
              color: modeInfo.backgroundColor,
            }}>{'Psnine'}</Text>
            <Text style={{
              textAlign: 'center',
              color: modeInfo.backgroundColor,
            }}>{'version: 0.1'}</Text>
          </View>
        </View>

        <View style={{ flex: 1 }}>
          <TouchableNativeFeedback
            onPress={this.checkUpdate}
          >
            <View style={[styles.themeItem, {
              padding: 6,
              flexDirection: 'column',
              alignItems: 'flex-start',
            }]}>
              <Text style={[styles.themeName, { marginTop: 12, flex: 1, color: modeInfo.titleTextColor }]}>
                {'检查更新'}
              </Text>
              <Text style={[styles.themeName, { marginTop: -12, fontSize: 13, flex: 1, color: modeInfo.standardTextColor }]}>
                {this.state.checkUpdateTip}
              </Text>
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback
            onPress={this.goSourceCode}
          >
            <View style={[styles.themeItem, {
              padding: 6,
              flexDirection: 'column',
              alignItems: 'flex-start',
            }]}>
              <Text style={[styles.themeName, { marginTop: 12, flex: 1, color: modeInfo.titleTextColor }]}>
                {'源代码'}
              </Text>
              <Text style={[styles.themeName, { marginTop: -12, fontSize: 13, flex: 1, color: modeInfo.standardTextColor }]}>
                {this.state.sourceCodeURL}
              </Text>
            </View>
          </TouchableNativeFeedback>
          <View style={{ flex: 2 }} />
        </View>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  themeItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
  },
  themeName: {
    flex: 1,
    fontSize: 16,
    marginLeft: 16,
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


export default About