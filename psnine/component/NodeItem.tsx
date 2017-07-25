import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableNativeFeedback
} from 'react-native'

import { FlatlistItemProp } from '../interface'

export default class PhotoItem extends React.PureComponent<FlatlistItemProp> {

  render() {
    const { modeInfo, onPress, rowData } = this.props

    return (
      <TouchableNativeFeedback
        useForeground={true}
        onPress={onPress}
        background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
      >
        <View style={{
          flexDirection: 'row',
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
