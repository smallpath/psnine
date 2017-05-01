import React, { Component } from 'react';
import {
  StyleSheet,
  Image,
  Dimensions,
  Text,
  PixelRatio
} from 'react-native';

var { width } = Dimensions.get('window')

var pixelRate = PixelRatio.get()

var baseStyle = {
  backgroundColor: 'transparent'
}

class ResizableImage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      width: this.props.style.width || 1,
      height: this.props.style.height || 1
    }
  }


  componentDidMount = () => {
    if (this.props.style.width || this.props.style.height) {
      return
    }
    Image.getSize(this.props.source.uri, (w, h) => {
      // if (w === 33 && h === 30) h = 36 // why alu emotion size is incorrect ??
      if (w < 40 && h < 40) {
        w = w * pixelRate /1.5
        h = h * pixelRate /1.5
      }
      this.setState({
        width: w, 
        height: h
      })
    }, (err) => {
      this.setState({
        width: 0, 
        height: 0
      })
    })
  }

  render() {
    var finalSize = {}
    const maxWidth = width - this.props.source.imagePaddingOffset
    if (this.state.width > maxWidth * pixelRate) {
      finalSize.width = maxWidth * pixelRate
      var ratio = maxWidth * pixelRate / this.state.width
      finalSize.height = this.state.height * ratio
    }
    var style = Object.assign(baseStyle, this.props.style, this.state, finalSize)
    var source = {
      alignSelf: 'center'
    }
    if (!finalSize.width || !finalSize.height) {
      source = Object.assign(source, this.props.source, this.state)
    } else {
      source = Object.assign(source, this.props.source, finalSize)
    }

    // what happened ?  why the size is reversed?
    const tmep = source.width
    source.width = source.height
    source.height = tmep

    return (
      <Image
        resizeMode={'contain'}
        key={`${source.width}:${source.height}`}
        source={source} />
    )
  }
}

module.exports = ResizableImage