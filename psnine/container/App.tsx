import React, { Component } from 'react'
import {
  DrawerLayoutAndroid,
  Dimensions
} from 'react-native'

import LeftDrawer from './LeftDrawer'
import Toolbar from './Toolbar'

let DRAWER_REF = 'drawer'
let DRAWER_WIDTH_LEFT = 80

let drawerWidth = Dimensions.get('window').width - DRAWER_WIDTH_LEFT
if (drawerWidth > 720) {
  drawerWidth = drawerWidth / 2
}

declare var global

class Psnine extends Component<any, any> {
  constructor(props) {
    super(props)
  }

  callDrawer = () => {
    this.refs[DRAWER_REF].openDrawer()
  }

  closeDrawer = () => {
    this.refs[DRAWER_REF].closeDrawer()
  }

  render() {
    // console.log('App.js rendered');
    const { screenProps } = this.props
    const {modeInfo} = screenProps
    global.log(modeInfo.themeName, modeInfo.isNightMode, '===> Outter')
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

export default Psnine
