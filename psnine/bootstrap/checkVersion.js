import {
  Alert,
  Linking
} from 'react-native'

import packages from '../../package.json'

const versionInfo = {
  sourceCodeURL: 'https://github.com/smallpath/psnine',
  checkVersionURL: 'https://api.github.com/repos/smallpath/psnine/git/refs/tags',
  tagURL: 'https://github.com/smallpath/psnine/releases/tag',
  backupURL: 'https://fir.im/mf24',
  version: packages['version']
}

export default () => fetch(versionInfo.checkVersionURL).then(res => res.json()).then(data => {
    let latestTag = '0.0.0'

    data.forEach(function(item, index) {
      let tagArr = item.ref.match(/v(.*?)$/i)
      if (tagArr.length >= 1) {
        let tag = tagArr[1]
        if (latestTag < tag) latestTag = tag
      }
    })
    if (versionInfo.version < latestTag) {
      Alert.alert(
        `发现新版本`,
        `最新版本为v${latestTag}, 是否打开网页进行下载?`,
        [
          {text: '备用下载地址', onPress: () => Linking.openURL(versionInfo.backupURL).catch(err => global.toast && global.toast(err.toString()))},
          {text: '取消', style: 'cancel'},
          {text: '确定', onPress: () => Linking.openURL(`${versionInfo.tagURL}/v${latestTag}`).catch(err => global.toast && global.toast(err.toString()))},
        ]
      )
      return latestTag
    }
  })