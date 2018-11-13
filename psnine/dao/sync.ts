import { encodeForm } from '../utils'

const config = {
  method: 'POST',
  headers: {
    'Accept': 'text/html,application/xhtml+xml,application/xml',
    'Content-Type': 'application/x-www-form-urlencoded'
  }
}

export const sync = (psnid) => {
  return fetch(`https://psnine.com/psnid/${psnid}/upgame`, {
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Referer': `https://psnine.com/psnid/${psnid}`
    }
  })
}

export const upBase = (psnid) => {
  return fetch(`https://psnine.com/psnid/${psnid}/upbase`, {
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Referer': `https://psnine.com/psnid/${psnid}`
    }
  })
}

export const updown = (form) => {
  const formBody = encodeForm(form)
  return fetch('https://psnine.com/set/updown/ajax', Object.assign({ body: formBody }, config))
}

export const fav = (form) => {
  const formBody = encodeForm(form)
  const target = typeof form.unfav !== 'undefined' ? 'https://psnine.com/my/fav' : 'https://psnine.com/set/fav/ajax'
  return fetch(target, Object.assign({ body: formBody }, config))
}

export const block = (form) => {
  const formBody = encodeForm(form)
  const target = typeof form.unblock !== 'undefined' ? 'https://psnine.com/my/block' : 'https://psnine.com/set/blocked/ajax'
  return fetch(target, Object.assign({ body: formBody }, config))
}
export const close = (form) => {
  const formBody = encodeForm(form)
  const target = 'https://psnine.com/set/close/ajax'
  return fetch(target, Object.assign({ body: formBody }, config))
}
