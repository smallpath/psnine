import React, { Component } from 'react'
import {
  Text,
  View
} from 'react-native'

import { TabViewAnimated, SceneMap } from 'react-native-tab-view'

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
    const routes: any = Emotions.map((item, index) => ({ key: index.toString(), title: item.text }))
    this.state = {
      index: 0,
      routes
    }
  }

  onIndexChange = index => this.setState({ index })

  shouldComponentUpdate(_, nextState) {
    if (nextState.index !== this.state.index) return true
    return false
  }

  renderScene = ({ route }) => {
    const { modeInfo } = this.props
    const item = Emotions[route.key]
    return (
      <View key={route.key}>
        <EmotionItem
          size={item.size || { width: 32, height: 32}}
          emotionList={item.emotions}
          onPress={this.props.onPress}
          modeInfo={modeInfo}
        />
      </View>
    )
  }

  render() {
    const { modeInfo } = this.props
    const { index } = this.state

    return (
      <View style={{
        height: viewPagerHeight
      }}>
        <TabViewAnimated style={{
          height: viewPagerHeight,
          flexDirection: 'row',
          backgroundColor: modeInfo.backgroundColor,
          alignItems: 'center',
          paddingHorizontal: 2,
          paddingVertical: 8
        }}
          navigationState={this.state}
          renderScene={this.renderScene}
          keyboardDismissMode={'on-drag'}
          onRequestChangeTab={this.onIndexChange}
          onIndexChange={this.onIndexChange}
        >
        </TabViewAnimated>
        <View style={{ flex: -1, justifyContent: 'center', alignItems: 'center', backgroundColor: modeInfo.backgroundColor }}>
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
