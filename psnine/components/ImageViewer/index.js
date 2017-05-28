import React, { Component } from 'react';
import ImageViewer from 'react-native-image-zoom-viewer';

export default class extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <ImageViewer imageUrls={this.props.navigation.state.params.images} />
    )
  }
}