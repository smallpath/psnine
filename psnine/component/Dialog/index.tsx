import React, { Component } from 'react'
import {
  View,
  Dimensions,
  TouchableNativeFeedback,
  Modal
} from 'react-native'

class Dialog extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const { modeInfo, renderContent, onRequestClose, onDismiss } = this.props
    const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')
    return (
      <Modal
        animationType={'fade'}
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

export default Dialog
