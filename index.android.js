/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  DrawerLayoutAndroid,
  ToolbarAndroid,
  ToastAndroid,
  BackAndroid,
  TouchableOpacity,
  Dimensions,
} from 'react-native';

let DRAWER_REF = 'drawer';
let DRAWER_WIDTH_LEFT = 100;
let toolbarActions = [
  {title: '搜索', show: 'always'},
  {title: '全部', show: 'never'},
  {title: '新闻', show: 'never'},
  {title: '攻略', show: 'never'},
  {title: '测评', show: 'never'},
  {title: '心得', show: 'never'},
  {title: 'Plus', show: 'never'},
  {title: '二手', show: 'never'},
  {title: '开箱', show: 'never'},
  {title: '游列', show: 'never'},
  {title: '活动', show: 'never'},
];

let title = "PSNINE";

import NavigatorDrawer from './NavigatorDrawer';

let navigationView = ( 
        <View style={{flex: 1, backgroundColor: '#fff'}}> 
            <Text style={{margin: 10, fontSize: 15, textAlign: 'left'}}>I'm in the Drawer!</Text> 
        </View> );

class Psnine extends Component {
  _renderNavigationView(){
    return (
      <NavigatorDrawer
      
      /> 
    )
  }
  render() {
    return ( 
      <DrawerLayoutAndroid 
            ref={DRAWER_REF}
            drawerWidth={Dimensions.get('window').width - DRAWER_WIDTH_LEFT} 
            drawerPosition={DrawerLayoutAndroid.positions.Left} 
            renderNavigationView={this._renderNavigationView}> 
                <View style={styles.container}> 
                  <ToolbarAndroid
                    navIcon={require('image!ic_menu_white')}
                    title={title}
                    style={styles.toolbar}
                    actions={toolbarActions}
                    onIconClicked={()=> this.refs[DRAWER_REF].openDrawer()}
                  />
                  <Text style={{margin: 10, fontSize: 15, textAlign: 'center'}}>Hello</Text> 
                  <Text style={{margin: 10, fontSize: 15, textAlign: 'center'}}>World!</Text> 
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
});

AppRegistry.registerComponent('Psnine', () => Psnine);
