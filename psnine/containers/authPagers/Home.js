import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  WebView,
  KeyboardAvoidingView
} from 'react-native';

import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { standardColor } from '../../constants/colorConfig';

let toolbarActions = [
  { title: '关注', iconName: 'md-star', show: 'always' },
  { title: '感谢', iconName: 'md-thumbs-up', show: 'always' },
  { title: '同步', iconName: 'md-sync', show: 'always' },
  { title: '分享', show: 'never' },
];
let title = "TOPIC";
let WEBVIEW_REF = `WEBVIEW_REF`;

class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLogIn: false,
      canGoBack: false,
      icon: false
    }
  }

  _onActionSelected = (index) => {
    switch (index) {
      case 0:
        return;
      case 1:
        return this.refs[WEBVIEW_REF].reload();
      case 2:
        return;
      case 3:
        return;
    }
  }

  _pressButton = () => {
    if (this.state.canGoBack)
      this.refs[WEBVIEW_REF].goBack();
    else
      this.props.navigation.goBack();
  }

  onNavigationStateChange = (navState) => {
    this.setState({
      canGoBack: navState.canGoBack,
    });
  }

  render() {
    const { modeInfo } = this.props.screenProps
    const { params } = this.props.navigation.state
    // console.log('Deal.js rendered');
    return (
      <View style={{ flex: 1 }}>
        <Ionicons.ToolbarAndroid
          navIconName="md-arrow-back"
          overflowIconName="md-more"
          iconColor={modeInfo.isNightMode ? '#000' : '#fff'}
          title={params.title}
          style={styles.toolbar}
          actions={toolbarActions}
          onIconClicked={this._pressButton}
          onActionSelected={this._onActionSelected}
        />
        <KeyboardAvoidingView
          behavior={'padding'}
          style={{ flex: 3 }}
        >
          <WebView
            ref={WEBVIEW_REF}
            source={{ uri: params.URL }}
            style={{ flex: 3 }}
            scalesPageToFit={true}
            domStorageEnabled={true}
            onNavigationStateChange={this.onNavigationStateChange}
            startInLoadingState={true}
            injectedJavaScript={`$('.header').hide();`}
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
    elevation: 4,
  },
  selectedTitle: {
    //backgroundColor: '#00ffff'
    //fontSize: 20
  },
  avatar: {
    width: 50,
    height: 50,
  }
});


export default Home