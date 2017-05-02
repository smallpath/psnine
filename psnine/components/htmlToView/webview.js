import React, {Component, PropTypes} from 'react'
import htmlToElement from './htmlToElement'
import {
  Linking,
  StyleSheet,
  Text,
  WebView,
  View,
  Dimensions,
  PixelRatio
} from 'react-native'

var { width, height: SCEEN_HEIGHT } = Dimensions.get('window')

var pixelRate = PixelRatio.get()

class HtmlView extends Component {
  constructor(props) {
    super(props)
    let height = this.props.style.height || '100%'
    if (height === '100%') {
      height = SCEEN_HEIGHT - 100
    }
    this.state = {
      width: this.props.style.width || '100%',
      height: height
    }
  }


  render() {
    return (
      <WebView 
        startInLoadingState={true}
        mixedContentMode={'always'}
        automaticallyAdjustContentInsets={true}
        style={{flex:1, padding: 0, height: this.state.height}}
        scrollEnable={true}
        injectedJavaScript={'<script>window.location.hash = 1;document.title = document.height;</script>'}
        onNavigationStateChange={(navState) => {
          //this.setState({
          //  height: parseInt((navState.title.match(/\sheight=\"(\d+)\"/) || [0, 0])[1])
          //});
        }}
        scrollEnable={true}
        source={{uri: this.props.url}} />
    );
  }
}

HtmlView.propTypes = {
  value: PropTypes.string,
  stylesheet: PropTypes.object,
  onLinkPress: PropTypes.func,
  onError: PropTypes.func,
  renderNode: PropTypes.func,
  defaultTextColor: PropTypes.string
}

HtmlView.defaultProps = {
  onLinkPress: url => Linking.openURL(url),
  onError: console.error.bind(console),
  defaultTextColor:'#000',
}

export default HtmlView