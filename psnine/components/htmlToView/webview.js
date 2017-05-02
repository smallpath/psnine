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

var { width } = Dimensions.get('window')

var pixelRate = PixelRatio.get()

class HtmlView extends Component {
  constructor(props) {
    super(props)
    this.state = {
      width: this.props.style.width || '100%',
      height: (this.props.style.height / 1 ) || 1
    }
  }

  render() {
    return (
      <WebView 
        startInLoadingState={true}
        mixedContentMode={'always'}
        style={{flex:1, padding: 0, height: this.state.height}}
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