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


export default class TradeItem extends React.PureComponent {
  shouldComponentUpdate = (props) => props.modeInfo.isNightMode !== this.props.modeInfo.isNightMode
  
  _onRowPressed = (rowData) => {
    const { navigation } = this.props;
    const URL = getBattleURL(rowData.id);
    navigation.navigate('TradeTopic', {
      URL: rowData.href,
      title: rowData.title,
      rowData,
      type: 'trade',
      shouldBeSawBackground: true
    })
  }


  render = () => {
    // console.log(rowData)
    const { modeInfo, rowData } = this.props
    let TouchableElement = TouchableNativeFeedback;

    let imageArr = rowData.thumbs;
    let type = rowData.type;

    const imageItems = imageArr.map((value, index) => (<Image key={rowData.id + '' + index} source={{ uri: value }} style={styles.geneImage} />));

    return (
      <View style={{
        marginVertical: 3.5,
        backgroundColor: modeInfo.backgroundColor,
        elevation: 1
      }}>
        <TouchableNativeFeedback
          onPress={() => { this._onRowPressed(rowData) }}
          delayPressIn={100}
          background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
        >
          <View style={{ flex: 1, flexDirection: 'row', padding: 12 }}>
            <Image
              source={{ uri: rowData.avatar }}
              style={styles.avatar}
            />

            <View style={{ marginLeft: 10, flex: 1, flexDirection: 'column', }}>

              <View style={{ flex: 1, flexDirection: 'row', padding: 2 }}>
                <Text
                  ellipsizeMode={'tail'}
                  numberOfLines={2}
                  style={{ flex: -1, color: modeInfo.titleTextColor, }}>
                  {rowData.title}
                </Text>
                <Text style={{ fontSize: 12, flex: -1, color: modeInfo.standardTextColor, textAlign: 'center', textAlignVertical: 'center' }}>{rowData.price}</Text>
              </View>

              <Text
                style={{ flex: -1, color: modeInfo.standardTextColor, fontSize: 12 }}>
                {rowData.content}
              </Text>
              <View style={{ flex: -1, flexDirection: 'row', flexWrap: 'wrap', marginTop: 5, marginBottom: 5 }}>
                {imageItems}
              </View>
              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', }}>
                <Text style={{ fontSize: 12, flex: -1, color: idColor, textAlign: 'center', textAlignVertical: 'center' }} onPress={
                  () => {
                    this.props.navigation.navigate('Home', {
                      title: rowData.psnid,
                      id: rowData.psnid,
                      URL: `http://psnine.com/psnid/${rowData.psnid}`
                    })
                  }
                }>{rowData.psnid}</Text>
                <Text style={{ fontSize: 12, flex: -1, color: modeInfo.standardTextColor, textAlign: 'center', textAlignVertical: 'center' }}>{rowData.date}</Text>
                <Text style={{ fontSize: 12, flex: -1, color: modeInfo.standardTextColor, textAlign: 'center', textAlignVertical: 'center' }}>{rowData.count}</Text>
                <Text style={{ fontSize: 12, flex: -1, color: modeInfo.standardTextColor, textAlign: 'center', textAlignVertical: 'center' }}>{rowData.circle}</Text>
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
