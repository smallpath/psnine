import React, { Component } from 'react'
import NestedScrollView from 'react-native-nested-scrollview'
import Share from 'react-native-share'
import LinearGradient from 'react-native-linear-gradient'
import Icons from 'react-native-vector-icons/Ionicons'
import Snackbar from 'react-native-snackbar'

import HTMLView from '../component/HTMLView'
import MyDialog from '../component/Dialog'
import ToolbarIOS from '../component/ToolbarIOS'
import ModalPicker from '../component/ModalPicker'

import ReactNative, {
  Platform,
  TouchableNativeFeedback,
  ScrollView,
  TouchableOpacity
} from 'react-native'

const { ActivityIndicator } = ReactNative

const isIOS = Platform.OS === 'ios'

Object.assign(global, {
  NestedScrollView: isIOS ? ScrollView : NestedScrollView,
  Share,
  LinearGradient,
  HTMLView,
  MyDialog,
  Icons,
  Snackbar
})

class IOSActivityIndicator extends Component<any, any> {
  constructor(props) {
    super(props)
  }

  render() {
    const { size, ...props } = this.props
    return (
      <ActivityIndicator  {...props} />
    )
  }
}

let TouchableComponent

if (!isIOS) {
  TouchableComponent = Platform.Version <= 20 ? TouchableOpacity : TouchableNativeFeedback
} else {
  TouchableComponent = TouchableOpacity
}

if (TouchableComponent !== TouchableNativeFeedback) {
  TouchableComponent.SelectableBackground = () => ({})
  TouchableComponent.SelectableBackgroundBorderless = () => ({})
  TouchableComponent.Ripple = () => ({})
}

Object.defineProperty(ReactNative, 'TouchableNativeFeedback', {
  get: function () {
    return TouchableComponent
  }
})

import DrawerLayout from 'react-native-drawer-layout'

class PickerIOS extends Component<any, any> {
  constructor(props) {
    super(props)
  }

  render() {
    const { style, prompt = '', selectedValue, onValueChange, children = [] } = this.props
    // console.log(Object.keys(children[0]), children[0].props, 'hehe ===>')
    const arr = children.length ? children.map(item => (item as any).props).slice() : []
    const data = arr.map(item => {
      return {
        value: item.value,
        label: item.label,
        key: item.label,
        color: item.color
      }
    })
    const valueLabel = arr.reduce((prev, curr) => {
      prev[curr.value] = curr.label
      return prev
    }, {})
    const { borderWidth, ...targetStyle } = style
    const head = prompt as any === '选择'
    const text = head ? '' : prompt.replace('选择', '') + ':'
    const previousValue = valueLabel[selectedValue] || ''
    const initValue = previousValue.includes(text) ? previousValue : text + previousValue
    return (
      <ModalPicker
        data={data}
        initValue={initValue}
        style={targetStyle}
        selectedStyle={targetStyle}
        onChange={(option) => {
          onValueChange(option.value)
         }} />
    )
  }
}

PickerIOS.Item = class extends Component<any, any> {
  render() { return null }
}

if (isIOS) {
  Object.defineProperties(ReactNative, {
    'DrawerLayoutAndroid': {
      get() {
        return DrawerLayout
      }
    },
    'ToolbarAndroid': {
      get() {
        return ToolbarIOS
      }
    },
    'ActivityIndicator': {
      get() {
        return IOSActivityIndicator
      }
    },
    'Picker': {
      get() {
        return PickerIOS
      }
    }
  })
}
