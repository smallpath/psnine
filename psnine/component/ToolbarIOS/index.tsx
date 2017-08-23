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

export default class ToolbarIOS extends React.Component<any, any> {
  constructor(props) {
    super(props)
  }

  renderActions({
    backgroundColor,
    shouldShow,
    shouldNotShow
  }) {
    const { onActionSelected, iconColor: color } = this.props

    return (
      <View style={{flexDirection: 'row', marginTop: 2, position: 'absolute', right: 0}}>
        {shouldShow.map((item, index) => {
          return (
            <TouchableOpacity key={index} onPress={() => onActionSelected(item.index)}>
              <View style={{padding: 15, width: 50, alignItems: 'center'}}>
                <global.Icons name={item.iconName} size={20} color={color} />
              </View>
            </TouchableOpacity>
          )
        })}
        {shouldNotShow.length !== 0 && (
          <TouchableOpacity onPress={() => this.actionSheet(shouldNotShow, onActionSelected)}>
            <View style={{padding: 15, width: 50, alignItems: 'center'}}>
              <global.Icons name='md-more' size={20} color={color} />
            </View>
          </TouchableOpacity>
        )}
      </View>
    )
  }

  actionSheet = (arr, onActionSelected) => {
    ActionSheetIOS.showActionSheetWithOptions({
      options: arr.map(item => item.title).concat('取消'),
      cancelButtonIndex: arr.length,
      title: '选择操作'
    }, (index) => {
      if (index !== arr.length) {
        onActionSelected(arr[index].index)
      }
    })
  }

  render() {
    const { children, navIconName, onIconClicked, iconColor: color, title, actions = [], subtitle, subtitleColor } = this.props
    // const color = modeInfo.backgroundColor
    const style: any = StyleSheet.flatten(this.props.style)
    const shouldShow = actions.map((item, index) => (item.index = index, item)).filter(item => item.show !== 'never')
    const shouldNotShow = actions.map((item, index) => (item.index = index, item)).filter(item => item.show === 'never')
    const maxWidth = Dimensions.get('window').width - 20 - 15 - 30 - shouldShow.length * 50 - (shouldNotShow.length === 0 ? 0 : 1) * 50
    const childrenStyle: any = { zIndex: -1, position: 'absolute', left: 80, top: 3 }
    if (!subtitle) { delete childrenStyle.position; delete childrenStyle.left; delete childrenStyle.top; childrenStyle.marginLeft = -12 }
    return (
      <View style={{
        height: 44 + 20,
        backgroundColor: style.backgroundColor
      }}>
        <View style={{
          height: 44,
          marginTop: 18,
          alignItems: 'center',
          flexDirection: 'row'
        }}>
          <TouchableOpacity onPress={onIconClicked}>
            <View style={{padding: 15, marginRight: 30, marginTop: 2, width: 50, alignItems: 'center'}}>
              <global.Icons name={navIconName} size={20} color={color}/>
            </View>
          </TouchableOpacity>
            { children || (
              <View style={[childrenStyle]}>
                <Text numberOfLines={1} ellipsizeMode='tail' style={{color, fontSize: 20,
                fontWeight: '500', maxWidth }}>{title}</Text>
                { subtitle && <Text numberOfLines={1} ellipsizeMode='tail' style={{color: subtitleColor || color, fontSize: 14,
                fontWeight: '300', maxWidth }}>{subtitle}</Text> || undefined }
              </View>
            )}
          {this.renderActions({
            backgroundColor: style.backgroundColor,
            shouldNotShow,
            shouldShow
          })}
        </View>
      </View>
    )
  }
}
