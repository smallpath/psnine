import React, { Component, PropTypes } from 'react'
import htmlToElement from './htmlToElement'
import {
  Linking,
  StyleSheet,
  Text,
  View
} from 'react-native'

const boldStyle = { fontWeight: '500' };
const italicStyle = { fontStyle: 'italic' };
const codeStyle = { fontFamily: 'Menlo' };

const baseStyles = StyleSheet.create({
  b: boldStyle,
  strong: boldStyle,
  i: italicStyle,
  em: italicStyle,
  pre: codeStyle,
  code: codeStyle,
  a: {
    fontWeight: '500',
    color: '#007AFF',
  },
  u: { textDecorationLine: 'underline' },
  h1: { fontWeight: '500', fontSize: 36 },
  h2: { fontWeight: '500', fontSize: 30 },
  h3: { fontWeight: '500', fontSize: 24 },
  h4: { fontWeight: '500', fontSize: 18 },
  h5: { fontWeight: '500', fontSize: 14 },
  h6: { fontWeight: '500', fontSize: 12 },
  blockquote: {
    backgroundColor: '#eec',
    paddingVertical: 6,
    paddingHorizontal: 6,
    margin: 10
  }
});


class HtmlView extends Component {
  constructor() {
    super()
    this.state = {
      element: null,
      height: null
    }
  }

  componentDidMount() {
    this.mounted = true
    this.startHtmlRender(this.props.value)
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.value !== nextProps.value) {
      this.startHtmlRender(nextProps.value)
    }
  }

  componentWillUnmount() {
    this.mounted = false
  }

  startHtmlRender(value) {
    if (!value) {
      this.setState({ element: null })
    }

    const opts = {
      linkHandler: this.props.onLinkPress,
      styles: Object.assign({}, baseStyles, this.props.stylesheet),
      customRenderer: this.props.renderNode,
      imagePaddingOffset: this.props.imagePaddingOffset,
      modeInfo: this.props.modeInfo,
      shouldShowLoadingIndicator: this.props.shouldShowLoadingIndicator,
      alignCenter: this.props.alignCenter,
      onImageLongPress: this.props.onImageLongPress
    }

    htmlToElement(value, opts, (err, element) => {
      if (err) {
        this.props.onError(err)
      }

      if (this.mounted) {
        this.setState({ element })
      }
    })
  }

  render() {
    if (this.state.element) {
      const alignSelf = this.props.alignCenter ? { justifyContent: 'center' } : {}
      return <View children={this.state.element} style={[this.props.style, { flexDirection: 'column', flexWrap: 'wrap' }, alignSelf]} />;
    }
    return <View style={this.props.style} />;
  }
}

HtmlView.propTypes = {
  value: PropTypes.string,
  stylesheet: PropTypes.object,
  onLinkPress: PropTypes.func,
  onImageLongPress: PropTypes.func,
  onError: PropTypes.func,
  renderNode: PropTypes.func,
  modeInfo: PropTypes.object,
  shouldShowLoadingIndicator: PropTypes.bool,
  alignCenter: PropTypes.bool
}

HtmlView.defaultProps = {
  onLinkPress: url => Linking.openURL(url),
  onImageLongPress: url => Linking.openURL(url),
  onError: console.error.bind(console),
  modeInfo: {},
  shouldShowLoadingIndicator: false,
  alignCenter: false
}

export default HtmlView