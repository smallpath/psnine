declare const window: Window
declare const console: Console
declare const global: Global

interface Window {
  requestIdleCallback: any
  cancelIdleCallback: any
}

interface Console {
  ignoredYellowBox: string[],
  log: () => void
}

interface Global {
  log: () => void
  netInfo: string
  loadImageWithoutWifi: boolean
  shouldSendGA: boolean
}

if (__DEV__) {
  window.requestIdleCallback = null
  window.cancelIdleCallback = null
}

console.ignoredYellowBox = ['Warning: BackAndroid', 'Warning: flattenChildren', 'Warning: shouldComponentUpdate']

let debug = true
// debug = false
global.log = debug ? (...args) => console.log(...args) : () => {}

global.netInfo = 'WIFI'
global.loadImageWithoutWifi = false
global.shouldSendGA = true

import './import'