import React, { Component, PropTypes } from 'react'
import htmlToElement from './htmlToElement'
import {
  Linking,
  StyleSheet,
  Text,
  View,
  ToastAndroid
} from 'react-native'

import { standardColor, nodeColor, idColor } from '../../constant/colorConfig';

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
    color: idColor,
  },
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
});

const urlMapper = /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|#|\&|-|\!)+)/igm

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
    } else if (this.props.forceMark !== nextProps.forceMark) {
      this.startHtmlRender(nextProps.value, nextProps.forceMark)
    }
  }

  componentWillUnmount() {
    this.mounted = false
  }

  startHtmlRender(value, forceMark) {
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
    let target = (value || '').replace(urlMapper, (...args) => {
      const preText = args.length >= 6 ? args[5][args[4] - 1] : 'ignore'
      const nextText = args.length >= 6 ? args[5].substring(args[4] + 0 + args[0].length, args[4] + 3 + args[0].length) : 'ignore'
      const shouldNotReplace = [`"`, `'`].includes(preText) || (nextText === '</a')
      if (shouldNotReplace) {
        // console.log('shouldNotReplace', args[0], nextText === '</a')
        return args[0]
      } else {
        // console.log('shouldReplace', args[0])
        return `<a href="${args[0]}">${args[0]}</a>`
      }
    })

    if (target.indexOf('<img src="http://photo.psnine.com/face/') === 0) {
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
  shouldForceInline: PropTypes.bool,
  forceMark: PropTypes.bool
}

HtmlView.defaultProps = {
  onLinkPress: (url, isGettingType) => {
    let targetURL = url.includes('d7vg.com') ? url.replace('d7vg.com', 'psnine.com') : url
    let baseURL = targetURL
    const reg = /^(https|http)\:\/\//
    let errMessage = ''
    let title = '打开网页'
    let type = 'general'
    const request = isGettingType ? () => { return {
      type, title, errMessage}
    } : (targetURL) => Linking.openURL(targetURL).catch(err => {
      ToastAndroid.show(errMessage || err.toString(), ToastAndroid.SHORT) 
      errHandler(err)
    })
    const errHandler = (err) => Linking.openURL(baseURL).catch(err => toast(errMessage || err.toString()))

    // 深度链接
    if (targetURL.includes('music.163.com')) {
      const matched = targetURL.match(/id\=(\d+)/)
      if (matched) {
        targetURL = `orpheus://song/${matched[1]}`
        errMessage = `打开网易云音乐失败 (id:${matched[1]})`
        type = 'music163'
        title = `网易云音乐: ${matched[1]}`
        return request(targetURL)
      }
    } else if (targetURL.includes('bilibili.com')) {
      let matched = targetURL.match(/aid\=(\d+)/)
      if (!matched) matched = targetURL.match(/\/video\/av(\d+)/)
      if (matched) {
        targetURL = `bilibili://video/${matched[1]}`
        errMessage = `打开B站视频失败 (av${matched[1]})`
        type = 'bilibili'
        title = `B站视频: av${matched[1]}`
        return request(targetURL)
      }
    }

    if (reg.exec(targetURL)) {
      const target = targetURL.replace(reg, 'p9://')
      return request(target)
    } else if (/^(.*?):\/\//.exec(targetURL)) {
      return request(targetURL)
    } else {
      const target = 'p9://psnine.com' + targetURL
      return request(target)
    }
  },
  onImageLongPress: url => Linking.openURL(url),
  onError: console.error.bind(console),
  modeInfo: {},
  shouldShowLoadingIndicator: false,
  alignCenter: false,
  shouldForceInline: false,
  forceMark: false
}

export default HtmlView