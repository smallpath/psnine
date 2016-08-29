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
} from 'react-native';

import NavigatorDrawer from './NavigatorDrawer';
import Toolbar from './Toolbar';


let DRAWER_REF = 'drawer';
let DRAWER_WIDTH_LEFT = 100;

class Psnine extends Component {
  constructor(props){
    super(props);
    this.state = {
      isLogIn: false,
    }
  }

  _renderNavigationView(){
    return (<NavigatorDrawer/>)
  }

  callDrawer(){
    this.refs[DRAWER_REF].openDrawer()
  }

  render() {
    const { reducer } = this.props;
    console.log('App.js rendered');
    return ( 
      <DrawerLayoutAndroid 
            ref={DRAWER_REF}
            drawerWidth={Dimensions.get('window').width - DRAWER_WIDTH_LEFT} 
            drawerPosition={DrawerLayoutAndroid.positions.Left} 
            renderNavigationView={this._renderNavigationView}> 
            <Toolbar {...{navigator:this.props.navigator}} 
              _callDrawer = {() => this.callDrawer.bind(this)}
            />
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

export default Psnine;
