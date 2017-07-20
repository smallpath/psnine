import NestedScrollView from 'react-native-nested-scrollview'

global.NestedScrollView = NestedScrollView

import Share from 'react-native-share'

global.Share = Share

import LinearGradient from 'react-native-linear-gradient'

global.LinearGradient = LinearGradient

import ReactNative, {
  Platform,
  TouchableNativeFeedback,
  TouchableOpacity,
  View,
} from 'react-native'

let TouchableComponent;

// if (Platform.OS === 'android') {
//   TouchableComponent = Platform.Version <= 20 ? TouchableOpacity : TouchableNativeFeedback;
// } else {
  TouchableComponent = TouchableOpacity;
// }

if (TouchableComponent !== TouchableNativeFeedback) {
  TouchableComponent.SelectableBackground = () => ({});
  TouchableComponent.SelectableBackgroundBorderless = () => ({});
  TouchableComponent.Ripple = (color, borderless) => ({});
}

ReactNative.TouchableNativeFeedback = TouchableOpacity

Object.defineProperty(ReactNative, 'TouchableNativeFeedback', {
  get: function () {
    return TouchableComponent
  }
})

console.log(ReactNative.TouchableNativeFeedback === TouchableOpacity)