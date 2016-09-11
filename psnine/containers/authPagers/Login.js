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
  RefreshControl,
  WebView,
  KeyboardAvoidingView,
  TextInput,
  AsyncStorage,
  Linking,
  Animated,
} from 'react-native';

import { connect } from 'react-redux';

import { standardColor, accentColor } from '../../config/colorConfig';

import { pngPrefix, getDealURL, getHappyPlusOneURL, getStoreURL } from '../../dao/dao';

import { safeLogin, registURL } from '../../dao/login';

import { fetchUser } from '../../dao/userParser';


let screen = Dimensions.get('window');

const { width:SCREEN_WIDTH, height:SCREEN_HEIGHT } = screen;

let toolbarActions = [

];
let title = "登录";

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      psnid: '',
      password: '',
      accountMarginTop: new Animated.Value(0),
      passwordMarginTop: new Animated.Value(0),
    }
  }

  _pressButton = () => {
    this.props.navigator.pop();
  }

  login = async () => {
    const { psnid, password } = this.state;

    if (psnid=='' || password == ''){
      ToastAndroid.show('账号或密码未输入',2000);
      return;
    }

    let data= await safeLogin(psnid,password);
    let length = data._bodyInit.length;
    
    if (length > 10000){
      await AsyncStorage.setItem('@psnid', psnid);
      const user = await fetchUser(psnid);
      await AsyncStorage.setItem('@userInfo', JSON.stringify(user));
      
      ToastAndroid.show(`登录成功`,2000);
      this.props.setLogin(psnid,user);
      this.props.navigator.pop();
    }else{

      await AsyncStorage.removeItem('@psnid');
      const value = await AsyncStorage.getItem('@psnid');
      ToastAndroid.show(`登录失败,请检查账号与密码是否输入正确`,2000);
    }

  }

  regist = () => {
      Linking.canOpenURL(registURL)
              .then(supported => { 
                if (supported)
                  Linking.openURL(registURL);
                else
                  ToastAndroid.show(`未找到浏览器, 如果您使用了冰箱, 请先解冻浏览器`,2000); 
              }).catch(err => {});
  }

  onAccountTextFocus = () => {
    let text = this.accountTextInput._lastNativeText;
    if(typeof text !='undefined' && text!=='')
      return;
      
    Animated.spring(this.state.accountMarginTop,{
      toValue: 1,
      friction: 10
    }).start();
  }

  onAccountTextBlur = () => {
    let text = this.accountTextInput._lastNativeText;
    if(typeof text !='undefined' && text!=='')
      return;
    Animated.spring(this.state.accountMarginTop,{
      toValue: 0,
      friction: 10
    }).start();
  }

  onPasswordTextFocus = () => {
    let text = this.passwordTextInput._lastNativeText;
    if(typeof text !='undefined' && text!=='')
      return;
      
    Animated.spring(this.state.passwordMarginTop,{
      toValue: 1,
      friction: 10
    }).start();
  }

  onPasswordTextBlur = () => {
    let text = this.passwordTextInput._lastNativeText;
    if(typeof text !='undefined' && text!=='')
      return;
    Animated.spring(this.state.passwordMarginTop,{
      toValue: 0,
      friction: 10
    }).start();
  }

  render() {
    // console.log('Loggin.js rendered');
    let marginLeft = 40;

    let accountTextStyle = {
      top: this.state.accountMarginTop.interpolate({
          inputRange: [0 ,1], 
          outputRange: [40, 0]
      }),
      color: this.state.accountMarginTop.interpolate({
          inputRange: [0 ,1], 
          outputRange: [this.props.modeInfo.standardTextColor, this.props.modeInfo.deepColor]
      }),
    }

    let passwordTextStyle = {
      top: this.state.passwordMarginTop.interpolate({
          inputRange: [0 ,1], 
          outputRange: [40, 0]
      }),
      color: this.state.passwordMarginTop.interpolate({
          inputRange: [0 ,1], 
          outputRange: [this.props.modeInfo.standardTextColor, this.props.modeInfo.deepColor]
      }),
    }
    return (
      <View style={{ flex: 1 , backgroundColor: this.props.modeInfo.standardColor }}>

        <Animated.View 
          ref={float=>this.float=float}
          collapsable ={true}
          style={{
            width: 56,
            height: 56,
            borderRadius: 30,
            backgroundColor: accentColor,
            position:'absolute',
            top: SCREEN_HEIGHT/10*4 -56/2 ,
            right: 16,
            elevation: 6 ,
            zIndex: 1,
        }}>
        
        <TouchableNativeFeedback 
          onPress={this.regist}
          delayPressIn={0}
          //activeOpacity={1}
          //underlayColor={accentColor}
          background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
          // onPressIn={()=>{
          //   this.float.setNativeProps({
          //     style :{
          //     elevation: 6,
          //   }});
          // }}
          // onPressOut={()=>{
          //   this.float.setNativeProps({
          //     style :{
          //     elevation: 12,
          //   }});
          // }}
          style={{
            width: 56,
            height: 56,
            borderRadius: 30,
            flex:1,
            zIndex: 1,
            backgroundColor: accentColor,
          }}>
          <View style={{borderRadius: 30,}}>
            <Image source={require('image!ic_add_white')}
                  style={{
                    left:0,
                    top:0,
                }}
            />
          </View>
        </TouchableNativeFeedback>
        </Animated.View>

        <View style={{ backgroundColor:this.props.modeInfo.brighterLevelOne,              
              position: 'absolute',
              width: SCREEN_WIDTH-marginLeft*2,
              height: SCREEN_HEIGHT/10*6,
              marginLeft: marginLeft,
              bottom: marginLeft,
              borderRadius: 5,

             
           }}>

          <View style={[styles.loginTextView,{marginLeft: marginLeft/2*1.5, marginTop:40 }]}>
            <Text style={[styles.mainFont,{fontSize:30, marginLeft:0, marginBottom:0}]}>登录</Text>
          </View>

          <KeyboardAvoidingView behavior={'padding'} style={[styles.KeyboardAvoidingView, {
              width: SCREEN_WIDTH-marginLeft*3,
            }]} >
            <View style={[styles.accountView,{ marginTop: 5,}]}>
              <Animated.Text
                  style={[{color: this.props.modeInfo.standardTextColor, marginLeft:5},
                    accountTextStyle
                  ]}>
                  {'PSN ID'}
              </Animated.Text>
              <TextInput underlineColorAndroid={accentColor}
                onChange={({nativeEvent})=>{ this.setState({psnid:nativeEvent.text})}}
                ref={ref=>this.accountTextInput = ref}
                onFocus={this.onAccountTextFocus}
                onBlur={this.onAccountTextBlur}
                style={[styles.textInput, { color:this.props.modeInfo.standardTextColor }]}
                placeholderTextColor={this.props.modeInfo.standardTextColor}
              />
            </View>

            <View style={[styles.passwordView,{marginTop:5}]}>
              <Animated.Text
                  style={[{color: this.props.modeInfo.standardTextColor, marginLeft:5},
                    passwordTextStyle
                  ]}>
                  {'密码'}
              </Animated.Text>
              <TextInput underlineColorAndroid={accentColor} secureTextEntry={true}
                onChange={({nativeEvent})=>{ this.setState({password:nativeEvent.text})}}
                ref={ref=>this.passwordTextInput = ref}
                onFocus={this.onPasswordTextFocus}
                onBlur={this.onPasswordTextBlur}
                style={[styles.textInput, { color:this.props.modeInfo.standardTextColor }]}
                placeholderTextColor={this.props.modeInfo.standardTextColor}
              />
              <Text style={[styles.openURL,{marginTop: 10, color: this.props.modeInfo.standardColor }]}>忘记密码</Text>
            </View>


          </KeyboardAvoidingView>

          <View style={[styles.customView,{
            width: SCREEN_WIDTH-marginLeft*3
          }]}>
            <View style={styles.submit}>
              <TouchableNativeFeedback
                onPress={this.login}
                >
                <View style={styles.submitButton}>
                  <Text style={[styles.textInput, { color:this.props.modeInfo.brighterLevelOne }]}>提交</Text>
                </View>
              </TouchableNativeFeedback>
            </View>

            {/*<View style={styles.regist}>
              <Text style={[styles.textInput, { color:this.props.modeInfo.standardTextColor }]}>如果是第一次使用PSNINE，请先完成</Text>
              <TouchableNativeFeedback
                onPress={this.regist}
              >
                <View>
                <Text style={styles.openURL}>PSNID认证</Text>
                </View>
              </TouchableNativeFeedback>
            </View>*/}
          </View>

        </View>

      </View>
    );
  }
}


const width = Dimensions.get('window').width;

const styles = StyleSheet.create({
  toolbar: {
    backgroundColor: standardColor,
    height: 56,
    elevation: 4,
  },
  mainFont: {
    fontSize: 15, 
    color:accentColor
  },
  textInput: {
    fontSize: 15,
  },
  customView: {
    flex: -1, 
    marginTop: -20,
    width: width - 40,
    alignSelf:'center',
    justifyContent: 'center',
    flexDirection: 'column' 
  },
  KeyboardAvoidingView: { 
    flex: -1, 
    marginTop: 0,
    width: width - 40,
    alignSelf:'center',
    justifyContent: 'space-between',
    flexDirection: 'column' 
  },
  loginTextView: { 

    flexDirection: 'column',
    justifyContent: 'space-between',

    margin: 10,
    marginTop:20,
    marginBottom:0,
  },
  accountView: { 

    flexDirection: 'column',
    justifyContent: 'space-between',

    marginLeft: 10,
    marginRight: 10,
    marginTop:20,
  },
  passwordView: { 

    flexDirection: 'column', 
    marginLeft: 10,
    marginRight: 10,
    marginTop: 20,
    marginBottom: 20,
  },
  submit: { 
    flex: -1, 
    height: 30,
    margin: 10,
    marginTop: 40,
    marginBottom: 20,
  },
  submitButton:{
    backgroundColor: accentColor,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
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


export default Login