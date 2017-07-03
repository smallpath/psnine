if (__DEV__) {
  window.requestIdleCallback = null
  window.cancelIdleCallback = null
}

console.ignoredYellowBox = ['Warning: BackAndroid']

let debug = true
debug = false
global.log = debug ? (...args) => console.log(...args) : () => {}

global.netInfo = 'WIFI'
global.loadImageWithoutWifi = false
global.shouldSendGA = true