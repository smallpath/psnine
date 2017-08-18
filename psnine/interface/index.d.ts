import {
  TouchableNativeFeedbackProperties,
  PickerProperties,
  StyleProp,
  ViewStyle as NaniStyle,
  FlatListProperties
} from 'react-native'

interface ViewStyles extends NaniStyle {
  color?: string
}

declare module 'react-native' {
  interface TouchableNativeFeedbackProperties {
    useForeground?: boolean
  }
  interface FlatListProperties<ItemT> {
    windowSize?: number
    updateCellsBatchingPeriod?: number
    maxToRenderPerBatch?: number
    disableVirtualization?: boolean
    renderScrollComponent?: (props: ScrollViewProperties) => React.ReactElement<ScrollViewProperties>
  }
  // interface PickerProperties {
  //   style?: StyleProp<ViewStyles>
  // }
}