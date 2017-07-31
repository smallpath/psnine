import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  WebView
} from 'react-native'

import Ionicons from 'react-native-vector-icons/Ionicons'
import { standardColor } from '../../constant/colorConfig'

let toolbarActions = [
  { title: '刷新', iconName: 'md-refresh', show: 'always' }
]
let title = 'TOPIC'
let WEBVIEW_REF = `WEBVIEW_REF`

class Deal extends Component<any, any> {

  constructor(props) {
    super(props)
    this.state = {
      isLogIn: false,
      canGoBack: false,
      icon: false
    }
  }

  _onActionSelected = (index) => {
    switch (index) {
      case 0:
        return this.refs[WEBVIEW_REF].reload()
    }
  }

  _pressButton = () => {
    if (this.state.canGoBack)
      this.refs[WEBVIEW_REF].goBack()
    else
      this.props.navigation.goBack()
  }

  onNavigationStateChange = (navState) => {
    this.setState({
      canGoBack: navState.canGoBack
    })
  }

  render() {
    // console.log('Deal.js rendered');
    const { modeInfo } = this.props.screenProps
    const { params } = this.props.navigation.state
    return (
      <View style={{ flex: 1, backgroundColor: modeInfo.backgroundColor }}>
        <Ionicons.ToolbarAndroid
          navIconName='md-arrow-back'
          overflowIconName='md-more' iconColor={modeInfo.isNightMode ? '#000' : '#fff'}
          title={params.title}
          titleColor={modeInfo.backgroundColor}
          style={[styles.toolbar, { backgroundColor: modeInfo.standardColor }]}
          actions={toolbarActions}
          onIconClicked={this._pressButton}
          onActionSelected={this._onActionSelected}
        />
        {/*<KeyboardAvoidingView
          behavior={'padding'}
          style={{ flex: 3 }}
        >*/}
          <WebView
            ref={WEBVIEW_REF}
            source={{ uri: params.URL }}
            style={{ flex: 3 }}
            scalesPageToFit={true}
            domStorageEnabled={true}
            onNavigationStateChange={this.onNavigationStateChange}
            startInLoadingState={true}
            injectedJavaScript={`$('.header').hide()`}
          />
        {/*</KeyboardAvoidingView>*/}
      </View>
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
    height: 56,
    elevation: 4
  },
  selectedTitle: {
    // backgroundColor: '#00ffff'
    // fontSize: 20
  },
  avatar: {
    width: 50,
    height: 50
  }
})

export default Deal