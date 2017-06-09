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
  Picker
} from 'react-native';

import { getGameUrl } from '../../dao';

import { standardColor, nodeColor, idColor } from '../../constants/colorConfig';


export default class BattleItem extends React.PureComponent {
  shouldComponentUpdate = (props) => props.modeInfo.isNightMode !== this.props.modeInfo.isNightMode
  
  _onRowPressed = (rowData) => {
    const { navigation } = this.props;
    const URL = getBattleURL(rowData.id);
    navigation.navigate('BattleTopic', {
      URL,
      title: rowData.title,
      rowData,
      type: 'battle',
      shouldBeSawBackground: true
    })
  }


  render = () => {
    // console.log(rowData)
    const { modeInfo, rowData } = this.props

    return (
      <View style={{
        marginLeft: 7,
        marginRight: 7,
        backgroundColor: modeInfo.backgroundColor,
        elevation: 2,
      }}>
        <TouchableNativeFeedback
          onPress={() => { this._onRowPressed(rowData) }}
          delayPressIn={100}
          background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
        >
          <View style={{ flex: -1, flexDirection: 'row', padding: 12 }}>
            <View style={{
              flex: 1,
              flexDirection: 'column',
              marginLeft: -2,
              alignSelf: 'center'
            }}>
              <Image
                source={{ uri: rowData.avatar }}
                style={{
                  width: 91,
                  height: 50,
                  alignSelf: 'center',
                }}
              />
              <Text style={{ flex: -1, color: idColor, textAlign: 'center', textAlignVertical: 'center' }}>{rowData.game}</Text>
            </View>
            <View style={{ marginLeft: 10, flex: 2, flexDirection: 'column' }}>
              <Text
                ellipsizeMode={'tail'}
                numberOfLines={1}
                style={{ flex: -1, color: modeInfo.titleTextColor, fontSize: 15 }}>
                {rowData.title}
              </Text>
              <Text>
                <Text style={{ flex: -1, color: modeInfo.titleTextColor }} numberOfLines={1}>{rowData.date}</Text>
                <Text style={{ flex: -1, color: modeInfo.standardTextColor }} numberOfLines={1}> 开始</Text>
              </Text>
              <Text>
                <Text style={{ flex: -1, color: modeInfo.titleTextColor }} numberOfLines={1}>{rowData.num}</Text>
                <Text style={{ flex: -1, color: modeInfo.standardTextColor }} numberOfLines={1}> 人招募</Text>
              </Text>
              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ flex: -1, color: modeInfo.standardTextColor, textAlign: 'center', textAlignVertical: 'center' }}>{rowData.platform.join(' ')}</Text>
                <Text style={{ flex: -1, color: idColor, marginRight: -60, textAlignVertical: 'center' }} onPress={
                () => {
                  this.props.screenProps.navigation.navigate('Home', {
                    title: rowData.psnid,
                    id: rowData.psnid,
                    URL: `http://psnine.com/psnid/${rowData.psnid}`
                  })
                }
              }>{rowData.psnid}</Text>
              </View>
            </View>
            <Image
              source={{ uri: rowData.gameAvatar }}
              style={[styles.avatar, { marginLeft: 10 }]}
            />
          </View>
        </TouchableNativeFeedback>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  avatar: {
    width: 50,
    height: 50,
  }
});
