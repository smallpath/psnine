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

import { standardColor } from '../config/colorConfig';


let DRAWER_REF = 'drawer';
let DRAWER_WIDTH_LEFT = 90;

class Psnine extends Component {
  constructor(props){
    super(props);
  }

  _renderNavigationView = ()=>{
    return (<NavigatorDrawer {...{
          closeDrawer: this.closeDrawer,
          navigator:this.props.navigator, 
          modeInfo:this.props.modeInfo,
          switchModeOnRoot: this.props.switchModeOnRoot
        }}/>)
  }

  callDrawer=()=>{
    this.refs[DRAWER_REF].openDrawer()
  }

  closeDrawer=()=>{
    this.refs[DRAWER_REF].closeDrawer()
  }

  render() {
    const { reducer } = this.props;
    // console.log('App.js rendered');
    return ( 
      <DrawerLayoutAndroid 
            ref={DRAWER_REF}
            drawerWidth={Dimensions.get('window').width - DRAWER_WIDTH_LEFT} 
            drawerPosition={DrawerLayoutAndroid.positions.Left} 
            renderNavigationView={this._renderNavigationView}>
            <Toolbar 
              {...{navigator:this.props.navigator, modeInfo:this.props.modeInfo, switchModeOnRoot: this.props.switchModeOnRoot }}
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

export default Psnine;
