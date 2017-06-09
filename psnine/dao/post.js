
const replyURL = 'http://psnine.com/set/comment/post'
const ajaxURL = 'http://psnine.com/set/comson/ajax'

export const postReply = (form, type = 'post') => {
  const url = type === 'post' ? replyURL : ajaxURL
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