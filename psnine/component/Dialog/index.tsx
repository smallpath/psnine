import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableNativeFeedback,
  Modal
} from 'react-native';

import { standardColor, nodeColor, idColor } from '../../constant/colorConfig';

import Ionicons from 'react-native-vector-icons/Ionicons';

class Dialog extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { modeInfo, renderContent, onRequestClose, onDismiss } = this.props
    const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');
    return (
      <Modal
        animationType={"fade"}
        transparent={this.props.transparent || true}
        visible={this.props.modalVisible}
        onRequestClose={onRequestClose}
      >
        <TouchableNativeFeedback onPress={onDismiss}>
          <View style={{
            flex: -1,
            position: 'absolute',
            justifyContent: 'center',
            height: SCREEN_HEIGHT,
            width: SCREEN_WIDTH,
            alignItems: 'center',
            backgroundColor: '#000',
            opacity: this.props.backgroundOpacity || 0.1
          }} />
        </TouchableNativeFeedback>
        <View style={{
          flex: -1,
          justifyContent: 'center',
          height: SCREEN_HEIGHT,
          width: SCREEN_WIDTH,
          alignItems: 'center'
        }}>
          {renderContent()}
        </View>
      </Modal>
    )
  }

}

const styles = StyleSheet.create({});

export default Dialog;
