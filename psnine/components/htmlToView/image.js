import React, { Component } from 'react';
import {
  StyleSheet,
  Image,
  Dimensions,
  ActivityIndicator,
  Text,
  PixelRatio,
  View,
  TouchableNativeFeedback
} from 'react-native';

import { standardColor, nodeColor, idColor, accentColor  } from '../../config/colorConfig';

const { width } = Dimensions.get('window')

const pixelRate = PixelRatio.get()

const baseStyle = {
  backgroundColor: 'transparent'
}

class ResizableImage extends Component {
  constructor(props) {
    super(props)
    const maxWidth = width - this.props.source.imagePaddingOffset
    this.maxWidth = maxWidth
    this.state = {
      width: this.props.style.width || maxWidth,
      height: this.props.style.height || (maxWidth / 16 * 9),
      isLoading: this.props.isLoading || true,
      alignCenter: this.props.alignCenter || false
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  componentDidMount = () => {
    this.mounted = true
    if (this.props.style.width || this.props.style.height) {
      this.setState({
        isLoading: false
      })
      return 
    }
    Image.getSize(this.props.source.uri, (w, h) => {
      if (this.mounted !== false) {
        this.setState({
          width: w, 
          height: h,
          isLoading: false
        })
      }
    }, () => {})
  }

  render() {
    const finalSize = {}
    const maxWidth = width - this.props.source.imagePaddingOffset
    if (this.state.width > maxWidth) {
      finalSize.width = maxWidth
      var ratio = maxWidth / this.state.width
      finalSize.height = this.state.height * ratio
    }
    const style = Object.assign(baseStyle, this.props.style, this.state, finalSize)
    let source = {
      alignSelf: 'center'
    }
    if (!finalSize.width || !finalSize.height) {
      source = Object.assign(source, this.props.source, this.state)
    } else {
      source = Object.assign(source, this.props.source, finalSize)
    }

    const alignSelf = this.state.alignCenter ? { alignContent: 'center' } : {}

    return (
      <TouchableNativeFeedback onLongPress={this.props.linkPressHandler} style={[{justifyContent:'center',alignItems:'center'}, alignSelf]}>
        <View style={{width: source.width, height: source.height}}>
          {
            this.state.isLoading &&           
            <ActivityIndicator 
              animating={true}                     
              style={{
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: 4,
                height: source.height,
                width: source.width
              }}
              color={accentColor}/>
          }
          { !this.state.isLoading &&                 
            <Image
              resizeMode={'contain'}
              onError={(e) => {}}
              key={`${source.width}:${source.height}`}
              source={source} />
          }
        </View>
      </TouchableNativeFeedback>
    )
  }
}

module.exports = ResizableImage