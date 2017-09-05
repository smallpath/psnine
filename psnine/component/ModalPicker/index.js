import React from 'react'
import {
  ToastAndroid,
  View,
  Animated,
  Easing,
  StatusBar,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActionSheetIOS,
  Dimensions
} from 'react-native'

declare var global

export default class PickerIOSItem extends React.Component<any, any> {
  constructor(props) {
    super(props)
  }

  actionSheet = () => {
    const { data, onChange } = this.props
    ActionSheetIOS.showActionSheetWithOptions({
      options: data.map(item => item.label).concat('取消'),
      cancelButtonIndex: data.length,
      title: '选择操作'
    }, (index) => {
      if (index !== data.length) {
        onChange(data[index])
      }
    })
  }

  render() {
    const { data, initValue } = this.props
    // const color = modeInfo.backgroundColor
    const style: any = StyleSheet.flatten(this.props.style)
    const { color } = style
    return (
      <TouchableOpacity onPress={this.actionSheet} style={[{flex: 1}, style]}>
        <View style={{margin:2}}>
          <Text numberOfLines={1} ellipsizeMode='tail' style={{
            color,
            fontSize: 15,
            textAlign: 'center',
            textAlignVertical: 'center'
          }}>{initValue}</Text>
          <global.Icons style={{
            position: 'absolute',
            right: 8,
            top: 0,
            bottom: 0
          }} name='md-arrow-dropdown' size={20} color={color} />
        </View>
      </TouchableOpacity>
    )
  }
}
