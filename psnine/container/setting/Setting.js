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
  Easing
} from 'react-native';

import { pngPrefix, getDealURL, getHappyPlusOneURL, getStoreURL } from '../../dao';

import { safeLogin, registURL } from '../../dao/login';


import HTMLView from '../../components/HtmlToView';

import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { standardColor, nodeColor, idColor, accentColor } from '../../constants/colorConfig';

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

const items = [
  {
    iconName: 'md-color-palette',
    text: '主题',
    onPress: function() {
      this.props.navigation.navigate('Theme')
    }
  },
  {
    iconName: 'md-help-circle',
    text: '关于PSNINE',
    onPress: function() {
      this.props.navigation.navigate('PsnineAbout')
    }
  },
  {
    iconName: 'md-information-circle',
    text: '关于本应用',
    onPress: function() {
      this.props.navigation.navigate('About')
    }
  },
]

class Setting extends Component {

  constructor(props) {
    super(props);

    this.state = {
      checkUpdateTip: '点击检查更新',
      sourceCodeURL: 'https://github.com/smallpath/psnine',
      icon: false,
      switchMethod: true
    }
  }

  componentDidMount = () => {

  }

  componentWillMount = async () => {

  }

  renderRow = (item, index) => {
    const { modeInfo } = this.props.screenProps
    return (
      <TouchableNativeFeedback
        onPress={item.onPress.bind(this)}
        key={index}
      >
        <View pointerEvents={'box-only'} style={[styles.themeItem, {
          flex: -1,
          height: 80,
          flexDirection: 'row',
        }]}>
          <View style={{ width: 30, height: 30, flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Ionicons name={item.iconName} size={30} color={modeInfo.accentColor} />
          </View>
          <View style={{
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: modeInfo.standradTextColor,
            alignItems: 'flex-start',
            justifyContent: 'center',
            flex: 4,
            height: 80
          }}>
            <Text style={[styles.themeName, { alignContent:'stretch', textAlignVertical: 'center',flex: 1, color: modeInfo.titleTextColor }]}>
              {item.text}
            </Text>
          </View>
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
          navIconName="md-arrow-back"
          overflowIconName="md-more"
          iconColor={modeInfo.isNightMode ? '#000' : '#fff'}
          title={`设置`}
          titleColor={modeInfo.isNightMode ? '#000' : '#fff'}
          style={[styles.toolbar, { backgroundColor: modeInfo.standardColor }]}
          onIconClicked={() => {
            this.props.navigation.goBack()
          }}
        />
        <View style={{flex:1}}>
          {items.map((...args) => this.renderRow(...args))}
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


export default Setting