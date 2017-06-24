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
  let formBody = []
  for (let property in form) {
    const encodedKey = encodeURIComponent(property);
    const encodedValue = encodeURIComponent(form[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");
  return fetch('http://psnine.com/set/updown/ajax', {
    method: 'POST',
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: formBody
  })
}

export const fav = (form) => {
  // console.log(form)
  let formBody = []
  for (let property in form) {
    const encodedKey = encodeURIComponent(property);
    const encodedValue = encodeURIComponent(form[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");
  const target = typeof form.unfav !== 'undefined' ? 'http://psnine.com/my/fav' : 'http://psnine.com/set/fav/ajax'
  return fetch(target, {
    method: 'POST',
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: formBody
  })
}
export const block = (form) => {
  // console.log(form)
  let formBody = []
  for (let property in form) {
    const encodedKey = encodeURIComponent(property);
    const encodedValue = encodeURIComponent(form[property]);
    formBody.push(encodedKey + "=" + encodedValue);
  }
  formBody = formBody.join("&");
  return fetch('http://psnine.com/set/blocked/ajax', {
    method: 'POST',
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml',
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: formBody
  })
}
