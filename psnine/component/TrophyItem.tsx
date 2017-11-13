import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableNativeFeedback
} from 'react-native'
import Values from 'values.js'

import { FlatlistItemProp } from '../interface'

interface ExtendedProp extends FlatlistItemProp {
  ITEM_HEIGHT?: number
}

export default class extends React.PureComponent<ExtendedProp, {}> {

  _onRowPressed = () => {
    const { navigation, rowData } = this.props
    navigation.navigate('Trophy', {
      URL: rowData.href,
      title: rowData.title,
      rowData,
      type: 'trophy'
    })
  }

  render() {
    const { modeInfo, rowData } = this.props
    const backgroundColor = modeInfo.isNightMode ? new Values(rowData.backgroundColor).shade(60).hexString()  : rowData.backgroundColor
    const imageStyle: any = { flex: -1, flexDirection: 'row', alignSelf: 'center', paddingLeft: 2 }
    if (!rowData.time) {
      imageStyle.paddingVertical = 12
    }
    return (
      <TouchableNativeFeedback onPress={this._onRowPressed}>
        <View pointerEvents={'box-only'} style={{
          backgroundColor: backgroundColor || modeInfo.backgroundColor,
          flexDirection: 'row',
          padding: 0
        }}>
          <View pointerEvents='box-only' style={imageStyle as any}>
            <Image
              source={{ uri: rowData.banner.avatar }}
              style={[styles.avatar, { width: 91, height: 50 }]}
            />
          </View>
          <View pointerEvents='box-only' style={imageStyle as any}>
            <Image
              source={{ uri: rowData.avatar }}
              style={[styles.avatar, { width: 50, height: 50 }]}
            />
          </View>
          <View style={{ justifyContent: 'space-around', flex: 3, padding: 4 }}>
            <Text
              ellipsizeMode={'tail'}
              style={{ flex: -1, color: modeInfo.titleTextColor }}>
              {rowData.level && <Text style={{ marginHorizontal: 2, color: modeInfo.accentColor }}>{rowData.level + ' '}</Text> || undefined}
              {rowData.title}
              { rowData.translate && <Text style={{ color: modeInfo.standardTextColor, marginLeft: 2  }}>{' ' + rowData.translate}</Text> }
              { rowData.tip && <Text style={{ color: modeInfo.standardColor , fontSize: 12, marginLeft: 2 }}>{' ' + rowData.tip}</Text> }
            </Text>
            <Text
              ellipsizeMode={'tail'}
              style={{ flex: -1, color: modeInfo.titleTextColor }}>
              {rowData.translateText || rowData.text}
            </Text>
          </View>
          <View style={{ flex: 1, justifyContent: 'center', padding: 2 }}>
            <Text selectable={false}
              style={{
                flex: -1,
                textAlign: 'center',
                textAlignVertical: 'center',
                color: modeInfo.titleTextColor }}>{rowData.rare}</Text>
            <Text
              ellipsizeMode={'tail'}
              style={{
                flex: -1,
                color: modeInfo.standardTextColor,
                textAlign: 'center',
                textAlignVertical: 'center',
                fontSize: 10
              }}>{rowData.rare ? '珍稀度' : ''}</Text>
              { rowData.time && (
                  <View style={{ flex: 1, justifyContent: 'center', padding: 2 }}>
                    <Text selectable={false} style={{
                      flex: -1,
                      color: modeInfo.okColor,
                      textAlign: 'center',
                      textAlignVertical: 'center',
                      fontSize: 10
                    }}>{rowData.time}分</Text>
                  </View>
                )
              }
          </View>
        </View>
      </TouchableNativeFeedback>
    )
  }

}

const styles = StyleSheet.create({
  avatar: {
    width: 50,
    height: 50
  }
})
