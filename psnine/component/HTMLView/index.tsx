import React, { Component, PropTypes } from 'react'
import htmlToElement from './htmlToElement'
import {
  Linking,
  StyleSheet,
  Text,
  View,
  TextStyle
} from 'react-native'

import { idColor } from '../../constant/colorConfig'
import { onDeepLinkPress, urlExtractor } from '../../utils'

const boldStyle = { fontWeight: '500' }
const italicStyle = { fontStyle: 'italic' }
const codeStyle = { fontFamily: 'Menlo' }

const baseStyles = StyleSheet.create({
  b: boldStyle as TextStyle,
  strong: boldStyle as TextStyle,
  i: italicStyle as TextStyle,
  em: italicStyle as TextStyle,
  pre: codeStyle as TextStyle,
  code: codeStyle as TextStyle,
  a: {
    color: idColor
  } as TextStyle,
  u: { textDecorationLine: 'underline' },
  s: { textDecorationLine: 'line-through' },
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
})

const urlMapper = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|#|\&|-|\!)+)/igm

interface IProp {
  value: string
  stylesheet: any
  onLinkPress: any
  onImageLongPress: any
  onError: any
  renderNode: any
  modeInfo: any
  shouldShowLoadingIndicator: boolean
  alignCenter: boolean
  shouldForceInline: boolean
  forceMark: boolean
  imagePaddingOffset: number
  style: any
}

class HtmlView extends Component<IProp, {
  element: JSX.Element | null
  height: number | null
}> {
  public static propTypes = {
    value: PropTypes.string,
    stylesheet: PropTypes.object,
    onLinkPress: PropTypes.func,
    onImageLongPress: PropTypes.func,
    onError: PropTypes.func,
    renderNode: PropTypes.func,
    modeInfo: PropTypes.object,
    shouldShowLoadingIndicator: PropTypes.bool,
    alignCenter: PropTypes.bool,
    shouldForceInline: PropTypes.bool,
    forceMark: PropTypes.bool,
    imagePaddingOffset: PropTypes.number,
    style: PropTypes.object
  }

  public static defaultProps = {
    onLinkPress: onDeepLinkPress,
    onImageLongPress: url => Linking.openURL(url),
    onError: console.error.bind(console),
    modeInfo: {},
    shouldShowLoadingIndicator: false,
    alignCenter: false,
    shouldForceInline: false,
    forceMark: false,
    imagePaddingOffset: 0,
    style: {}
  }

  mounted: boolean = false

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
    } else if (this.props.forceMark !== nextProps.forceMark) {
      this.startHtmlRender(nextProps.value, nextProps.forceMark)
    }
  }

  componentWillUnmount() {
    this.mounted = false
  }

  startHtmlRender(value, forceMark?: boolean) {
    if (!value) {
      this.setState({ element: null })
    }

    const { modeInfo } = this.props

    const editStyles = {
      blockquote: {
        backgroundColor: modeInfo.brighterLevelOne,
        paddingVertical: 6,
        paddingHorizontal: 6,
        margin: 10
      }
    }

    const opts = {
      linkHandler: this.props.onLinkPress,
      styles: Object.assign({}, baseStyles, this.props.stylesheet, editStyles),
      customRenderer: this.props.renderNode,
      imagePaddingOffset: this.props.imagePaddingOffset,
      modeInfo: this.props.modeInfo,
      shouldShowLoadingIndicator: this.props.shouldShowLoadingIndicator,
      alignCenter: this.props.alignCenter,
      onImageLongPress: this.props.onImageLongPress,
      shouldForceInline: this.props.shouldForceInline,
      forceMark: typeof forceMark !== 'undefined' ? forceMark : this.props.forceMark,
      imageArr: []
    }
    // 加一个空文字来将最开头的表情内联
    let target = (value || '').replace(urlMapper, urlExtractor)

    if (target.indexOf('<img src="https://psnine.com/Upload/face/') === 0) {
      target = '<span/>' + target
    }
    htmlToElement(target, opts, (err, element) => {
      // console.log(opts.imageArr)
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
    // console.log(this.props.forceMark)
    if (this.state.element) {
      const alignSelf = this.props.alignCenter ? { justifyContent: 'center' } : {}
      Object.assign(alignSelf, { flexDirection: 'column', flexWrap: 'wrap' })
      return <TargetView children={this.state.element} style={[this.props.style, this.props.shouldForceInline ? null : alignSelf]} />
    }
    return <TargetView style={this.props.style} />
  }

}

export default HtmlView