import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableNativeFeedback,
  Linking,
  Alert,
  ListView
} from 'react-native'

import { connect } from 'react-redux'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { standardColor, accentColor } from '../../constant/colorConfig'

import { pngPrefix, getDealURL, getHappyPlusOneURL, getStoreURL } from '../../dao'

import { safeLogin, registURL } from '../../dao/login'

import packages from '../../../package.json'

import checkVersion from '../../bootstrap/checkVersion'

let dataSource = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2
})

class About extends Component {

  constructor(props) {
    super(props)

    this.state = {
      checkUpdateTip: '点击检查更新',
      sourceCodeURL: 'https://github.com/smallpath/psnine',
      checkVersionURL: 'https://api.github.com/repos/smallpath/psnine/git/refs/tags',
      tagURL: 'https://github.com/smallpath/psnine/releases/tag',
      version: packages.version,
      backup: 'https://fir.im/mf24',
      help: 'https://smallpath.me/psnine-help',
      icon: false
    }
  }

  _pressButton = () => {

  }

  checkUpdate = () => {
    this.setState({
      checkUpdateTip: '正在检查更新'
    })
    checkVersion().then((version) => {
      this.setState({
        checkUpdateTip: version ? `最新版本为v${version}` : '当前已是最新版本'
      })
    }).catch(err => {
      this.setState({
        checkUpdateTip: err.toString()
      })
    })
  }

  goSourceCode = async () => {
    let supported = await Linking.canOpenURL(this.state.sourceCodeURL)
    try {
      if (supported)
        await Linking.openURL(this.state.sourceCodeURL)
      else
        global.toast && global.toast(`未找到浏览器, 如果您使用了冰箱, 请先解冻浏览器`, 2000)
    } catch (err) { }
  }

  goToBackup = async () => {
    let supported = await Linking.canOpenURL(this.state.backup)
    try {
      if (supported)
        await Linking.openURL(this.state.backup)
      else
        global.toast && global.toast(`未找到浏览器, 如果您使用了冰箱, 请先解冻浏览器`, 2000)
    } catch (err) { }
  }
  goToRelease = async () => {
    let supported = await Linking.canOpenURL(this.state.sourceCodeURL + '/releases')
    try {
      if (supported)
        await Linking.openURL(this.state.sourceCodeURL + '/releases')
      else
        global.toast && global.toast(`未找到浏览器, 如果您使用了冰箱, 请先解冻浏览器`, 2000)
    } catch (err) { }
  }
  goToHelp = async () => {
    let supported = await Linking.canOpenURL(this.state.help)
    try {
      if (supported)
        await Linking.openURL(this.state.help)
      else
        global.toast && global.toast(`未找到浏览器, 如果您使用了冰箱, 请先解冻浏览器`, 2000)
    } catch (err) { }
  }

  linkAuthor = async () => {
    Alert.alert(
      `联系作者`,
      `反馈问题或需要新功能请通过Github或邮箱联系`,
      [
        {text: '站内', onPress: () => Linking.openURL(`p9://psnine.com/psnid/secondlife_xhm`).catch(err => global.toast && global.toast(err.toString()))},
        {text: '邮箱', style: 'cancel', onPress: () => Linking.openURL(`mailto:smallpath2013@gmail.com`).catch(err => global.toast && global.toast(err.toString()))},
        {text: 'Github', onPress: () => Linking.openURL(`https://github.com/smallpath/psnine`).catch(err => global.toast && global.toast(err.toString()))}
      ]
    )
  }

  renderRow = (rowData, sectionID, rowID, highlightRow) => {
    const { modeInfo } = this.props.screenProps
    return (
      <TouchableNativeFeedback
        onPress={rowData.onPress}
      >
        <View pointerEvents={'box-only'} style={[styles.themeItem, {
          padding: 6,
          height: 80,
          flexDirection: 'column',
          alignItems: 'flex-start'
        }]}>
          <Text style={[styles.themeName, { marginTop: 12, flex: 1, color: modeInfo.titleTextColor }]}>
            {rowData.title}
          </Text>
          {rowData.desc && (<Text style={[styles.themeName, { marginTop: -12, fontSize: 13, flex: 1, color: modeInfo.standardTextColor }]}>
            {rowData.desc}
          </Text>) || undefined}
        </View>
      </TouchableNativeFeedback>
    )
  }

  render() {
    const { modeInfo } = this.props.screenProps

    const items = [
      {
        title: '作者',
        desc: 'Smallpath <smallpath2013@gmail.com>',
        onPress: this.linkAuthor
      },
      {
        title: '源码',
        desc: this.state.sourceCodeURL,
        onPress: this.goSourceCode
      },
      {
        title: '版本号',
        desc: this.state.version
      },
      {
        title: '检查更新',
        desc: this.state.checkUpdateTip,
        onPress: this.checkUpdate
      },
      {
        title: '更新日志',
        desc: this.state.sourceCodeURL + '/releases',
        onPress: this.goToRelease
      },
      {
        title: '备用下载地址',
        desc: this.state.backup,
        onPress: this.goToBackup
      },
      {
        title: '使用帮助',
        desc: this.state.help,
        onPress: this.goToHelp
      }
    ]
    return (
      <View style={{ flex: 1, backgroundColor: modeInfo.backgroundColor }}>
        <Ionicons.ToolbarAndroid
          navIconName='md-arrow-back'
          overflowIconName='md-more'
          iconColor={modeInfo.isNightMode ? '#000' : '#fff'}
          title={`关于`}
          titleColor={modeInfo.isNightMode ? '#000' : '#fff'}
          style={[styles.toolbar, { backgroundColor: modeInfo.standardColor }]}
          onIconClicked={() => {
            this.props.navigation.goBack()
          }}
        />
        <ListView
          ref='themeslistview'
          dataSource={dataSource.cloneWithRows(items)}
          renderRow={this.renderRow}
          key={modeInfo.isNightMode ? 'night' : 'day'}
          keyboardDismissMode='on-drag'
          keyboardShouldPersistTaps='always'
          enableEmptySections={true}
          style={{ flex: 2, backgroundColor: modeInfo.backgroundColor }}
        />
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