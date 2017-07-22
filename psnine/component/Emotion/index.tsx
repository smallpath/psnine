import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableNativeFeedback,
  ViewPagerAndroid,
  Modal,
  Image,
  Button
} from 'react-native'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

import { standardColor, nodeColor, idColor } from '../constant/colorConfig'

import Ionicons from 'react-native-vector-icons/Ionicons'

import EmotionItem from './emotionItem'

import alu from './alu'
import majiang from './majiang'
import shoubing from './shoubing'

const Emotions = [
  alu,
  majiang,
  shoubing
]

const viewPagerHeight = 190

class Emotion extends Component {
  constructor(props) {
    super(props)
    this.state = {
      index: 0
    }
  }

  _onPageSelected = (event) => {
    let index = event.nativeEvent.position
    this.setState({
      index
    })
  }

  shouldComponentUpdate = (nextProp, nextState) => {
    if (nextState.index !== this.state.index) return true
    return false
  }

  render() {
    const { modeInfo } = this.props
    const { index } = this.state
    const list = []
    const length = Emotions.length

    const targetEmotions = Emotions[index]
    const targetItem =  Emotions.map((item, index) => (
      <View key={index}>
        <EmotionItem
          size={item.size || { width: 32, height: 32}}
          emotionList={item.emotions}
          onPress={this.props.onPress}
          modeInfo={modeInfo}
        />
      </View>
    ))

    const buttonList = Emotions.map((item, index) => {
      return (
        <View key={index} style={{flex: 1, backgroundColor: modeInfo.standardColor, marginLeft: 0, alignItems: 'center', justifyContent: 'center'}}>
          <TouchableNativeFeedback key={index} onPress={() => {
            this.setState({
              index
            })
          }}>
            <View style={{flex: 1, alignSelf: 'stretch'}}>
              <Text style={{
                flex: 1,
                color: modeInfo.titleTextColor,
                fontSize: 15,
                textAlign: 'center',
                textAlignVertical: 'center'
              }}>{item.text}</Text>
            </View>
          </TouchableNativeFeedback>
        </View>
      )
    })
    return (
      <View style={{
        height: viewPagerHeight
      }}>
        <ViewPagerAndroid style={{
          height: viewPagerHeight,
          flexDirection: 'row',
          backgroundColor: modeInfo.backgroundColor,
          alignItems: 'center',
          paddingHorizontal: 2,
          paddingVertical: 8
        }}
          ref={viewPager => { this.viewPage = viewPager }}
          keyboardDismissMode={'on-drag'}
          onPageSelected={this._onPageSelected}
          onPageScrollStateChanged={this.onPageScrollStateChanged}
          onPageScroll={this.onPageScroll}
        >
          {targetItem}
        </ViewPagerAndroid>
        <View style={{ flex: -1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{
            position: 'absolute',
            bottom: 5,
            fontSize: 15,
            textAlign: 'center',
            color: modeInfo.titleTextColor
          }}>{index + 1}/{Emotions.length}</Text>
        </View>
        {/*<View style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1
        }}>
          {buttonList}
        </View>*/}
      </View>
    )
  }

}

const styles = StyleSheet.create({})

export default Emotion
