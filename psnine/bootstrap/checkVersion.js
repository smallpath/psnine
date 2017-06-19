import {
  Alert,
  Linking
} from 'react-native'

import packages from '../../package.json'

const versionInfo = {
  sourceCodeURL: 'https://github.com/smallpath/psnine',
  checkVersionURL: 'https://api.github.com/repos/smallpath/psnine/releases/latest',
  tagURL: 'https://github.com/smallpath/psnine/releases/tag',
  backupURL: 'https://fir.im/mf24',
  version: packages['version']
}

export default () => fetch(versionInfo.checkVersionURL).then(res => res.json()).then(data => {
  let latestTag = (data.tag_name || versionInfo.version).replace('v', '')
  if (versionInfo.version < latestTag) {
    const date = new Date(data.published_at)
    Alert.alert(
      `更新`,
      `版本: ${latestTag}
发布日期: ${date.toLocaleDateString() + ' ' + date.toLocaleTimeString()}

${format(data.body)}`,
      [
        {text: '备用下载地址', onPress: () => Linking.openURL(versionInfo.backupURL).catch(err => global.toast && global.toast(err.toString()))},
        {text: '取消', style: 'cancel'},
        {text: '下载', onPress: () => Linking.openURL(`${versionInfo.tagURL}/v${latestTag}`).catch(err => global.toast && global.toast(err.toString()))},
      ]
    )
    return latestTag
  }
})

const format = (str = '') => (str.replace(/\#/igm, '').replace(/\-/igm, '*').split('更新记录').pop() || '').trim()