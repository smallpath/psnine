import { encodeForm } from '../utils'

const replyURL = 'https://psnine.com/set/comment/ajax'
const ajaxURL = 'https://psnine.com/set/comson/ajax'
const editURL = 'https://psnine.com/set/edit/ajax'
const cainaURL = 'https://psnine.com/set/caina/ajax'
const dalao = 'https://psnine.com//set/dalao/ajax'
const passURL = 'https://psnine.com/my/pass'
const translateURL = 'https://psnine.com/set/cn/post'
const imageURL = 'https://psnine.com/my/photo'
const settingURL = 'https://psnine.com/my/setting'
const circleURL = 'https://psnine.com/set/group/ajax'
const diaryURL = 'https://psnine.com/set/diary/post'

const createMapper = {
  'topic': 'https://psnine.com/set/topic/post',
  'qa': 'https://psnine.com/set/qa/post',
  'gene': 'https://psnine.com/set/edit/ajax',
  'battle': 'https://psnine.com/set/battle/post',
  'trade': 'https://psnine.com/set/trade/post'
}

const config = {
  method: 'POST',
  headers: {
    'Accept': 'text/html,application/xhtml+xml,application/xml',
    'Content-Type': 'application/x-www-form-urlencoded'
  }
}

export const postReply = (form, type = 'post') => {
  let url = type === 'post' ? replyURL : ajaxURL
  if (type === 'edit') url = editURL
  if (type === 'caina') url = cainaURL
  if (type === 'dalao') url = dalao
  const formBody = encodeForm(form)
  return fetch(url, Object.assign({ body: formBody }, config))
}

export const postCreateTopic = (form, type = 'topic') => {
  const formBody = encodeForm(form)
  const url = createMapper[type]
  if (!url) throw new Error('create Mappler not found: ' + type)
  return fetch(url, Object.assign({ body: formBody }, config))
}

export const postCircle = form => {
  const formBody = encodeForm(form)
  return fetch(circleURL, Object.assign({ body: formBody }, config))
}

export const postPass = form => {
  const formBody = encodeForm(form)
  return fetch(passURL, Object.assign({ body: formBody }, config))
}

export const postSetting = form => {
  const formBody = encodeForm(form)
  return fetch(settingURL, Object.assign({ body: formBody }, config))
}

export const postImage = image => {
  const upimg = {
    uri: image.image.uri,
    type: image.type,
    name: image.image.uri.split('/').pop() + '.' + image.type.split('/').pop()
  }
  const body = new FormData()
  body.append('upimg', upimg)

  return fetch(imageURL, {
    method: 'POST',
    body
  })
}

export const postDeleteImage = form => {
  const formBody = encodeForm(form)
  return fetch(imageURL, Object.assign({ body: formBody }, config))
}

export const translate = form => {
  const formBody = encodeForm(form)
  return fetch(translateURL, Object.assign({ body: formBody }, config))
}

export const createDiary = form => {
  const formBody = encodeForm(form)
  return fetch(diaryURL, Object.assign({ body: formBody }, config))
}
