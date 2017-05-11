import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableNativeFeedback,
  ViewPagerAndroid,
  Modal,
  Image
} from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

import { standardColor, nodeColor, idColor } from '../../constants/colorConfig';

import Ionicons from 'react-native-vector-icons/Ionicons';

const viewPagerHeight = 180

class EmotionItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0
    }
  }

  render() {
    const { modeInfo, size, emotionList } = this.props
    const { index } = this.state
    const list = []
    const perPage = 60
    const maxLen = Math.ceil(emotionList.length / perPage)
    const { width: itemWidth, height: itemHeight } = size
    for (let i = 0; i < maxLen; i++) {

      const ImageList = []
      for (let j=0; j<perPage;j++) {
        const thisIndex = i * perPage + j
        if (thisIndex > emotionList.length - 1) break;
        const { text, url, width = 32, height = 32 } = emotionList[thisIndex]
        ImageList.push(
          <TouchableNativeFeedback key={`${i}:${j}`} onPress={() => {
              this.props.onPress && this.props.onPress({ text, url})
            }}>
            <View style={{
                width: width || itemWidth || 32,
                height: height || itemHeight || 32,
                margin: 1 
              }}>
              <Image
                resizeMethod={'scale'}
                resizeMode={'contain'}
                style={{
                  width: width || itemWidth || 32,
                  height: height || itemHeight || 32,
                  margin: 1 
                }}
                source={{ uri: url }} />
            </View>
          </TouchableNativeFeedback>
        )
      }

      list.push(
        <View key={`${i}`} style={{
          backgroundColor: modeInfo.backgroundColor,
          flexDirection: 'row',
          flexWrap: 'wrap'
        }}
        >
          {ImageList}
        </View>
      )
    }

    return (
      <View style={{
        height: viewPagerHeight
      }}>
        {list}
      </View>
    )
  }

}

const styles = StyleSheet.create({});

export default EmotionItem;
