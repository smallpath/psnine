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
      onImageLongPress: this.props.onImageLongPress,
      shouldForceInline: this.props.shouldForceInline
    }
    // 加一个空文字来将最开头的表情内联
    let target = value
    if (target.indexOf('<img src="http://photo.psnine.com/face/') === 0) {
      target = '<span/>' + target
    }
    htmlToElement(target, opts, (err, element) => {
      if (err) {
        this.props.onError(err)
      }

      if (this.mounted) {
        this.setState({ element })
      }
    })
  }

  render() {
    const TargetView = this.props.shouldForceInline ? Text : View
    if (this.state.element) {
      const alignSelf = this.props.alignCenter ? { justifyContent: 'center' } : {}
      Object.assign(alignSelf, { flexDirection: 'column', flexWrap: 'wrap' })
      return <TargetView children={this.state.element} style={[this.props.style, this.props.shouldForceInline ? null : alignSelf]} />;
    }
    return <TargetView style={this.props.style} />;
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
  alignCenter: PropTypes.bool,
  shouldForceInline: PropTypes.bool
}

HtmlView.defaultProps = {
  onLinkPress: url => {
    const reg = /^(https|http)\:\/\//
    if (reg.exec(url)) {
      const target = url.replace(reg, 'p9://')
      return Linking.openURL(target).catch(err => console.error('p9 linking occurred', err));
    }
    return Linking.openURL(url).catch(err => console.error('Web linking occurred', err));
  },
  onImageLongPress: url => Linking.openURL(url),
  onError: console.error.bind(console),
  modeInfo: {},
  shouldShowLoadingIndicator: false,
  alignCenter: false,
  shouldForceInline: false
}

export default HtmlView