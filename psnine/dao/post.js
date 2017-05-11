
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
  // console.log(url, formBody)
  return fetch(url, {
    method: 'POST',
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: formBody
  })
}
