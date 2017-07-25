import React from 'react'
import {
  View,
  ProgressBarAndroid
} from 'react-native'

import { ModeInfo } from '../interface'

interface ExtendedProp {
  isLoadingMore: boolean
  modeInfo: ModeInfo
}

export default class FooterProgress extends React.PureComponent<ExtendedProp, {}> {
  render() {
    return this.props.isLoadingMore ? (
      <View style={{flexDirection: 'row', flex: 1, height: 4, alignItems: 'flex-end'}}>
        <ProgressBarAndroid color={this.props.modeInfo.accentColor} style={{flex: 1,
          height: 40,
          marginBottom: -18,
          transform: [
            {
              rotateZ: '180deg'
            }
          ]
        }}  styleAttr='Horizontal'/>
        <ProgressBarAndroid style={{flex: 1, height: 40, marginBottom: -18}} color={this.props.modeInfo.accentColor} styleAttr='Horizontal' />
      </View>
    ) : (<View style={{flexDirection: 'row', flex: 1, height: 4, alignItems: 'flex-end'}}/>)
  }
}