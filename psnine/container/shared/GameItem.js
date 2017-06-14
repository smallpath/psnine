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


export default class extends React.PureComponent {

  shouldComponentUpdate = (props) => props.modeInfo.isNightMode !== this.props.modeInfo.isNightMode

  _onRowPressed = (rowData) => {
    const { navigation } = this.props;
    const URL = getGameUrl(rowData.id);
    navigation.navigate('GamePage', {
      // URL: 'http://psnine.com/psngame/5424?psnid=Smallpath',
      URL,
      title: rowData.title,
      rowData,
      type: 'game'
    })
  }

  render = () => {
    const { modeInfo, rowData, ITEM_HEIGHT } = this.props

    return (
      <View style={{
        marginTop: 7,
        backgroundColor: modeInfo.backgroundColor,
        elevation: 1,
        height: ITEM_HEIGHT - 7
      }}>
        <TouchableNativeFeedback
          onPress={() => {
            this._onRowPressed(rowData)
          }}
          useForeground={true}
          delayPressIn={0}
          background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
        >
          <View style={{ flex: 1, flexDirection: 'row', padding: 12 }}>
            <Image
              source={{ uri: rowData.avatar }}
              style={[styles.avatar, { width: 91 }]}
            />

            <View style={{ marginLeft: 10, flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
              <Text
                ellipsizeMode={'tail'}
                numberOfLines={3}
                style={{ color: modeInfo.titleTextColor, }}>
                {rowData.title}
              </Text>

              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text selectable={false} style={{ flex: -1, color: idColor, textAlign: 'center', textAlignVertical: 'center' }}>{rowData.platform}</Text>
                <Text selectable={false} style={{ flex: -1, color: modeInfo.standardTextColor, textAlign: 'center', textAlignVertical: 'center' }}>{rowData.region}</Text>
                <Text selectable={false} style={{ flex: -1, color: modeInfo.standardTextColor, textAlign: 'center', textAlignVertical: 'center' }}>{
                  rowData.platium + rowData.gold + rowData.selver + rowData.bronze
                }</Text>
              </View>

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
    height: 50,
  }
});
