import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableNativeFeedback,
  Linking,
  Switch,
  AsyncStorage,
  StatusBar,
  Dimensions,
  Easing,
  Picker,
  Alert 
} from 'react-native';

import { pngPrefix, getDealURL, getHappyPlusOneURL, getStoreURL } from '../../dao';

import { safeLogin, registURL } from '../../dao/login';


import HTMLView from '../../components/HtmlToView';

import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ColorConfig, { standardColor, nodeColor, idColor, accentColor } from '../../constants/colorConfig';

let screen = Dimensions.get('window');
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = screen;

let toolbarActions = [];
let title = "TOPIC";
let WEBVIEW_REF = `WEBVIEW_REF`;

let toolbarHeight = 56;
let releasedMarginTop = 0;

const ACTUAL_SCREEN_HEIGHT = SCREEN_HEIGHT - StatusBar.currentHeight + 1;

let CIRCLE_SIZE = 56;
let config = { tension: 30, friction: 7, ease: Easing.in(Easing.ease(1, 0, 1, 1)), duration: 200 };

const mapper = {
  'red': '红色',
  'pink': '粉色',
  'purple': '紫色',
  'deepPurple': '深紫色',
  'indigo': '靛蓝色',
  'blue': '蓝色',
  'lightBlue': '浅蓝色',
  'cyan': '青色',
  'teal': '深绿色',
  'green': '绿色',
  'lightGreen': '浅绿色',
  'lime': '柠檬黄',
  'yellow': '黄色',
  'amber': '琥珀色',
  'orange': '橘黄色',
  'deepOrange': '深橘色',
  'brown': '棕色',
  'grey': '灰色',
  'blueGrey': '蓝灰色'
}

class Theme extends Component {

  constructor(props) {
    super(props);

    this.state = {
      tabMode: this.props.screenProps.modeInfo.settingInfo.tabMode,
      colorTheme: this.props.screenProps.modeInfo.colorTheme,
      secondaryColor: this.props.screenProps.modeInfo.secondaryColor,
    }
  }

  renderSwitchType = (item, index) => {
    const { modeInfo } = this.props.screenProps
    return (
      <View key={index} style={[styles.themeItem, {
          flex: -1,
          height: 80,
          flexDirection: 'row',
          padding: 10,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: modeInfo.brighterLevelOne,
      }]}>
        <View style={{flex: 4, justifyContent: 'center', alignItems: 'flex-start'}}>
          <Text style={[styles.themeName, { marginTop: 12, flex: 1, color: modeInfo.titleTextColor }]}>
            {'首页模式'}
          </Text>
          <Text style={[styles.themeName, { marginTop: -12, fontSize: 13, flex: 1, color: modeInfo.standardTextColor }]}>
            {'可选标签模式或右侧抽屉模式'}
          </Text>
        </View>
        <Picker style={{
          flex: 3,
          color: modeInfo.standardTextColor
        }}
          prompt='首页模式'
          selectedValue={this.state.tabMode}
          onValueChange={this.onValueChange.bind(this, 'tabMode')}>
          <Picker.Item label="右侧抽屉" value="drawer" />
          <Picker.Item label="标签" value="tab" />
        </Picker>
      </View>
    )
  }

  renderSwitchThemeColor = (item, index) => {
    const { modeInfo } = this.props.screenProps
    // const mapper = modeInfo.themeName
    return (
      <View key={index} style={[styles.themeItem, {
          flex: -1,
          height: 80,
          flexDirection: 'row',
          padding: 10,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: modeInfo.brighterLevelOne,
      }]}>
        <View style={{flex: 4, justifyContent: 'center', alignItems: 'flex-start'}}>
          <Text style={[styles.themeName, { marginTop: 12, flex: 1, color: modeInfo.titleTextColor }]}>
            {'主题的默认颜色'}
          </Text>
          <Text style={[styles.themeName, { marginTop: -12, fontSize: 13, flex: 1, color: modeInfo.standardTextColor }]}>
            {`当前颜色: `}<Text style={{color: modeInfo.standardColor}}>{mapper[this.state.colorTheme]}</Text>
          </Text>
        </View>
        <Picker style={{
          flex: 3,
          color: modeInfo.standardTextColor
        }}
          prompt='选择主题的默认颜色'
          selectedValue={this.state.colorTheme}
          onValueChange={this.onValueChange.bind(this, 'colorTheme')}>
          {Object.keys(mapper).map((name, index) => {
            return <Picker.Item key={index} color={ColorConfig[name].standardColor} label={mapper[name]} value={name} />
          })}
        </Picker>
      </View>
    )
  }

  renderSwitchSecondaryColor = (item, index) => {
    const { modeInfo } = this.props.screenProps
    // const mapper = modeInfo.themeName
    return (
      <View key={index} style={[styles.themeItem, {
          flex: -1,
          height: 80,
          flexDirection: 'row',
          padding: 10,
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: modeInfo.brighterLevelOne,
      }]}>
        <View style={{flex: 4, justifyContent: 'center', alignItems: 'flex-start'}}>
          <Text style={[styles.themeName, { marginTop: 12, flex: 1, color: modeInfo.titleTextColor }]}>
            {'主题的强调颜色'}
          </Text>
          <Text style={[styles.themeName, { marginTop: -12, fontSize: 13, flex: 1, color: modeInfo.standardTextColor }]}>
            {`当前颜色: `}<Text style={{color: modeInfo.accentColor}}>{mapper[this.state.secondaryColor]}</Text>
          </Text>
        </View>
        <Picker style={{
          flex: 3,
          color: modeInfo.standardTextColor
        }}
          prompt='选择主题的强调颜色'
          selectedValue={this.state.secondaryColor}
          onValueChange={this.onValueChange.bind(this, 'secondaryColor')}>
          {Object.keys(mapper).map((name, index) => {
            return <Picker.Item key={index} color={ColorConfig[name].standardColor} label={mapper[name]} value={name} />
          })}
        </Picker>
      </View>
    )
  }

  onValueChange = (key, value) => {
    const { modeInfo } = this.props.screenProps
    const newState = {};
    newState[key] = value;
    this.setState(newState, () => {
      if (key === 'tabMode') {
        AsyncStorage.setItem('@Theme:tabMode', value).catch(err => toast(err.toString())).then(() => {
          return modeInfo.reloadSetting && modeInfo.reloadSetting()
        })
      } else {
        return modeInfo.switchModeOnRoot && modeInfo.switchModeOnRoot({
          [key]: value
        })
      }
    });
  };

  render() {
    const { modeInfo } = this.props.screenProps

    return (
      <View style={{ flex: 1, backgroundColor: modeInfo.backgroundColor }}
        onStartShouldSetResponder={() => false}
        onMoveShouldSetResponder={() => false}>
        <Ionicons.ToolbarAndroid
          navIconName="md-arrow-back"
          overflowIconName="md-more"
          iconColor={modeInfo.isNightMode ? '#000' : '#fff'}
          title={`主题`}
          titleColor={modeInfo.isNightMode ? '#000' : '#fff'}
          style={[styles.toolbar, { backgroundColor: modeInfo.standardColor }]}
          onIconClicked={() => {
            this.props.navigation.goBack()
          }}
        />
        <View style={{flex:1}}>
          {this.renderSwitchThemeColor()}
          {this.renderSwitchSecondaryColor()}
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
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#F5FCFF',
  },
  toolbar: {
    backgroundColor: standardColor,
    height: 56,
    elevation: 4,
  },
  selectedTitle: {
    //backgroundColor: '#00ffff'
    //fontSize: 20
  },
  avatar: {
    width: 50,
    height: 50,
  },
  a: {
    fontWeight: '300',
    color: idColor, // make links coloured pink
  },
});


export default Theme