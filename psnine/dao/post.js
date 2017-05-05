
const replyURL = 'http://psnine.com/set/comment/post'

export const postReply = form => {
  let formBody = []
  for (var property in form) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(form[property]);
      formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");

  return fetch(replyURL, {
    method: 'POST',
    headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml',
        'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: formBody
  })
}
