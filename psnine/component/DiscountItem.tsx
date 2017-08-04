import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableNativeFeedback,
  Dimensions
} from 'react-native'

import { FlatlistItemProp, FlatlistItemState } from '../interface'

declare var global

interface ExtendedProp extends FlatlistItemProp {
  ITEM_HEIGHT?: number,
  shouldMargin?: boolean
}

export default class extends React.PureComponent<ExtendedProp, FlatlistItemState> {
  _onRowPressed = (rowData) => {
    const { navigation } = this.props
    const id = rowData.id || parseInt(rowData.url.split('/').pop(), 10)
    const URL = rowData.type === 'outter' ?
      'http://psnine.com/dd/' + id :
      'http://psnine.com/topic/' + id
    navigation.navigate(rowData.type === 'outter' ? 'DiscountTopic' : 'CommunityTopic', {
      URL,
      title: rowData.title,
      rowData,
      type: 'community',
      shouldBeSawBackground: true
    })
  }

  render() {
    const { modeInfo, rowData, shouldMargin = true } = this.props
    const content = rowData.content
    const { width: SCREEN_WIDTH } = Dimensions.get('window')
    return (
      <View style={{
        marginVertical: shouldMargin ? 3.5 : 0,
        backgroundColor: modeInfo.backgroundColor,
        elevation: shouldMargin ? 1 : 0,
        /* height: ITEM_HEIGHT - (shouldMargin ? 7 : 0), */
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 5
      }}>
        <TouchableNativeFeedback
          onPress={() => { this._onRowPressed(rowData) }}
          background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
        >
          <View style={{ flex: -1, flexDirection: 'row', padding: 5, paddingHorizontal: 10,
          marginLeft: 10,justifyContent: 'space-between', alignItems: 'center' }}>
            <View style={{
              width: 120,
              flexDirection: 'column',
              paddingLeft: 10,
              justifyContent: 'center',
              alignItems: 'center'
            }}>
              <Image
                source={{ uri: rowData.avatar }}
                style={{
                  width: 120,
                  height: 120
                }}
              />
              <View style={{
                position: 'absolute',
                top: 0,
                flex: -1,
                right: -5,
                flexDirection: 'row',
                backgroundColor: modeInfo.standardColor,
                zIndex: 2  }}>
                <Text style={{ flex: -1, color: modeInfo.titleTextColor, padding: 2, paddingHorizontal: 4 }}>
                  {rowData.price}
                </Text>
              </View>
              <View style={{
                position: 'absolute',
                bottom: 10,
                flex: -1,
                left: 0,
                flexDirection: 'row',
                marginLeft: 5,
                backgroundColor: modeInfo.accentColor,
                zIndex: 2  }}>
                <Text style={{ flex: -1, color: modeInfo.titleTextColor, padding: 2, paddingHorizontal: 4 }}>
                  {rowData.platform}
                </Text>
              </View>
            </View>
            <View style={{ padding: 15, flexDirection: 'column',
              justifyContent: 'center', alignItems: 'center',
              maxWidth: SCREEN_WIDTH - 120,
              flexWrap: 'nowrap'
             }}>
            <View style={{
                position: 'absolute',
                top: rowData.type === 'outter' ? 40 : 0,
                flex: -1,
                right: rowData.type === 'outter' ? 10 : 0,
                flexDirection: 'row',
                backgroundColor: rowData.isOff === '进行中' ? modeInfo.accentColor : modeInfo.tintColor,
                zIndex: 2  }}>
                <Text style={{ flex: -1, color: modeInfo.titleTextColor, padding: 2, paddingHorizontal: 4 }}>
                  {rowData.isOff}
                </Text>
              </View>
              <global.HTMLView
                value={content}
                modeInfo={modeInfo}
                stylesheet={styles}
                onImageLongPress={() => {}}
                imagePaddingOffset={30 + 85 + 10}
                shouldForceInline={true}
              />
            </View>
          </View>
        </TouchableNativeFeedback>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  avatar: {
    width: 50,
    height: 50
  }
})
