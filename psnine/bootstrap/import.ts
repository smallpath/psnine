import NestedScrollView from 'react-native-nested-scrollview'
import Share from 'react-native-share'
import LinearGradient from 'react-native-linear-gradient'
import Icons from 'react-native-vector-icons/Ionicons'

import HTMLView from '../component/HTMLView'
import MyDialog from '../component/Dialog'

Object.assign(global, {
  NestedScrollView,
  Share,
  LinearGradient,
  HTMLView,
  MyDialog,
  Icons
})

import ReactNative, {
  Platform,
  TouchableNativeFeedback,
  TouchableOpacity
} from 'react-native'

let TouchableComponent

if (Platform.OS === 'android') {
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