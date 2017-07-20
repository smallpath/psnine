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

  shouldComponentUpdate = (props) => props.modeInfo.themeName !== this.props.modeInfo.themeName

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
    const { numColumns = 1 } = modeInfo
    return (
      <TouchableNativeFeedback
        onPress={() => {
          this._onRowPressed(rowData)
        }}
        useForeground={true}
        background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
      >
        <View pointerEvents={'box-only'} style={{ 
          flex: 1, flexDirection: 'row', padding: 12,
          marginVertical: 3.5,
          marginHorizontal: numColumns === 1 ? 0 : 3.5,
          backgroundColor: modeInfo.backgroundColor,
          elevation: 1,
          flex: numColumns === 1 ? -1 : 1,
          height: ITEM_HEIGHT - 7
        }}>
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
              <Text selectable={false} style={{ flex: -1, color: modeInfo.standardColor, textAlign: 'center', textAlignVertical: 'center' }}>{rowData.platform}</Text>
              { rowData.region && <Text selectable={false} style={{ flex: -1, color: modeInfo.standardTextColor, textAlign: 'center', textAlignVertical: 'center' }}>{rowData.region}</Text> || undefined}
              { rowData.platium && <Text selectable={false} style={{ flex: -1, color: modeInfo.standardTextColor, textAlign: 'center', textAlignVertical: 'center' }}>{
                rowData.platium + rowData.gold + rowData.selver + rowData.bronze
              }</Text> || undefined}
            </View>

          </View>

        </View>
      </TouchableNativeFeedback>
    )
  }

}


const styles = StyleSheet.create({
  avatar: {
    width: 50,
    height: 50,
  }
});
