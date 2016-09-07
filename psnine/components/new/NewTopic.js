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
  Easing,
  PanResponder,
  StatusBar,
} from 'react-native';

import { connect } from 'react-redux';

import { standardColor, accentColor } from '../../config/config';

import { pngPrefix, getDealURL, getHappyPlusOneURL, getStoreURL } from '../../dao/dao';

import { safeLogin, registURL } from '../../dao/login';

import { fetchUser } from '../../dao/userParser';


let toolbarActions = [

];
let title = "创建讨论";

let screen = Dimensions.get('window');

const { width:SCREEN_WIDTH, height:SCREEN_HEIGHT } = screen;

SCREEN_HEIGHT = SCREEN_HEIGHT - StatusBar.currentHeight;

let CIRCLE_SIZE = 56;

class NewTopic extends Component {

  constructor(props) {
    super(props);

    this.state = {
      psnid: '',
      password: '',


    }
  }

  _pressButton = () => {
    let config = {tension: 30, friction: 7};

    Animated.spring(this.props.openVal, {toValue: 0, ...config}).start(()=>{
        BackAndroid.clearAllListeners &&this.props.addDefaultBackAndroidListener();
    });
    
  }

  componentDidMount = () =>{
      
  }

  render() {
    let { openVal, marginTop } = this.props;

    let outerStyle = {
        marginTop: marginTop.interpolate({inputRange: [-56, 0], outputRange: [56 , 0 ]}),
    }

    let animatedStyle = {                                 // (step4: uncomment)
        left: openVal.interpolate({inputRange: [0, 1], outputRange: [SCREEN_WIDTH - 56-16 , 0]}),
        top: openVal.interpolate({inputRange: [0, 1], outputRange: [SCREEN_HEIGHT - 16-56 , 0]}),
        width: openVal.interpolate({inputRange: [0, 1], outputRange: [CIRCLE_SIZE, SCREEN_WIDTH]}),
        height: openVal.interpolate({inputRange: [0, 1], outputRange: [CIRCLE_SIZE, SCREEN_HEIGHT]}),
        borderWidth: openVal.interpolate({inputRange: [0, 0.5 ,1], outputRange: [2, 2, 0]}),
        borderRadius: openVal.interpolate({inputRange: [-0.15, 0, 0.5, 1], outputRange: [0, CIRCLE_SIZE / 2, CIRCLE_SIZE * 1.3, 0]}),
        opacity : openVal.interpolate({inputRange: [0, 0.1 ,1], outputRange: [0, 1, 1]}),
        zIndex : openVal.interpolate({inputRange: [0 ,1], outputRange: [0, 3]})
    };

    return (
      <Animated.View 
        style={[
            styles.circle, styles.open, animatedStyle, outerStyle
        ]}>
        <ToolbarAndroid
          navIcon={require('image!ic_back_white') }
          title={title}
          style={styles.toolbar}
          onIconClicked={this._pressButton}
          />
        <KeyboardAvoidingView behavior={'padding'} style={styles.KeyboardAvoidingView} >
          <View style={styles.accountView}>
            <TextInput placeholder="标题" underlineColorAndroid={accentColor}
              onChange={({nativeEvent})=>{ this.setState({psnid:nativeEvent.text})}}
              style={styles.textInput}
            />
          </View>

          <View style={styles.accountView}>
            <Text style={styles.mainFont}>权限 :</Text>
            <TextInput placeholder="不是邮箱" underlineColorAndroid={accentColor}
              onChange={({nativeEvent})=>{ this.setState({psnid:nativeEvent.text})}}
              style={styles.textInput}
            />
          </View>

          <View style={styles.passwordView}>
            <Text style={styles.mainFont}>内容 :</Text>
            <TextInput placeholder="内容" underlineColorAndroid={accentColor} secureTextEntry={false}
              onChange={({nativeEvent})=>{ this.setState({password:nativeEvent.text})}}
              style={styles.textInput}
            />
          </View>


        </KeyboardAvoidingView>

        <View style={styles.customView}>
          <View style={styles.submit}>
            <TouchableNativeFeedback
              //onPress={this.login}
              >
              <View style={styles.submitButton}>
                <Text>提交</Text>
              </View>
            </TouchableNativeFeedback>
          </View>

          <View style={styles.regist}>
            <Text>如果是第一次使用PSNINE，请先完成</Text>
            <TouchableNativeFeedback
              //onPress={this.regist}
            >
              <View>
              <Text style={styles.openURL}>PSNID认证</Text>
              </View>
            </TouchableNativeFeedback>
          </View>
        </View>

      </Animated.View>
    );
  }
}


const width = Dimensions.get('window').width;

const styles = StyleSheet.create({
  circle: {
    //flex: 1, 
    position: 'absolute',
    backgroundColor:'white',
    width: CIRCLE_SIZE,
    height: CIRCLE_SIZE,
    borderRadius: CIRCLE_SIZE / 2,
    borderWidth: 2,
    borderColor: standardColor,
    overflow: 'hidden',
    elevation: 12,
  },
  open: {
    position: 'absolute',
    left: 0,
    top: 0,
    right: 0,
    bottom: 0,
    width: undefined, // unset value from styles.circle
    height: undefined, // unset value from styles.circle
    borderRadius: CIRCLE_SIZE / 2, // unset value from styles.circle
  },
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


export default NewTopic