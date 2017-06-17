import React, { Component } from 'react';
import ImageViewer from 'react-native-image-zoom-viewer';

export default class extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    const images = this.props.navigation.state.params.images
    if (images.length === 0) return null
    // console.log(typeof images[0].url)
    if (typeof images[0].url === 'object') {
      return <ImageViewer imageUrls={images[0].url.imageUrls} index={images[0].url.index} saveToLocalByLongPress={false} />
    }
    return (
      <ImageViewer imageUrls={images} saveToLocalByLongPress={false} />
    )
  }
}