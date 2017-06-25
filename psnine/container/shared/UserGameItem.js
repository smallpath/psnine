import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  Image,
  TouchableNativeFeedback,
  RefreshControl,
  InteractionManager,
  Picker,
  ProgressBarAndroid
} from 'react-native';

import { getGameUrl } from '../../dao';

import colorConfig, { standardColor, nodeColor, idColor,
  errorColor,
  warningColor,
  successColor,
  perfectColor,
  textWarningColor,
  textSuccessColor,
  textErrorColor,
  textPerfectColor
} from '../../constants/colorConfig';

const getColorFromProgress = (progress) => {
  const value = parseInt(progress)
  if (value < 25) return errorColor
  if (value < 50) return warningColor
  if (value < 75) return successColor
  return perfectColor
}

const getLevelColorFromProgress = (progress) => {
  const value = parseFloat(progress)
  if (value <= 5) return textErrorColor
  if (value <= 25) return textWarningColor
  if (value <= 60) return textSuccessColor
  return textPerfectColor
}

export default class extends React.PureComponent {

  shouldComponentUpdate = (props) => props.modeInfo.themeName !== this.props.modeInfo.themeName

  _onRowPressed = (rowData) => {
    const { navigation } = this.props
    navigation.navigate('GamePage', {
      URL: rowData.href,
      title: rowData.title,
      rowData,
      type: 'game'
    })
  }

  render = () => {
    const { modeInfo, navigation, rowData, ITEM_HEIGHT } = this.props
    const { numColumns = 1 } = modeInfo
    return (
      <TouchableNativeFeedback key={rowData.href || rowID}   onPress={() => this._onRowPressed(rowData)}>
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
                style={{ flex: -1, color: modeInfo.titleTextColor, }}>
                {rowData.title}
              </Text>
            </View>
            {rowData.platform && (<View><Text style={{ color: modeInfo.standardTextColor, marginLeft: 2  }}>{rowData.platform.join(' ')}</Text></View>) || undefined}
            {rowData.syncTime && (<View style={{ flex: -1, flexDirection: 'row' }}>
                <Text style={{ color: modeInfo.standardTextColor ,fontSize: 12, marginLeft: 2 }}>{rowData.syncTime + ' '}</Text>
                <Text selectable={false} style={{
                  flex: -1,
                  color: modeInfo.standardTextColor,
                  fontSize: 12
                }}>{ rowData.allTime ? '总耗时 ' : ''}</Text>
                <Text selectable={false} style={{
                  flex: -1,
                  fontSize: 12,
                  color: modeInfo.standardColor,
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
                    color: getLevelColorFromProgress(rowData.allPercent), }}>{rowData.alert}</Text>
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
              ) || undefined
            }
          <View style={{ flex: 1.5, justifyContent: 'center', padding: 2 }}>
            <Text selectable={false}             
              style={{ 
                flex: -1,             
                textAlign: 'center',
                textAlignVertical: 'center',
                color: modeInfo.titleTextColor, }}>{rowData.percent}</Text>
            <ProgressBarAndroid color={getColorFromProgress(rowData.percent)}
              indeterminate={false}
              progress={parseInt(rowData.percent)/100}
              style={{flex: -1, height: 4}}
              styleAttr="Horizontal" />
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

const getContentFromTrophy = text => {
  const item1 = text.split('金')[0]
  const item2 = text.split('银')[0].replace(item1, '')
  const item3 = text.split('铜')[0].replace(item1 + item2, '')
  const item4 = '铜' + text.split('铜').pop()
  return [
    item1,
    item2,
    item3,
    item4
  ]
}


const styles = StyleSheet.create({
  avatar: {
    width: 50,
    height: 50,
  }
});
