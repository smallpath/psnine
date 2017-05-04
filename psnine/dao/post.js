
const replyURL = 'http://psnine.com/set/comment/post'

export const postReply = form => {
  let formBody = []
  for (var property in form) {
      var encodedKey = encodeURIComponent(property);
      var encodedValue = encodeURIComponent(form[property]);
      formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");
  console.log(formBody)
  return fetch(replyURL, {
    credentials: 'include',
    method: 'post',
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: formBody
  })
}
