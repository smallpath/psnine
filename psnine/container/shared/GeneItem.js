import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableNativeFeedback,
  InteractionManager,
  ActivityIndicator,
  StatusBar,
  Animated,
  Easing,
  FlatList,
  PanResponder,
  Modal,
  Keyboard
} from 'react-native';

import HTMLView from '../../components/HtmlToView';
import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { standardColor, nodeColor, idColor, accentColor } from '../../constants/colorConfig';

import { getHomeURL } from '../../dao';

import {
  getGamePointAPI,
  getTopicURL
} from '../../dao'
import { getGeneURL } from '../../dao';

let screen = Dimensions.get('window');
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = screen;

export default class extends React.PureComponent {

  shouldComponentUpdate = (props) => props.modeInfo.isNightMode !== this.props.modeInfo.isNightMode

  _onRowPressed = (rowData) => {
    const { navigation } = this.props;
    const URL = getGeneURL(rowData.id);
    navigation.navigate('CommunityTopic', {
      URL,
      title: rowData.title,
      rowData,
      type: 'gene',
      shouldBeSawBackground: true
    })
  }

  render = () => {
    const { modeInfo, rowData } = this.props
    let TouchableElement = TouchableNativeFeedback;

    let imageArr = rowData.thumbs;
    let type = rowData.type;

    const imageItems = imageArr.map((value, index) => (<Image key={rowData.id + '' + index} source={{ uri: value }} style={styles.geneImage} />));

    return (
      <View style={{
        marginTop: 3.5,
        marginHorizontal: 7,
        marginBottom: 3.5,
        backgroundColor: modeInfo.backgroundColor,
        elevation: 2
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
              <Text
                style={{ flex: -1, color: modeInfo.titleTextColor, }}>
                {rowData.content}
              </Text>
              <View style={{ flex: -1, flexDirection: 'row', flexWrap: 'wrap', marginTop: 5, marginBottom: 5 }}>
                {imageItems}
              </View>
              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', }}>
                <Text style={{ fontSize: 12, flex: -1, color: idColor, textAlign: 'center', textAlignVertical: 'center' }} onPress={
                  () => {
                    this.props.screenProps.navigation.navigate('Home', {
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
  },
  geneImage: {
    margin: 3,
    width: 100,
    height: 100
  }
});