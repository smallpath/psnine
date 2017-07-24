import { encodeForm } from '../utils'

const config = {
  method: 'POST',
  headers: {
    'Accept': 'text/html,application/xhtml+xml,application/xml',
    'Content-Type': 'application/x-www-form-urlencoded'
  }
}

export const sync = (psnid) => {
  return fetch(`http://psnine.com/psnid/${psnid}/upgame`, {
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Referer': `http://psnine.com/psnid/${psnid}`
    }
  })
}

export const upBase = (psnid) => {
  return fetch(`http://psnine.com/psnid/${psnid}/upbase`, {
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Referer': `http://psnine.com/psnid/${psnid}`
    }
  })
}

export const updown = (form) => {
  const formBody = encodeForm(form)
  return fetch('http://psnine.com/set/updown/ajax', Object.assign({ body: formBody }, config))
}

export const fav = (form) => {
  const formBody = encodeForm(form)
  const target = typeof form.unfav !== 'undefined' ? 'http://psnine.com/my/fav' : 'http://psnine.com/set/fav/ajax'
  return fetch(target, Object.assign({ body: formBody }, config))
}

export const block = (form) => {
  const formBody = encodeForm(form)
  const target = typeof form.unblock !== 'undefined' ? 'http://psnine.com/my/block' : 'http://psnine.com/set/blocked/ajax'
  return fetch(target, Object.assign({ body: formBody }, config))
}
export const close = (form) => {
  const formBody = encodeForm(form)
  const target = 'http://psnine.com/set/close/ajax'
  return fetch(target, Object.assign({ body: formBody }, config))
}
