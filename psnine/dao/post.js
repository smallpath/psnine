
const replyURL = 'http://psnine.com/set/comment/post'
const ajaxURL = 'http://psnine.com/set/comson/ajax'
const editURL = 'http://psnine.com/set/edit/ajax'
const cainaURL = 'http://psnine.com/set/caina/ajax'
const dalao = 'http://psnine.com//set/dalao/ajax'

export const postReply = (form, type = 'post') => {
  let url = type === 'post' ? replyURL : ajaxURL
  if (type === 'edit') url = editURL
  if (type === 'caina') url = cainaURL
  if (type === 'dalao') url = dalao
  let formBody = []
  for (let property in form) {
    const encodedKey = encodeURIComponent(property);
    const encodedValue = encodeURIComponent(form[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");
  return fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: formBody
  })
}

const createMapper = {
  'topic' : 'http://psnine.com/set/topic/post',
  'qa' : 'http://psnine.com/set/qa/post',
  'gene' : 'http://psnine.com/set/gene/post',
  'battle' : 'http://psnine.com/set/battle/post',
  'trade' : 'http://psnine.com/set/trade/post',
}

export const postCreateTopic = (form, type = 'topic') => {
  let formBody = []
  for (let property in form) {
    const encodedKey = encodeURIComponent(property);
    const encodedValue = encodeURIComponent(form[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");
  const url = createMapper[type]
  if (!url) throw new Error('create Mappler not found: ' + type)
  return fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: formBody
  })
}

const circleURL = 'http://psnine.com/set/group/ajax'
export const postCircle = form => {
  let formBody = []
  for (let property in form) {
    const encodedKey = encodeURIComponent(property);
    const encodedValue = encodeURIComponent(form[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");
  return fetch(circleURL, {
    method: 'POST',
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: formBody
  })
}

const passURL = 'http://psnine.com/my/pass'
export const postPass = form => {
  let formBody = []
  for (let property in form) {
    const encodedKey = encodeURIComponent(property);
    const encodedValue = encodeURIComponent(form[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");
  return fetch(passURL, {
    method: 'POST',
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: formBody
  })
}

const settingURL = 'http://psnine.com/my/setting'
export const postSetting = form => {
  let formBody = []
  for (let property in form) {
    const encodedKey = encodeURIComponent(property);
    const encodedValue = encodeURIComponent(form[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");
  return fetch(settingURL, {
    method: 'POST',
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: formBody
  })
}

const imageURL = 'http://psnine.com/my/photo'
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
  let formBody = []
  for (let property in form) {
    const encodedKey = encodeURIComponent(property);
    const encodedValue = encodeURIComponent(form[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");
  return fetch(imageURL, {
    method: 'POST',
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: formBody
  })
}

export const translate = form => {
  let formBody = []
  for (let property in form) {
    const encodedKey = encodeURIComponent(property);
    const encodedValue = encodeURIComponent(form[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");
  // return new Promise();
  return fetch('http://psnine.com/set/cn/post', {
    method: 'POST',
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: formBody
  })
}