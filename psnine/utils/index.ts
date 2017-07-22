export const semver = (a, b) => {
  const pa = a.split('.')
  const pb = b.split('.')
  for (const i = 0; i < 3; i++) {
      const na = Number(pa[i])
      const nb = Number(pb[i])
      if (na > nb) return 1
      if (nb > na) return -1
      if (!isNaN(na) && isNaN(nb)) return 1
      if (isNaN(na) && !isNaN(nb)) return -1
  }
  return 0
}

export const encodeForm = obj => {
  let formBody = []
  for (let property in obj) {
    let encodedKey = encodeURIComponent(property)
    let encodedValue = encodeURIComponent(obj[property])
    formBody.push(encodedKey + '=' + encodedValue)
  }
  formBody = formBody.join('&')
  return obj
}