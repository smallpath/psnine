import {
  NavigationScreenProp
} from 'react-navigation'

export interface ColorInfo {
  deepColor: string
  standardColor: string
  tintColor: string
  secondaryColorBackup: string
  backgroundColor: string
  brighterLevelOne: string
  standardTextColor: string
  titleTextColor: string
}

export interface ModeInfo extends ColorInfo {
  loadSetting: (...args) => any
  reloadSetting: (...args) => any
  settingInfo: any
  isNightMode: boolean
  reverseModeInfo: ColorInfo
  dayModeInfo: ColorInfo
  nightModeInfo: ColorInfo
  switchModeOnRoot: (...args) => any
  themeName: string
  colorTheme: string
  secondaryColor: string
  width: number
  height: number
  minWidth: number
  numColumns: number
  accentColor: string
  background: string
}

export interface ModalList {
  text: string,
  onPress: (...args) => any
}

export interface FlatlistItemProp {
  modeInfo: ModeInfo
  navigation: NavigationScreenProp<any, any>
  rowData?: any
  onPress?: (...args) => any
}

export interface FlatlistItemState {
  modalVisible?: boolean
}
