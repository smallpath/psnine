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
import Values from 'values.js'

import ReactNative, {
  Platform,
  TouchableNativeFeedback,
  ScrollView,
  TouchableOpacity,
  ProgressViewIOS
} from 'react-native'

const { ActivityIndicator } = ReactNative

const isIOS = Platform.OS === 'ios'

declare var global

Object.assign(global, {
  NestedScrollView: isIOS ? ScrollView : NestedScrollView,
  Share,
  LinearGradient,
  HTMLView,
  MyDialog,
  Icons,
  Snackbar,
  isIOS
})

class ExtendedTouchableOpacity extends Component<any, any> {
  constructor(props) {
    super(props)
  }

  render() {
    return <TouchableOpacity {...this.props} delayPressIn={140} />
  }
}

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
  TouchableComponent = Platform.Version <= 20 ? ExtendedTouchableOpacity : TouchableNativeFeedback
} else {
  TouchableComponent = ExtendedTouchableOpacity
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

    return (
      <ModalPicker
        title={prompt}
        data={data}
        initValue={valueLabel[selectedValue]}
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

class ProgressBarIOS extends React.Component<any, any> {
  constructor(props) {
    super(props)
  }

  render() {
    const { color, progress, style } = this.props
    const tintColor = new Values(color)
    return (
      <ProgressViewIOS style={style} progress={progress}
        progressTintColor={color} trackTintColor={tintColor.tint(75).hexString()} progressViewStyle={'bar'}/>
    )
  }
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
    },
    'ProgressBarAndroid': {
      get() {
        return ProgressBarIOS
      }
    }
  })
}
