import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Modal
} from 'react-native';
import ImageViewer from 'react-native-image-zoom-viewer';

export default class extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    return (
      <ImageViewer imageUrls={this.props.images} />
    )
  }
}