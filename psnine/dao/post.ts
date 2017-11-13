import { encodeForm } from '../utils'

const replyURL = 'http://psnine.com/set/comment/ajax'
const ajaxURL = 'http://psnine.com/set/comson/ajax'
const editURL = 'http://psnine.com/set/edit/ajax'
const cainaURL = 'http://psnine.com/set/caina/ajax'
const dalao = 'http://psnine.com//set/dalao/ajax'
const passURL = 'http://psnine.com/my/pass'
const translateURL = 'http://psnine.com/set/cn/post'
const imageURL = 'http://psnine.com/my/photo'
const settingURL = 'http://psnine.com/my/setting'
const circleURL = 'http://psnine.com/set/group/ajax'
const diaryURL = 'http://psnine.com/set/diary/post'

const createMapper = {
  'topic': 'http://psnine.com/set/topic/post',
  'qa': 'http://psnine.com/set/qa/post',
  'gene': 'http://psnine.com/set/edit/ajax',
  'battle': 'http://psnine.com/set/battle/post',
  'trade': 'http://psnine.com/set/trade/post'
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
