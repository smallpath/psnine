import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableNativeFeedback,
  ProgressBarAndroid
} from 'react-native'

import colorConfig, {
  getColorFromProgress,
  getLevelColorFromProgress,
  getContentFromTrophy
} from '../constant/colorConfig'

import { FlatlistItemProp } from '../interface'

interface ExtendedProp extends FlatlistItemProp {
  ITEM_HEIGHT: number
}

export default class extends React.PureComponent<ExtendedProp> {

  _onRowPressed = (rowData) => {
    const { navigation } = this.props
    navigation.navigate('GamePage', {
      URL: rowData.href,
      title: rowData.title,
      rowData,
      type: 'game'
    })
  }

  render() {
    const { modeInfo, rowData, ITEM_HEIGHT } = this.props
    const { numColumns = 1 } = modeInfo
    return (
      <TouchableNativeFeedback key={rowData.href}   onPress={() => this._onRowPressed(rowData)}>
        <View pointerEvents={'box-only'} style={{
          backgroundColor: modeInfo.backgroundColor,
          flexDirection: 'row',
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: modeInfo.brighterLevelOne,
          marginHorizontal: numColumns === 1 ? 0 : 3.5,
          padding: 0,
          height: ITEM_HEIGHT,
          flex: numColumns === 1 ? -1 : 1,
          alignItems: 'center'
        }}>

          <View style={{ flex: -1, flexDirection: 'row', padding: 6 }}>
            <Image
              source={{ uri: rowData.avatar }}
              style={[styles.avatar, { width: 91, height: 54 }]}
            />
          </View>
          <View style={{ justifyContent: 'center', flex: 3 }}>
            <View>
              <Text
                ellipsizeMode={'tail'}
                numberOfLines={1}
                style={{ flex: -1, color: modeInfo.titleTextColor }}>
                {rowData.title}
              </Text>
            </View>
            {rowData.platform && (
              <View><Text style={{ color: modeInfo.standardTextColor, marginLeft: 2  }}>{rowData.platform.join(' ')}</Text></View>
            ) || undefined}
            {rowData.syncTime && (<View style={{ flex: -1, flexDirection: 'row' }}>
                <Text style={{ color: modeInfo.standardTextColor , fontSize: 12, marginLeft: 2 }}>{rowData.syncTime + ' '}</Text>
                <Text selectable={false} style={{
                  flex: -1,
                  color: modeInfo.standardTextColor,
                  fontSize: 12
                }}>{ rowData.allTime ? '总耗时 ' : ''}</Text>
                <Text selectable={false} style={{
                  flex: -1,
                  fontSize: 12,
                  color: modeInfo.standardColor
                }}>{rowData.allTime}</Text>
              </View>) || undefined}
          </View>
          { rowData.alert && (
              <View style={{ flex: 1, justifyContent: 'center', padding: 2 }}>
                <Text selectable={false}
                  style={{
                    flex: -1,
                    textAlign: 'center',
                    textAlignVertical: 'center',
                    color: getLevelColorFromProgress(rowData.allPercent) }}>{rowData.alert}</Text>
                <Text
                  ellipsizeMode={'tail'}
                  style={{
                    flex: -1,
                    color: modeInfo.standardTextColor,
                    textAlign: 'center',
                    textAlignVertical: 'center',
                    fontSize: 10
                  }}>{rowData.allPercent}</Text>
              </View>
              ) || <View style={{ flex: 1 }}/>
            }
          <View style={{ flex: 1.5, justifyContent: 'center', padding: 2 }}>
            <Text selectable={false}
              style={{
                flex: -1,
                textAlign: 'center',
                textAlignVertical: 'center',
                color: modeInfo.titleTextColor }}>{rowData.percent}</Text>
            <ProgressBarAndroid color={getColorFromProgress(rowData.percent)}
              indeterminate={false}
              progress={parseInt(rowData.percent, 10) / 100}
              style={{flex: -1, height: 4}}
              styleAttr='Horizontal' />
            <Text
              ellipsizeMode={'tail'}
              style={{
                flex: -1,
                color: modeInfo.standardTextColor,
                textAlign: 'center',
                textAlignVertical: 'center',
                fontSize: 10
              }}>{getContentFromTrophy(rowData.trophyArr).map((item, index) => {
                return (
                  <Text key={index} style={{color: colorConfig['trophyColor' + (index + 1)]}}>
                    {item}
                  </Text>
                )
              })}</Text>
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
