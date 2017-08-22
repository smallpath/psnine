import React, { Component } from 'react'
import NestedScrollView from 'react-native-nested-scrollview'
import Share from 'react-native-share'
import LinearGradient from 'react-native-linear-gradient'
import Icons from 'react-native-vector-icons/Ionicons'
import Snackbar from 'react-native-snackbar'

import HTMLView from '../component/HTMLView'
import MyDialog from '../component/Dialog'

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
      <ActivityIndicator  {...props}/>
    )
  }
}

class ToolbarAndroid extends Component<any, any> {
  constructor(props) {
    super(props)
  }

  render() {
    return null
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

if (isIOS) {
  Object.defineProperty(ReactNative, 'DrawerLayoutAndroid', {
    get() {
      return DrawerLayout
    }
  })
  Object.defineProperty(ReactNative, 'ToolbarAndroid', {
    get() {
      return ToolbarAndroid
    }
  })
  Object.defineProperty(ReactNative, 'ActivityIndicator', {
    get() {
      return IOSActivityIndicator
    }
  })
}
