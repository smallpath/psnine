import React, { Component } from 'react'
import {
  Text,
  View,
  ViewPagerAndroid
} from 'react-native'

import EmotionItem, { State } from './emotionItem'

import alu from './alu'
import majiang from './majiang'
import shoubing from './shoubing'

const Emotions: {
  text: string
  size?: {
    height: number
    width: number
  }
  emotions: any[]
}[] = [
  alu,
  majiang,
  shoubing
]

const viewPagerHeight = 190

interface Prop {
  modeInfo: any
  onPress: () => any

}

class Emotion extends Component<Prop, State> {
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

  shouldComponentUpdate(_, nextState) {
    if (nextState.index !== this.state.index) return true
    return false
  }

  render() {
    const { modeInfo } = this.props
    const { index } = this.state

    const targetItem =  Emotions.map((item, innerIndex) => (
      <View key={innerIndex}>
        <EmotionItem
          size={item.size || { width: 32, height: 32}}
          emotionList={item.emotions}
          onPress={this.props.onPress}
          modeInfo={modeInfo}
        />
      </View>
    ))

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
          keyboardDismissMode={'on-drag'}
          onPageSelected={this._onPageSelected}
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
      </View>
    )
  }

}

export default Emotion
