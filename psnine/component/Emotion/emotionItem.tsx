import React, { Component } from 'react'
import {
  View,
  TouchableNativeFeedback,
  Image
} from 'react-native'

const viewPagerHeight = 180

interface Props {
  modeInfo: any
  size: {
    width: number
    height: number
  }
  emotionList: any
  onPress: ({ text, url }) => any
}

export interface State {
  index: number
}

class EmotionItem extends Component<Props, State> {
  constructor(props) {
    super(props)
    this.state = {
      index: 0
    }
  }

  render() {
    const { modeInfo, size, emotionList } = this.props
    const list: any[] = []
    const perPage = 60
    const maxLen = Math.ceil(emotionList.length / perPage)
    const { width: itemWidth, height: itemHeight } = size
    for (let i = 0; i < maxLen; i++) {

      const ImageList: any[] = []
      for (let j = 0; j < perPage; j++) {
        const thisIndex = i * perPage + j
        if (thisIndex > emotionList.length - 1) break
        const { text, url, width = 32, height = 32 } = emotionList[thisIndex]
        ImageList.push(
          <TouchableNativeFeedback key={`${i}:${j}`} onPress={() => {
              this.props.onPress && this.props.onPress({ text, url })
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

export default EmotionItem
