import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableNativeFeedback
} from 'react-native'

let screen = Dimensions.get('window')
const { width: SCREEN_WIDTH } = screen
import { FlatlistItemProp } from '../interface'


export default class PhotoItem extends React.PureComponent<FlatlistItemProp> {

  onPress = () => {
    const { rowData, navigation } = this.props
    navigation.navigate('Trophy', {
      URL: rowData.href,
      title: '@' + rowData.psnid,
      rowData,
      type: 'trophy'
    })
  }

  render() {
    const { modeInfo, rowData, navigation } = this.props
    const width = (SCREEN_WIDTH - 19) / 2 / modeInfo.numColumns
    return (
      <TouchableNativeFeedback
        useForeground={true}

        onPress={this.onPress}
        background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
      >
        <View style={{
          flex: -1, flexDirection: 'row', padding: 2, 
          alignSelf: 'flex-start',
          alignContent: 'center',
          alignItems: 'center',
          backgroundColor: modeInfo.backgroundColor,
          height: 56,
          width: width
        }}>
          <Image
            source={{ uri: rowData.img || rowData.href }}
            style={[styles.avatar, { marginHorizontal: 2 }]}
          />
          <View style={{flex: 2}}>
            <Text numberOfLines={1} ellipsizeMode='tail' selectable={false} style={{
              flex: -1, color: modeInfo.standardColor, textAlign: 'center', textAlignVertical: 'center'
            }} onPress={() => {
                // this.flatlist.getNode().recordInteraction()
                navigation.navigate('Home', {
                  title: rowData.psnid,
                  id: rowData.psnid,
                  URL: `https://psnine.com/psnid/${rowData.psnid}`
                })
              }}>{rowData.psnid}</Text>
            <Text numberOfLines={1} ellipsizeMode='tail' selectable={false} style={{
              flex: -1, color: modeInfo.standardTextColor, textAlign: 'center', textAlignVertical: 'center', fontSize: 12
            }}>{rowData.date}</Text>
          </View>
        </View>
      </TouchableNativeFeedback>
    )
  }

}

const styles = StyleSheet.create({
  avatar: {
    width: 48,
    height: 48
  }
})
