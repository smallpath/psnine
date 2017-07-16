import NestedScrollView from 'react-native-nested-scrollview'

global.NestedScrollView = NestedScrollView

import Ionicons from 'react-native-vector-icons/Ionicons';

Promise.all([
    Ionicons.getImageSource('md-arrow-back', 24, '#fff'),
    Ionicons.getImageSource('md-sync', 24, '#fff'),
    Ionicons.getImageSource('md-more', 24, '#fff')
]).then(result => {
  global.navIcon = result[0]
  global.syncIcon = result[1]
  global.overflowIcon = result[2]
})
