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
} from 'react-native';

import { connect } from 'react-redux';

import { standardColor, accentColor } from '../../config/colorConfig';

import { pngPrefix, getDealURL, getHappyPlusOneURL, getStoreURL } from '../../dao/dao';

import { safeLogin, registURL } from '../../dao/login';

import { fetchUser } from '../../dao/userParser';


let toolbarActions = [

];
let title = "登录";

class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      psnid: '',
      password: '',
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
      ToastAndroid.show(`登录失败`,2000);
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

  render() {
    // console.log('Loggin.js rendered');
    return (
      <View style={{ flex: 1, backgroundColor:this.props.modeInfo.brighterLevelOne }}>
        <ToolbarAndroid
          navIcon={require('image!ic_back_white') }
          title={title}
          style={[styles.toolbar, {backgroundColor: this.props.modeInfo.standardColor,}]}
          onIconClicked={this._pressButton}
          />
        <KeyboardAvoidingView behavior={'padding'} style={styles.KeyboardAvoidingView} >
          <View style={styles.accountView}>
            <Text style={styles.mainFont}>PSN ID :</Text>
            <TextInput placeholder="不是邮箱" underlineColorAndroid={accentColor}
              onChange={({nativeEvent})=>{ this.setState({psnid:nativeEvent.text})}}
              style={styles.textInput}
            />
          </View>

          <View style={styles.passwordView}>
            <Text style={styles.mainFont}>密码 :</Text>
            <TextInput placeholder="你在本站完成认证时的密码" underlineColorAndroid={accentColor} secureTextEntry={true}
              onChange={({nativeEvent})=>{ this.setState({password:nativeEvent.text})}}
              style={styles.textInput}
            />
            <Text>忘记密码</Text>
          </View>


        </KeyboardAvoidingView>

        <View style={styles.customView}>
          <View style={styles.submit}>
            <TouchableNativeFeedback
              onPress={this.login}
              >
              <View style={styles.submitButton}>
                <Text>提交</Text>
              </View>
            </TouchableNativeFeedback>
          </View>

          <View style={styles.regist}>
            <Text>如果是第一次使用PSNINE，请先完成</Text>
            <TouchableNativeFeedback
              onPress={this.regist}
            >
              <View>
              <Text style={styles.openURL}>PSNID认证</Text>
              </View>
            </TouchableNativeFeedback>
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
    marginTop: 20,
    width: width - 40,
    alignSelf:'center',
    justifyContent: 'center',
    flexDirection: 'column' 
  },
  accountView: { 
    flex: 1, 
    flexDirection: 'column',
    justifyContent: 'space-between',
    margin: 10,
  },
  passwordView: { 
    flex: 1, 
    flexDirection: 'column', 
    margin: 10,
    marginTop: 20,
    marginBottom: 20,
  },
  submit: { 
    flex: -1, 
    height: 20,
    margin: 10,
    marginTop: 30,
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