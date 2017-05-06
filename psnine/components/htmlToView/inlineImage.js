import React, { Component } from 'react';
import {
  StyleSheet,
  Image,
  Dimensions,
  ActivityIndicator,
  PixelRatio,
  View,
  TouchableNativeFeedback
} from 'react-native';

import { standardColor, nodeColor, idColor, accentColor } from '../../config/colorConfig';

const { width } = Dimensions.get('window')

const pixelRate = PixelRatio.get()

const baseStyle = {
  backgroundColor: 'transparent'
}

export default class InlineImage extends Component {
  constructor(props) {
    super(props)
    const maxWidth = width - this.props.source.imagePaddingOffset
    this.maxWidth = maxWidth * pixelRate
    this.state = {
      width: this.props.style.width * pixelRate,
      height: this.props.style.height * pixelRate,
      alignCenter: this.props.alignCenter || false
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentDidMount = () => {
    this.mounted = true
    if (this.props.style.width !== 0 && this.props.style.height !== 0) {
      return
    }
    Image.getSize(this.props.source.uri, (w, h) => {
      if (this.mounted !== false) {
        this.setState({
          width: w * pixelRate,
          height: h * pixelRate
        })
      }
    }, () => { })
  }

  render() {
    const finalSize = {}
    // console.log(this.state.width, this.maxWidth)
    if (this.state.width > this.maxWidth) {
      finalSize.width = this.maxWidth
      var ratio = this.maxWidth / this.state.width
      finalSize.height = this.state.height * ratio
    }
    const style = Object.assign({}, baseStyle, finalSize)
    let source = {}
    if (!finalSize.width || !finalSize.height) {
      source = Object.assign(source, this.props.source, this.state)
    } else {
      source = Object.assign(source, this.props.source, finalSize)
    }
    return (
      <Image
        resizeMode={'contain'}
        resizeMethod={'scale'}
        onError={(e) => { }}
        key={`${source.width}:${source.height}`}
        source={source}
        style={{
          width: source.width,
          height: source.height
        }}/>
    )
  }
}
