import React from 'react'
import {
  StyleSheet,
  View,
  Image,
  Dimensions,
  TouchableNativeFeedback
} from 'react-native'

import { FlatlistItemProp } from '../interface'

interface ExtendedProp extends FlatlistItemProp {
  width: number

}
export default class PhotoItem extends React.PureComponent<ExtendedProp> {

  shouldComponentUpdate(props) {
    if (props.modeInfo.themeName !== this.props.modeInfo.themeName) return true
    return false
  }

  onPress = () => {
    const { rowData, navigation } = this.props
    navigation.navigate('NewGame', {
      URL: `${rowData.href}?page=1`
    })
  }

  render() {
    const { width: SCREEN_WIDTH } = Dimensions.get('window')
    let { modeInfo, rowData, width = ( SCREEN_WIDTH - 14 ) / 3 } = this.props
    width = width / modeInfo.numColumns
    return (
      <TouchableNativeFeedback
        useForeground={true}
        onPress={this.onPress}
        background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
      >
        <View style={{
          flex: -1, flexDirection: 'row',
          alignSelf: 'flex-start',
          alignContent: 'flex-end',
          backgroundColor: modeInfo.backgroundColor,
          width: width,
          height: width
        }}>
          <Image
            source={{ uri: rowData.img || rowData.href }}
            style={[styles.avatar, { width: width, height: width }]}
          />
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
