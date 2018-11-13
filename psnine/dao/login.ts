import { encodeForm } from '../utils'

const loginURL = 'https://psnine.com/sign/signin/ajax'

export const registURL = `https://psnine.com/psnauth`

export const safeLogin = function (psnid, pass) {
  let signin = ''
  let details = { psnid, pass, signin }
  const formBody = encodeForm(details)
  return new Promise((resolve) => {
    let isOK = true
    fetch(loginURL, {
      method: 'POST',
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml',
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: formBody
    }).then((responseData) => {
      if (responseData.status !== 200) {
        isOK = false
      }
      return responseData.text()
    }).then(text => {
      resolve({
        isOK,
        text
      })
    })
  })
}