import NestedScrollView from 'react-native-nested-scrollview'
import Share from 'react-native-share'
import LinearGradient from 'react-native-linear-gradient'

global.NestedScrollView = NestedScrollView
global.Share = Share
global.LinearGradient = LinearGradient

import ReactNative, {
  Platform,
  TouchableNativeFeedback,
  TouchableOpacity,
  View
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
  TouchableComponent.Ripple = (color, borderless) => ({})
}

ReactNative.TouchableNativeFeedback = TouchableOpacity

Object.defineProperty(ReactNative, 'TouchableNativeFeedback', {
  get: function () {
    return TouchableComponent
  }
})