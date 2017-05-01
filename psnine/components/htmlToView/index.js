import React, {Component, PropTypes} from 'react'
import htmlToElement from './htmlToElement'
import {
  Linking,
  StyleSheet,
  Text,
  WebView
} from 'react-native'

const boldStyle = {fontWeight: '500'}
const italicStyle = {fontStyle: 'italic'}
const codeStyle = {fontFamily: 'Menlo'}

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
})

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
      this.setState({element: null})
    }

    const opts = {
      linkHandler: this.props.onLinkPress,
      styles: Object.assign({}, baseStyles, this.props.stylesheet),
      customRenderer: this.props.renderNode,
      imagePaddingOffset: this.props.imagePaddingOffset
    }

    htmlToElement(value, opts, (err, element) => {
      if (err) {
        this.props.onError(err)
      }

      if (this.mounted) {
        this.setState({element})
      }
    })
  }

  _renderWebView = () => {
    return (
        <WebView 
          startInLoadingState={true}
          style={{flex:-1, padding: 0, height: this.state.height}}
          scrollEnable={true}
          injectedJavaScript={'<script>window.location.hash = 1;document.title = document.height;</script>'}
          onNavigationStateChange={(navState) => {
            this.setState({
              height: parseInt((navState.title.match(/\sheight=\"(\d+)\"/) || [0, 0])[1])
            });
          }}
          source={{html: this.props.value}} />
    );
  }

  render() {
    if (this.props.value.indexOf('embed') === 1) {
      return this._renderWebView()
    } else if (this.props.value.indexOf('iframe') === 1) {
      return this._renderWebView()
    } else if (this.state.element) {
      return <Text style={{color: this.props.defaultTextColor}} children={this.state.element} />
    }
    return <Text />
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