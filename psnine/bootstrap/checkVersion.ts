import {
  Alert,
  Linking
} from 'react-native'

import packages from '../../package.json'
import { semver } from '../utils/index'

declare var global

const versionInfo = {
  sourceCodeURL: 'https://github.com/smallpath/psnine',
  checkVersionURL: 'https://api.github.com/repos/smallpath/psnine/releases/latest',
  tagURL: 'https://github.com/smallpath/psnine/releases/tag',
  backupURL: 'https://fir.im/mf24',
  version: packages.version
}

const format = (str = '') => (str.replace(/\#/igm, '').replace(/\-/igm, '*').split('更新记录').pop() || '').trim()

export default () => fetch(versionInfo.checkVersionURL).then(res => res.json()).then(data => {
  if (global.isIOS) return Alert.alert('请前往App Store检查更新')
  let latestTag = (data.tag_name || versionInfo.version).replace('v', '')
  const isBigger = semver(versionInfo.version, latestTag) < 0
  // const isBigger = semver('0.6.9', '0.6.8') < 0
  if (isBigger) {
    const date = new Date(data.published_at)
    Alert.alert(
      `更新`,
      `版本: ${latestTag}
发布日期: ${date.toLocaleDateString() + ' ' + date.toLocaleTimeString()}

${format(data.body)}`,
      [
        {text: '备用下载地址', onPress: () => Linking.openURL(versionInfo.backupURL).catch(err => global.toast && global.toast(err.toString()))},
        {text: '取消', style: 'cancel'},
        {text: '下载', onPress: () => Linking.openURL(`${versionInfo.tagURL}/v${latestTag}`).catch(err => global.toast && global.toast(err.toString()))}
      ]
    )
    return latestTag
  }
})
