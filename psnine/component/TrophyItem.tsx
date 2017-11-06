import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableNativeFeedback
} from 'react-native'

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
    return (
      <TouchableNativeFeedback onPress={this._onRowPressed}>
        <View pointerEvents={'box-only'} style={{
          backgroundColor: modeInfo.backgroundColor,
          flexDirection: 'row',
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: modeInfo.brighterLevelOne,
          padding: 0
        }}>
          <View pointerEvents='box-only' style={{ flex: -1, flexDirection: 'row', padding: 12, backgroundColor: rowData.backgroundColor }}>
            <Image
              source={{ uri: rowData.avatar }}
              style={[styles.avatar, { width: 54, height: 54 }]}
            />
          </View>
          <View style={{ justifyContent: 'space-around', flex: 3, padding: 4 }}>
            <Text
              ellipsizeMode={'tail'}
              style={{ flex: -1, color: modeInfo.titleTextColor }}>
              {rowData.level && <Text style={{ marginHorizontal: 2, color: modeInfo.accentColor }}>{rowData.level}</Text> || undefined}
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
          { rowData.time && (
              <View style={{ flex: 1, justifyContent: 'center', padding: 2 }}>
                <Text selectable={false} style={{
                  flex: -1,
                  color: modeInfo.okColor,
                  textAlign: 'center',
                  textAlignVertical: 'center',
                  fontSize: 10
                }}>{rowData.time}</Text>
              </View>
            )
          }
          <View style={{ flex: 0.8, justifyContent: 'center', padding: 2 }}>
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
              }}>{rowData.rare ? '珍惜度' : ''}</Text>
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
