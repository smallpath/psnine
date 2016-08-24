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
} from 'react-native';

import { connect } from 'react-redux';
import reducer from '../reducers/rootReducer.js'
import { bindActionCreators } from 'redux';

import NavigatorDrawer from '../components/NavigatorDrawer';

let DRAWER_REF = 'drawer';
let DRAWER_WIDTH_LEFT = 100;

let toolbarActions = [
  {title: '搜索', show: 'always'},
  {title: '全部', show: 'never'},
];
let title = "TOPIC";
let WEBVIEW_REF = `WEBVIEW_REF`;

class MyWeb extends Component {
  constructor(props){
    super(props);
    this.state = {
      isLogIn: false,
    }
  }

  _renderNavigationView(){
    return (<NavigatorDrawer/>)
  }


  _pressButton = ()=> {
    this.refs[WEBVIEW_REF].goBack();
  }

  callDrawer(){this.refs[DRAWER_REF].openDrawer()}

  onNavigationStateChange = (...args) => {
    //console.log(...args);
  }

 onShouldStartLoadWithRequest = (event) => { 
    console.log(event);
    return true; 
  }

  render() {
    const { reducer } = this.props;
    //console.log('App.js/51 line',this.props);
    return ( 
      <DrawerLayoutAndroid 
            ref={DRAWER_REF}
            drawerWidth={Dimensions.get('window').width - DRAWER_WIDTH_LEFT} 
            drawerPosition={DrawerLayoutAndroid.positions.Left} 
            renderNavigationView={this._renderNavigationView}> 
            <View style={{flex:1}}>
                <ToolbarAndroid
                  navIcon={require('image!ic_menu_white')}
                  title={this.props.rowData.title}
                  style={styles.toolbar}
                  actions={toolbarActions}
                  onIconClicked={this._pressButton}
                />
                <WebView
                    ref={WEBVIEW_REF}
                    source={{uri: this.props.URL}} 
                    style={{flex:3}}
                    scalesPageToFit={true}
                    domStorageEnabled={true}
                    onNavigationStateChange={this.onNavigationStateChange}
                    onShouldStartLoadWithRequest={this.onShouldStartLoadWithRequest}
                    startInLoadingState={true}  
                    injectedJavaScript={`$('.header').hide()`}
                />
            </View>
      </DrawerLayoutAndroid> 
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
    backgroundColor: '#00a2ed',
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


export default MyWeb