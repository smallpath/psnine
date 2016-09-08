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
} from 'react-native';

import { connect } from 'react-redux';

import { standardColor, accentColor } from '../../config/colorConfig';

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
    let { openVal, innerMarginTop } = this.props;
    let config = {tension: 30, friction: 7};

      BackAndroid.clearAllListeners && BackAndroid.clearAllListeners();
      BackAndroid.clearAllListeners && this.props.addDefaultBackAndroidListener();

    Animated.parallel([openVal,innerMarginTop].map((property,index) => {
      if(index == 0){
        return Animated.spring(property, {toValue: 0, ...config});
      }else if(index == 1){
        return Animated.spring(property, {toValue: 0, ...config});
      }
    })).start();
  }


  componentWillMount() {
        this.panResponder = PanResponder.create({  

            onStartShouldSetPanResponderCapture: (e, gesture) =>{ 
              return false; 
            },

            onMoveShouldSetPanResponderCapture:(e, gesture) =>{ 
              let shouldSet = Math.abs(gesture.dy) >=4;
              return shouldSet; 
            },

            onPanResponderGrant:(e, gesture) => {
                this.props.innerMarginTop.setOffset(gesture.y0);
                this.props.innerMarginTop.setValue(this.props.innerMarginTop._startingValue);
            },
            onPanResponderMove: Animated.event([
              null,
              { 
                  dy: this.props.innerMarginTop
              }
            ]), 
            
            onPanResponderRelease: (e, gesture) => {

            },
            onPanResponderTerminationRequest : (evt, gesture) => {  
              return true;
            },
            onPanResponderTerminate: (evt, gesture) => {  
              
            },
            onShouldBlockNativeResponder: (evt, gesture) => {  
              return true;
            },
            onPanResponderReject: (evt, gesture) => {  
              return false;
            },
            onPanResponderEnd: (evt, gesture) => {  

              let dy = gesture.dy;
              let vy = gesture.vy;
              
              this.props.innerMarginTop.flattenOffset();

              let duration = 50; 

              if(vy<0){

                if(Math.abs(dy) <= CIRCLE_SIZE ){

                  Animated.spring(this.props.innerMarginTop,{
                    toValue: SCREEN_HEIGHT- CIRCLE_SIZE,
                    duration,
                    easing: Easing.linear,
                  }).start();

                }else{

                  Animated.spring(this.props.innerMarginTop,{
                    toValue: 0,
                    duration,
                    easing: Easing.linear,
                  }).start();

                }

              }else{

                if(Math.abs(dy) <= CIRCLE_SIZE){

                  Animated.spring(this.props.innerMarginTop,{
                    toValue: 0,
                    duration,
                    easing: Easing.linear,
                  }).start();

                }else{

                  Animated.spring(this.props.innerMarginTop,{
                    toValue: SCREEN_HEIGHT- CIRCLE_SIZE,
                    duration,
                    easing: Easing.linear,
                  }).start();
                }

              }

            },

        });
  }

  render() {
    let { openVal, marginTop } = this.props;

    this._reverseAnimatedValue = marginTop.interpolate({
        inputRange: [-56, 0],
        outputRange: [56, 0],
        extrapolate: 'clamp'
    });

    let outerStyle = {
        marginTop: Animated.add(this.props.innerMarginTop,this._reverseAnimatedValue).interpolate({
          inputRange: [0, SCREEN_HEIGHT], 
          outputRange: [0 ,SCREEN_HEIGHT]
        }),
    }


    let animatedStyle = {                              
        left: openVal.interpolate({inputRange: [0, 1], outputRange: [SCREEN_WIDTH - 56-16 , 0]}),
        top: openVal.interpolate({inputRange: [0, 1], outputRange: [SCREEN_HEIGHT - 16-56 , 0]}),
        width: openVal.interpolate({inputRange: [0, 1], outputRange: [CIRCLE_SIZE, SCREEN_WIDTH]}),
        height: openVal.interpolate({inputRange: [0, 1], outputRange: [CIRCLE_SIZE, SCREEN_HEIGHT+100]}),
        borderWidth: openVal.interpolate({inputRange: [0, 0.5 ,1], outputRange: [2, 2, 0]}),
        borderRadius: openVal.interpolate({inputRange: [-0.15, 0, 0.5, 1], outputRange: [0, CIRCLE_SIZE / 2, CIRCLE_SIZE * 1.3, 0]}),
        opacity : openVal.interpolate({inputRange: [0, 0.1 ,1], outputRange: [0, 1, 1]}),
        zIndex : openVal.interpolate({inputRange: [0 ,1], outputRange: [0, 3]}),
        backgroundColor: openVal.interpolate({
          inputRange: [0 ,1], 
          outputRange: [accentColor, this.props.modeInfo.brighterLevelOne]
        }),
        //elevation : openVal.interpolate({inputRange: [0 ,1], outputRange: [0, 8]})
    };

    let animatedSubmitStyle = {
      height: openVal.interpolate({inputRange: [0, 0.9 ,1], outputRange: [0, 0, 40]}),
    }

    let animatedToolbarStyle = {
      height: openVal.interpolate({inputRange: [0, 0.9 ,1], outputRange: [0, 0, 56]}),
      backgroundColor: this.props.modeInfo.standardColor,
    }

    return (
      <Animated.View 
        style={[
          styles.circle, styles.open, animatedStyle, outerStyle
        ]}
        
        >
        <Animated.View {...this.panResponder.panHandlers} style={[styles.toolbar ,animatedToolbarStyle]}>
          <View style={{    
              flex: 1, 
              flexDirection: 'row' , 
              alignItems: 'center',
            }}>
            <TouchableNativeFeedback
              onPress={this._pressButton}
              delayPressIn={0}
              background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
              style={{ borderRadius: 25}}
              >
              <View style={{ width: 50, height:50, marginLeft:0, borderRadius: 25}}>
                <Image 
                  source={require('image!ic_back_white_smaller')}
                  style={{ width: 50, height:50, }}
                />
              </View>
            </TouchableNativeFeedback>
            <Text style={{color: 'white', fontSize: 23, marginLeft:10, }}>{title}</Text>
          </View>

        </Animated.View >

        <KeyboardAvoidingView behavior={'padding'} style={styles.KeyboardAvoidingView} >
          <View style={styles.accountView}>
            <TextInput placeholder="标题" underlineColorAndroid={accentColor}
              onChange={({nativeEvent})=>{ this.setState({psnid:nativeEvent.text})}}
              style={[styles.textInput, { color:this.props.modeInfo.standardTextColor }]}
              placeholderTextColor={this.props.modeInfo.standardTextColor}
            />
          </View>

          <View style={styles.accountView}>
            <Text style={styles.mainFont}>权限 :</Text>
            <TextInput placeholder="不是邮箱" underlineColorAndroid={accentColor}
              onChange={({nativeEvent})=>{ this.setState({psnid:nativeEvent.text})}}
              style={[styles.textInput, { color:this.props.modeInfo.standardTextColor }]}
              placeholderTextColor={this.props.modeInfo.standardTextColor}
            />
          </View>

          <View style={styles.passwordView}>
            <Text style={styles.mainFont}>内容 :</Text>
            <TextInput placeholder="内容" underlineColorAndroid={accentColor} secureTextEntry={false}
              onChange={({nativeEvent})=>{ this.setState({password:nativeEvent.text})}}
              style={[styles.textInput, { color:this.props.modeInfo.standardTextColor }]}
              placeholderTextColor={this.props.modeInfo.standardTextColor}
            />
          </View>


        </KeyboardAvoidingView>

        <Animated.View  style={animatedSubmitStyle}>
          <View style={styles.submit}>
            <TouchableNativeFeedback
              //onPress={this.login}
              >
              <View style={styles.submitButton}>
                <Text style={[styles.textInput, { color:this.props.modeInfo.standardTextColor }]}>提交</Text>
              </View>
            </TouchableNativeFeedback>
          </View>

          <View style={styles.regist}>
            <Text style={[styles.textInput, { color:this.props.modeInfo.standardTextColor }]}>如果是第一次使用PSNINE，请先完成</Text>
            <TouchableNativeFeedback
              //onPress={this.regist}
            >
              <View>
              <Text style={styles.openURL}>PSNID认证</Text>
              </View>
            </TouchableNativeFeedback>
          </View>
        </Animated.View >

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
    borderColor: accentColor,
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