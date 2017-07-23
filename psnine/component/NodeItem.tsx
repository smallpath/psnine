import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableNativeFeedback
} from 'react-native'

let screen = Dimensions.get('window')
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = screen

export default class PhotoItem extends React.PureComponent {

  shouldComponentUpdate = (props, state) => {
    if (props.modeInfo.themeName !== this.props.modeInfo.themeName) return true
    return false
  }

  render() {
    const { modeInfo, onPress, rowData, navigation } = this.props

    return (
      <TouchableNativeFeedback
        useForeground={true}
        onPress={onPress}
        background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
      >
        <View style={{
          flex: -1, flexDirection: 'row', padding: 5, backgroundColor: modeInfo.backgroundColor,
          alignSelf: 'flex-start',
          alignContent: 'flex-end',
          backgroundColor: modeInfo.backgroundColor,
          flex: -1,
          padding: 4 }}>
          <Text style={{color: modeInfo.accentColor}}>{rowData.text}</Text>
        </View>
      </TouchableNativeFeedback>
    )
  }

}

const styles = StyleSheet.create({
  avatar: {
    width: 150,
    height: 150
  }
})
