import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  WebView,
  Linking
} from 'react-native'

import Ionicons from 'react-native-vector-icons/Ionicons'
import { standardColor } from '../../constant/colorConfig'

let toolbarActions = [
  { title: '刷新', iconName: 'md-refresh', show: 'always' }
]
let title = 'TOPIC'

class Deal extends Component<any, any> {

  constructor(props) {
    super(props)
    this.state = {
      isLogIn: false,
      canGoBack: false,
      icon: false,
      title
    }
  }

  _onActionSelected = (index) => {
    switch (index) {
      case 0:
        return this.webview.reload()
    }
  }

  _pressButton = () => {
    if (this.state.canGoBack)
      this.webview.goBack()
    else
      this.props.navigation.goBack()
  }
  webview
  onNavigationStateChange = (navState) => {
    const { url, navigationType } = navState
    console.log(navState, '===>')
    if (url.includes('//psnine.com/dd/') && navigationType !== 'other') {
      this.webview && this.webview.stopLoading()
      Linking.openURL('p9://' + url.split('//').pop()).catch(err => {
        console.log(err)
      })
    }
    this.setState({
      canGoBack: navState.canGoBack,
      title: navState.title
    })
  }

  render() {
    // console.log('Deal.js rendered');
    const { modeInfo } = this.props.screenProps
    const { params } = this.props.navigation.state
    const uri = params.URL.startsWith('NEED_DECODE_')
      ? decodeURIComponent(params.URL.replace('NEED_DECODE_', ''))
      : params.URL
    return (
      <View style={{ flex: 1, backgroundColor: modeInfo.backgroundColor }}>
        <Ionicons.ToolbarAndroid
          navIconName='md-arrow-back'
          overflowIconName='md-more' iconColor={modeInfo.isNightMode ? '#000' : '#fff'}
          title={params.title || this.state.title}
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
            ref={webview => this.webview = webview}
            source={{ uri }}
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