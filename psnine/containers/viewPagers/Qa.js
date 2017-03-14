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
  PanResponder
} from 'react-native';

import { connect } from 'react-redux';
import { standardColor } from '../../config/colorConfig';

let WEBVIEW_REF = `WEBVIEW_REF_Qa`;
let back_image = require('../../img/ic_back_blue.png');
let imageSize = 48;
let toolbarHeight = 56;
let releasedMarginTop = 0;

class Qa extends Component {

  constructor(props){
    super(props);
    this.state = {
      isLogIn: false,
      canGoBack: false,
    }
  }

  _pressButton = () => {
    if(this.state.canGoBack)
      this.refs[WEBVIEW_REF].goBack();
    else
      this.props.navigator.pop();
  }

  onNavigationStateChange = (navState) => {

    // if(navState.url.indexOf(this.props.URL) !== -1 ){
      this.setState({
        canGoBack: navState.canGoBack,
      });
    // }else{
    //   this.setState({
    //     canGoBack: navState.canGoBack,
    //   });
    //   this.refs[WEBVIEW_REF].stopLoading();
    // }
  }

  componentWillMount() {
    const { dispatch } = this.props;
    const ref = this
    let currentScrolling = false;
    const setMarginTop = this.props.setMarginTop
    this.panResponder = PanResponder.create({  

        onStartShouldSetPanResponderCapture: (e, gesture) =>{ 
          return true; 
        },

        onMoveShouldSetPanResponderCapture:(e, gesture) =>{ 
          let shouldSet = Math.abs(gesture.dy) >=4;
          return shouldSet; 
        },

        onPanResponderGrant: (e, gesture) => {
          if (currentScrolling === false) {
            currentScrolling = true;
            this.listView.setNativeProps({
              scrollEnabled: false,
            });
          }
        },
        onPanResponderMove: (e, gesture) => {
          let dy = gesture.dy;
          let vy = gesture.vy;
          if(dy < 0){
            dy = dy + setMarginTop(null, null, true);
            if(-dy <= toolbarHeight && dy <= 0){
              setMarginTop(dy)
            } else {
              setMarginTop(-toolbarHeight)
              if (currentScrolling === true) {
                currentScrolling = false;
                this.listView.setNativeProps({
                  scrollEnabled: true,
                });
              }
            }
          }else{
            dy = dy + setMarginTop(null, null, true);
            if(-dy <= toolbarHeight && dy <= 0){ 
              setMarginTop(dy)
            } else {
              setMarginTop(0)
              if (currentScrolling === true) {
                currentScrolling = false;
                // dispatch(changeScrollType(false))
                this.listView.setNativeProps({
                  scrollEnabled: true,
                });
              }
            }
          }
        }, 
        onPanResponderRelease: (e, gesture) => {
          // console.log('onPanResponderRelease\n======')
          const releasedMarginTop = setMarginTop(null, null, true)
          if (releasedMarginTop === 0 || releasedMarginTop === -toolbarHeight) {
            if (currentScrolling === true) {
              currentScrolling = false;
              // dispatch(changeScrollType(false))
                this.listView.setNativeProps({
                  scrollEnabled: true,
                });
            }
          }
        },
        onPanResponderTerminationRequest : (evt, gesture) => {  
          // console.log('onPanResponderTerminationRequest')
          return true;
        },
        onPanResponderTerminate: (evt, gesture) => {  
          // console.log('onPanResponderTerminate')
        },
        onShouldBlockNativeResponder: (evt, gesture) => {  
          // console.log('onShouldBlockNativeResponder')
          return false;
        },
        onPanResponderReject: (evt, gesture) => {  
          // console.log('onPanResponderReject')
          return false;
        },
        onPanResponderEnd: (evt, gesture) => {  
          // console.log('onPanResponderEnd')
          let dy = gesture.dy;
          let vy = gesture.vy;
          
          setMarginTop(null, true)

          const releasedMarginTop = setMarginTop(null, null, true)
          if (releasedMarginTop === 0 || releasedMarginTop === -toolbarHeight) {
            if (currentScrolling === true) {
              currentScrolling = false;
              // dispatch(changeScrollType(false))
                this.listView.setNativeProps({
                  scrollEnabled: true,
                });
            }
          }
        },

    });
  }

  render() {
    // console.log('Qa.js rendered');
    return ( 
        <View style={{flex:3}} ref={(a)=>this.listView = a} {...this.panResponder.panHandlers}>
            <View style={{
                    position: 'absolute',
                    bottom: 20,
                    right: 20,
                    width: imageSize,
                    height: imageSize,
                    zIndex: 100,
                }}>
                <TouchableNativeFeedback
                    onPress={this._pressButton}
                >
                <View style={{width:imageSize, height:imageSize}}>
                    <Image 
                        style={{width:imageSize, height:imageSize}}
                        source={back_image}
                    />
                    </View>
                </TouchableNativeFeedback>
            </View>
            <KeyboardAvoidingView
              behavior={'padding'}
              style={{flex:3}}
              >
              <WebView
                  ref={WEBVIEW_REF}
                  source={{uri: this.props.URL}} 
                  style={{flex:3}}
                  scalesPageToFit={true}
                  domStorageEnabled={true}
                  onNavigationStateChange={this.onNavigationStateChange}
                  startInLoadingState={true}  
                  injectedJavaScript={`$('.header').hide(); $('.scrollbar').removeClass('scrollbar').hide()`}
              />
            </KeyboardAvoidingView>
        </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#F5FCFF',
  },
  toolbar: {
    backgroundColor: standardColor,
    height: 56,
  },
  selectedTitle:{
    //backgroundColor: '#00ffff'
    //fontSize: 20
  },
  avatar: {
    width: 50,
    height: 50,
  }
});

function mapStateToProps(state) {
    return {

    };
}

export default connect(
  mapStateToProps
)(Qa);
