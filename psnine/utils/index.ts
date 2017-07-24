import {
  Linking,
  ToastAndroid
} from 'react-native'

declare var global

export const semver = (a, b) => {
  const pa = a.split('.')
  const pb = b.split('.')
  for (let i = 0; i < 3; i++) {
      const na = Number(pa[i])
      const nb = Number(pb[i])
      if (na > nb) return 1
      if (nb > na) return -1
      if (!isNaN(na) && isNaN(nb)) return 1
      if (isNaN(na) && !isNaN(nb)) return -1
  }
  return 0
}

export const encodeForm = obj => {
  let formBody: string[] = []
  for (let property in obj) {
    if (!obj.hasOwnProperty(property)) continue
    let encodedKey = encodeURIComponent(property)
    let encodedValue = encodeURIComponent(obj[property])
    formBody.push(encodedKey + '=' + encodedValue)
  }
  return formBody.join('&')
}

export const onDeepLinkPress = (url, isGettingType) => {
  let targetURL = url.includes('d7vg.com') ? url.replace('d7vg.com', 'psnine.com') : url
  let baseURL = targetURL
  let errMessage = ''
  let title = '打开网页'
  let type = 'general'
  const request: any = isGettingType ? () => { return {
    type, title, errMessage}
  } : (thisURL) => Linking.openURL(thisURL).catch(err => {
    errMessage && ToastAndroid.show(errMessage || err.toString(), ToastAndroid.SHORT)
    errHandler()
  })
  const errHandler = () => Linking.openURL(baseURL).catch(err => global.toast(errMessage || err.toString()))

  // 深度链接
  if (targetURL.includes('music.163.com')) {
    let matched = targetURL.match(/\?id\=(\d+)/)
    if (!matched) matched = targetURL.match(/\/song\/(\d+)/)
    if (matched) {
      targetURL = `orpheus://song/${matched[1]}`
      errMessage = `打开网易云音乐客户端失败 (id:${matched[1]})`
      type = 'music163'
      title = `网易云音乐: ${matched[1]}`
      return request(targetURL)
    }
  } else if (targetURL.includes('bilibili.com')) {
    let matched = targetURL.match(/aid\=(\d+)/)
    if (!matched) matched = targetURL.match(/\/video\/av(\d+)/)
    if (matched) {
      targetURL = `bilibili://video/${matched[1]}`
      errMessage = `打开B站客户端失败 (av${matched[1]})`
      type = 'bilibili'
      title = `B站视频: av${matched[1]}`
      return request(targetURL)
    }
    if (!matched) matched = targetURL.match(/anime\/(\d+)/)
    if (matched) {
      targetURL = `bilibili://bangumi/season/${matched[1]}?url_from_h5=1`
      errMessage = `打开B站客户端失败 (av${matched[1]})`
      type = 'bilibili'
      title = `B站番剧: av${matched[1]}`
      return request(targetURL)
    }
    if (!matched) matched = targetURL.match(/live\.bilibili\.com\/(h5\/|)(\d+)/)
    if (matched) {
      targetURL = `bilibili://live/${matched[2]}`
      errMessage = `打开B站客户端失败 (av${matched[2]})`
      type = 'bilibili'
      title = `B站直播: av${matched[1]}`
      return request(targetURL)
    }

  }

  const reg = /^(https|http)\:\/\//
  if (reg.exec(targetURL)) {
    const target = targetURL.replace(reg, 'p9://')
    return request(target)
  } else if (/^(.*?):\/\//.exec(targetURL)) {
    return request(targetURL)
  } else {
    const target = 'p9://psnine.com' + targetURL
    return request(target)
  }
}

export const urlExtractor = (...args) => {
  const preText = args.length >= 6 ? args[5][args[4] - 1] : 'ignore'
  const nextText = args.length >= 6 ? args[5].substring(args[4] + 0 + args[0].length, args[4] + 3 + args[0].length) : 'ignore'
  const shouldNotReplace = [`"`, `'`].includes(preText) || (nextText === '</a')
  if (shouldNotReplace) {
    return args[0]
  } else {
    return `<a href="${args[0]}">${args[0]}</a>`
  }
}