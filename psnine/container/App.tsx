import React, { Component } from 'react'
import {
  StyleSheet,
  DrawerLayoutAndroid,
  Dimensions
} from 'react-native'

import LeftDrawer from './LeftDrawer'
import Toolbar from './Toolbar'

import { standardColor } from '../constant/colorConfig'

let DRAWER_REF = 'drawer'
let DRAWER_WIDTH_LEFT = 80

let drawerWidth = Dimensions.get('window').width - DRAWER_WIDTH_LEFT
if (drawerWidth > 720) {
  drawerWidth = drawerWidth / 2
}
// console.log(Dimensions.get('window').width)

class Psnine extends Component {
  constructor(props) {
    super(props)
  }

  callDrawer = () => {
    this.refs[DRAWER_REF].openDrawer()
  }

  closeDrawer = () => {
    this.refs[DRAWER_REF].closeDrawer()
  }

  shouldComponentUpdate(nextProp, nextState) {
    if (nextProp.screenProps.bottomText !== this.props.screenProps.bottomText) {
      return false
    }
    return true
  }

  render() {
    const { reducer } = this.props
    // console.log('App.js rendered');
    const { navigation: { state }, screenProps } = this.props
    const {modeInfo} = screenProps
     log(modeInfo.themeName, modeInfo.isNightMode, '===> Outter')
    return (
      <DrawerLayoutAndroid
        ref={DRAWER_REF}
        drawerWidth={drawerWidth}
        drawerPosition={DrawerLayoutAndroid.positions.Left}
        renderNavigationView={() => (
          <LeftDrawer {...{
            closeDrawer: this.closeDrawer,
            navigation: this.props.navigation,
            modeInfo: screenProps.modeInfo,
            switchModeOnRoot: screenProps.switchModeOnRoot
          }} />
        )}>
        <Toolbar
          {...{
            navigation: this.props.navigation,
            modeInfo: screenProps.modeInfo,
            switchModeOnRoot: screenProps.switchModeOnRoot
          }}

          _callDrawer={() => this.callDrawer.bind(this)}
        />
      </DrawerLayoutAndroid>
    )
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#F5FCFF'
  },
  toolbar: {
    backgroundColor: standardColor,
    height: 56
  },
  selectedTitle: {
    //backgroundColor: '#00ffff'
    //fontSize: 20
  },
  avatar: {
    width: 50,
    height: 50
  }
})

export default Psnine
