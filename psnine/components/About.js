import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  Image,
  DrawerLayoutAndroid,
  ToolbarAndroid,
  ToastAndroid,
  BackAndroid,
  TouchableOpacity,
  Dimensions,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  RefreshControl,
  WebView,
  KeyboardAvoidingView,
  TextInput,
  AsyncStorage,
  Linking,
  Animated,
  Easing,
  PanResponder,
  StatusBar,
  Picker,
} from 'react-native';

import { connect } from 'react-redux';

import { standardColor, accentColor } from '../config/colorConfig';

import { pngPrefix, getDealURL, getHappyPlusOneURL, getStoreURL } from '../dao/dao';

import { safeLogin, registURL } from '../dao/login';

class About extends Component {

  constructor(props) {
    super(props);

    this.state = {
      checkUpdateTip: '点击检查更新',
      sourceCodeURL: 'https://github.com/Smallpath/Psnine',
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
    try{
        if (supported)
            Linking.openURL(this.state.sourceCodeURL);
        else
            global.toast && global.toast(`未找到浏览器, 如果您使用了冰箱, 请先解冻浏览器`,2000); 
    }catch(err){}
  }

  render() {

    return (
      <View style={{flex:1, backgroundColor: this.props.modeInfo.backgroundColor}}>

        <View style={{flex:1, backgroundColor: this.props.modeInfo.standardColor,
            justifyContent: 'center',
            alignItems:'center',
            elevation: 2,
        }}>
            <View style={{  }} >
                <Text style={{
                    textAlign: 'center',
                    fontSize: 40,
                    color: this.props.modeInfo.backgroundColor,
                }}>{'Psnine'}</Text>
                <Text style={{
                    textAlign: 'center',
                    color: this.props.modeInfo.backgroundColor,
                }}>{'version: 0.1'}</Text>
            </View>
        </View>

        <View style={{flex:1}}>
            <TouchableNativeFeedback
                onPress={this.checkUpdate}
            >
                <View style={[styles.themeItem,{
                    padding: 6,
                    flexDirection:'column',
                    alignItems: 'flex-start',
                }]}>
                    <Text style={[styles.themeName,{marginTop: 12, flex:1, color: this.props.modeInfo.titleTextColor}]}>
                        {'检查更新'}
                    </Text>
                    <Text style={[styles.themeName,{marginTop: -12,fontSize:13 , flex:1,color: this.props.modeInfo.standardTextColor}]}>
                        {this.state.checkUpdateTip}
                    </Text>
                </View>
            </TouchableNativeFeedback>
            <TouchableNativeFeedback
                onPress={this.goSourceCode}
            >
                <View style={[styles.themeItem,{
                    padding: 6,
                    flexDirection:'column',
                    alignItems: 'flex-start',
                }]}>
                    <Text style={[styles.themeName,{marginTop: 12, flex:1, color: this.props.modeInfo.titleTextColor}]}>
                        {'源代码'}
                    </Text>
                    <Text style={[styles.themeName,{marginTop: -12,fontSize:13 , flex:1,color: this.props.modeInfo.standardTextColor}]}>
                        {this.state.sourceCodeURL}
                    </Text>
                </View>
            </TouchableNativeFeedback>
            <View style={{flex:2}}/>
        </View>

      </View>
    );
  }
}


const width = Dimensions.get('window').width;

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
    flexDirection: 'row' , 
    marginTop: 20,
    margin: 10,
  },
  openURL: {
    color:accentColor, 
    textDecorationLine:'underline',
  },
});


export default About