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
import Ionicons from 'react-native-vector-icons/Ionicons';
import { standardColor, accentColor } from '../../config/colorConfig';

import { pngPrefix, getDealURL, getHappyPlusOneURL, getStoreURL } from '../../dao/dao';

import { safeLogin, registURL } from '../../dao/login';


let title = '创建约战';

let toolbarActions = [

];

let AnimatedKeyboardAvoidingView = Animated.createAnimatedComponent(KeyboardAvoidingView);

let screen = Dimensions.get('window');

const { width:SCREEN_WIDTH, height:SCREEN_HEIGHT } = screen;

SCREEN_HEIGHT = SCREEN_HEIGHT - StatusBar.currentHeight;

let CIRCLE_SIZE = 56;

class NewTopic extends Component {

  constructor(props) {
    super(props);

    this.state = {
      openVal: new Animated.Value(0),
      innerMarginTop: new Animated.Value(0),
      icon: false
    }
  }

  componentDidMount = () => {
    let config = {tension: 30, friction: 7};
    // Animated.timing(this.state.openVal, {toValue: 1, duration: 2000 ,...config}).start();
    Animated.spring(this.state.openVal, {toValue: 1, ...config}).start();
  }

  _pressButton = () => {
    this.title.clear();
    this.content.clear();

    let { openVal, innerMarginTop } = this.state;
    let config = {tension: 30, friction: 7};

    let value = this.state.innerMarginTop._value;
    if (Math.abs(value) >= 50) {
      Animated.spring(this.state.innerMarginTop, {toValue: 0, ...config}).start();
      return;
    }

    Animated.spring(this.state.openVal, {toValue: 0, ...config}).start(({finished})=>{
      finished && this.props.navigator.pop();
    });

  }

  componentWillUnmount = async () => {
    let { openVal, innerMarginTop } = this.state;
    let config = {tension: 30, friction: 7};
    this.removeListener && this.removeListener.remove  && this.removeListener.remove();
  }

  componentWillMount() {
        let config = {tension: 30, friction: 7};
        this.removeListener = BackAndroid.addEventListener('hardwareBackPress',  () => {
          let value = this.state.innerMarginTop._value;
          if (Math.abs(value) >= 50) {
            Animated.spring(this.state.innerMarginTop, {toValue: 0, ...config}).start();
            return true;
          }else{
            Animated.spring(this.state.openVal, {toValue: 0, ...config}).start(({finished})=>{
              finished && this.props.navigator.pop();
            });
            return true;
          }
        });

        this.panResponder = PanResponder.create({  

            onStartShouldSetPanResponderCapture: (e, gesture) =>{ 
              return false; 
            },

            onMoveShouldSetPanResponderCapture:(e, gesture) =>{ 
              let shouldSet = Math.abs(gesture.dy) >=4;
              return shouldSet; 
            },

            onPanResponderGrant:(e, gesture) => {
                this.state.innerMarginTop.setOffset(gesture.y0);
            },
            onPanResponderMove: Animated.event([
              null,
              { 
                  dy: this.state.innerMarginTop
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
              
              this.state.innerMarginTop.flattenOffset();

              let duration = 50; 

              if(vy<0){

                if(Math.abs(dy) <= CIRCLE_SIZE ){

                  Animated.spring(this.state.innerMarginTop,{
                    toValue: SCREEN_HEIGHT- CIRCLE_SIZE,
                    duration,
                    easing: Easing.linear,
                  }).start();

                }else{

                  Animated.spring(this.state.innerMarginTop,{
                    toValue: 0,
                    duration,
                    easing: Easing.linear,
                  }).start();

                }

              }else{

                if(Math.abs(dy) <= CIRCLE_SIZE){

                  Animated.spring(this.state.innerMarginTop,{
                    toValue: 0,
                    duration,
                    easing: Easing.linear,
                  }).start();

                }else{

                  Animated.spring(this.state.innerMarginTop,{
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
    let { openVal, marginTop } = this.state;

    let outerStyle = { 
      marginTop : this.state.innerMarginTop.interpolate({
        inputRange: [0, SCREEN_HEIGHT], 
        outputRange: [0 ,SCREEN_HEIGHT]
      })
    };

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
        ref={ref=>this.ref=ref}
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
                  source={require('../../img/ic_back_white_smaller.png')}
                  style={{ width: 50, height:50, }}
                />
              </View>
            </TouchableNativeFeedback>
            <Text style={{color: 'white', fontSize: 23, marginLeft:10, }}>{title}</Text>
          </View>

        </Animated.View >

        <Animated.View  style={[styles.KeyboardAvoidingView, {
          flex: openVal.interpolate({inputRange: [0, 1], outputRange: [0 , 10]}), 
        }]} >
          <AnimatedKeyboardAvoidingView behavior={'height'} style={[styles.titleView,
            //{flex: openVal.interpolate({inputRange: [0, 1], outputRange: [0 , 1]}), }
            ]}>
            <TextInput placeholder="标题" 
              ref={ref=>this.title=ref}
              //onChange={({nativeEvent})=>{ this.setState({title:nativeEvent.text})}}
              style={[styles.textInput, { 
                color:this.props.modeInfo.titleTextColor, 
                textAlignVertical:'center', 
              }]}
              placeholderTextColor={this.props.modeInfo.standardTextColor}
              underlineColorAndroid='rgba(0,0,0,0)'
            />
          </AnimatedKeyboardAvoidingView >

          <View style={{ height:1, opacity:0.5 ,backgroundColor: this.props.modeInfo.standardTextColor  }}/>

          <AnimatedKeyboardAvoidingView behavior={'padding'} style={[styles.contentView,{
            flex: openVal.interpolate({inputRange: [0, 1], outputRange: [0 , 12]}),
          }]}>
            <TextInput placeholder="内容" 
              multiline={true}
              ref={ref=>this.content=ref}
              //onChange={({nativeEvent})=>{ this.setState({content:nativeEvent.text})}}
              style={[styles.textInput, { 
                color:this.props.modeInfo.titleTextColor,
                textAlign: 'left',
                textAlignVertical: 'top',
                flex:1,
              }]}
              placeholderTextColor={this.props.modeInfo.standardTextColor}
              // underlineColorAndroid={accentColor}
              underlineColorAndroid='rgba(0,0,0,0)'
            />
            <Animated.View style={[{    
                  elevation: 4,
                },animatedToolbarStyle]}>
                <View style={{    
                    flex: 1, 
                    flexDirection: 'row' , 
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}>
                  <View style={{flexDirection: 'row' ,  }}>
                    <TouchableNativeFeedback
                      onPress={this._pressButton}
                      delayPressIn={0}
                      background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
                      style={{ borderRadius: 25}}
                      >
                      <View style={{ width: 50, height:50, marginLeft:0, borderRadius: 25,}}>
                        <Image 
                          source={require('../../img/ic_insert_emoticon_white.png')}
                          style={{ width: 50, height:50 }}
                        />
                      </View>
                    </TouchableNativeFeedback>
                    <TouchableNativeFeedback
                      onPress={this._pressButton}
                      delayPressIn={0}
                      background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
                      style={{ borderRadius: 25}}
                      >
                      <View style={{ width: 50, height:50, marginLeft:0, borderRadius: 25,}}>
                        <Image 
                          source={require('../../img/ic_insert_photo_white.png')}
                          style={{ width: 50, height:50 }}
                        />
                      </View>
                    </TouchableNativeFeedback>
                  </View>
                  <TouchableNativeFeedback
                    onPress={this._pressButton}
                    delayPressIn={0}
                    background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
                    style={{ borderRadius: 25}}
                    >
                    <View style={{ width: 50, height:50, marginLeft:0, borderRadius: 25,}}>
                      <Image 
                        source={require('../../img/ic_send_white.png')}
                        style={{ width: 50, height:50 }}
                      />
                    </View>
                  </TouchableNativeFeedback>
                </View>

              </Animated.View>
              <Animated.View style={{
                elevation: 4, bottom:0,  backgroundColor: this.props.modeInfo.standardColor,
                height: 100,
                opacity: openVal.interpolate({inputRange: [0, 0.9  ,1], outputRange: [0, 0, 1]}),
             }} />
          </AnimatedKeyboardAvoidingView>

        </Animated.View>

      </Animated.View>
    );
  }
}


const width = Dimensions.get('window').width;

const styles = StyleSheet.create({
  circle: {
    flex: 1, 
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
    flex: -1,
  },
  mainFont: {
    fontSize: 15, 
    color:accentColor
  },
  textInput: {
    fontSize: 15,
  },
  KeyboardAvoidingView: { 
    flex: 10, 
    // width: width,
    //alignSelf:'center',
    //justifyContent: 'space-between',
    flexDirection: 'column' 
  },
  titleView: { 
    flex: 1, 
    //marginTop: -10,
    justifyContent: 'center',
    // flexDirection: 'column',
    // justifyContent: 'space-between',
  },
  isPublicView:{ 
    flex: 1, 
    flexDirection:'row',
    // flexDirection: 'column',
    alignItems: 'center',
  },
  contentView: { 
    flex: 12, 
    // flexDirection: 'column', 
  },
  submit: { 
    // flex: -1, 
    // height: 20,
    // //margin: 10,
    // marginTop: 30,
    // marginBottom: 20,
  },
  submitButton:{
    // backgroundColor: accentColor,
    // height: 40,
    // alignItems: 'center',
    // justifyContent: 'center',
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