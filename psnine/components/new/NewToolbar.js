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

import { standardColor, accentColor } from '../../config/colorConfig';

import { pngPrefix, getDealURL, getHappyPlusOneURL, getStoreURL } from '../../dao/dao';

import { safeLogin, registURL } from '../../dao/login';

import NewBattle from './NewBattle';
import NewGene from './NewGene';
import NewTopic from './NewTopic';

let title = '创建讨论';

let toolbarActions = [

];

let AnimatedKeyboardAvoidingView = Animated.createAnimatedComponent(KeyboardAvoidingView);

let screen = Dimensions.get('window');

const { width:SCREEN_WIDTH, height:SCREEN_HEIGHT } = screen;

SCREEN_HEIGHT = SCREEN_HEIGHT - StatusBar.currentHeight;

let CIRCLE_SIZE = 56;

class NewToolbar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      openVal: new Animated.Value(0),
      innerMarginTop: new Animated.Value(0),
    }
  }

  componentDidMount = () => {
    let config = {tension: 30, friction: 7};
    // Animated.timing(this.state.openVal, {toValue: 1, duration: 2000 ,...config}).start();
    Animated.spring(this.state.openVal, {toValue: 1, ...config}).start();
  }

  _pressNew = () => {
    const { navigator, segmentedIndex } = this.props;

    switch (segmentedIndex) {
      case 0 : 
        this.close(() => {
          navigator.replace({
            component: NewTopic,
            withoutAnimation: true,
            shouldForbidPressNew: true,
          })
        });
        break;

      case 1 : 

        break;
      case 3 : 
        this.close(() => {
          navigator.replace({
            component: NewBattle,
            withoutAnimation: true,
            shouldForbidPressNew: true,
          })
        });

        break;
      case 4 : 
        this.close(() => {
          navigator.replace({
            component: NewGene,
            withoutAnimation: true,
            shouldForbidPressNew: true,
          })
        });

        break;
        
    }
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
  }

  close = (cb) => {
    let config = {tension: 30, friction: 7};
    Animated.spring(this.state.openVal, {toValue: 0, ...config}).start(({finished})=>{
      if (typeof cb === 'function') {
        cb()
        return
      }

      if (finished) {
        this.props.navigator.pop();
      }
    });
  }

  render() {
    let { openVal, marginTop } = this.state;

    return (
      <View 
        ref={ref=>this.ref=ref}
        style={{
          flex: 1,
          flexDirection: 'column',
          backgroundColor: 'rgba(52, 52, 52, 0)'
        }}

        >
        <TouchableWithoutFeedback onPress={this.close}>
          <View style={{
              flex: 1,
              flexDirection: 'column',
              backgroundColor: 'rgba(52, 52, 52, 0)'
            }}>
            <Animated.View 
                ref={float=>this.float1=float}
                collapsable ={false}
                style={{
                  opacity: openVal.interpolate({
                    inputRange: [0, 1],
                    outputRange: [1, 1]
                  }),
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: accentColor,
                  position:'absolute',
                  bottom: openVal.interpolate({inputRange: [0, 1], outputRange: [24, 56 + 16 * 2]}),
                  right: 24,
                  elevation: openVal.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0, 0, 1]
                  }) ,
                  zIndex: 1,
                  opacity: this.state.opacity,
              }}>
                
                <TouchableNativeFeedback 
                  onPress={this._pressNew}
                  background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
                  onPressIn={()=>{
                    this.float1.setNativeProps({
                      style :{
                      elevation: 12,
                    }});
                  }}
                  onPressOut={()=>{
                    this.float1.setNativeProps({
                      style :{
                      elevation: 6,
                    }});
                  }}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    flex:1,
                    zIndex: 1,
                    backgroundColor: accentColor,
                  }}>
                  <View style={{borderRadius: 20,flex:-1}}>
                    <Image source={require('../../img/ic_add_white.png')}
                          style={{
                            left:0,
                            top:0,
                            width: 40,
                            height: 40,
                        }}
                    />
                  </View>
                </TouchableNativeFeedback>
            </Animated.View>

            <Animated.View 
                ref={float=>this.float2=float}
                collapsable ={false}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: accentColor,
                  position:'absolute',
                  bottom: openVal.interpolate({inputRange: [0, 1], outputRange: [24,  56 + 16 * 2  + 56]}),
                  right: 24,
                  elevation: openVal.interpolate({
                    inputRange: [0, 0.5, 1],
                    outputRange: [0, 0, 1]
                  }) ,
                  zIndex: 1,
                  opacity: openVal.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1]
                  }),
              }}>
                
                <TouchableNativeFeedback 
                  onPress={this.pressNew}
                  background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
                  onPressIn={()=>{
                    this.float2.setNativeProps({
                      style :{
                      elevation: 12,
                    }});
                  }}
                  onPressOut={()=>{
                    this.float2.setNativeProps({
                      style :{
                      elevation: 6,
                    }});
                  }}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    flex:1,
                    zIndex: 1,
                    backgroundColor: accentColor,
                  }}>
                  <View style={{borderRadius: 20,flex:-1}}>
                    <Image source={require('../../img/ic_exit_white.png')}
                          style={{
                            left:9,
                            top:0,
                            marginTop: 9, 
                            width: 22,
                            height: 22,
                        }}
                    />
                    
                  </View>
                </TouchableNativeFeedback>
            </Animated.View>

            <Animated.View 
                ref={float=>this.float=float}
                collapsable ={false}
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 30,
                  backgroundColor: accentColor,
                  position:'absolute',
                  bottom: 16,
                  right: 16,
                  elevation: 0 ,
                  zIndex: 100,
                  opacity: this.state.opacity,
                  transform: [{
                    rotateZ: openVal.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['0deg', '45deg']
                    }),
                  }]
              }}>
                
                <TouchableNativeFeedback 
                  onPress={this.close}
                  background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 30,
                    flex:1,
                    zIndex: 1,
                    backgroundColor: accentColor,
                  }}>
                  <View style={{borderRadius: 30,flex:-1}}>
                    <Image source={require('../../img/ic_add_white.png')}
                          style={{
                            left:0,
                            top:0,
                            width: 56,
                            height: 56,
                        }}
                    />
                  </View>
                </TouchableNativeFeedback>
            </Animated.View>

          </View>
        </TouchableWithoutFeedback>
      </View>
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


export default NewToolbar