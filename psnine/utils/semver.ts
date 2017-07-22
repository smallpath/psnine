export default function (a, b) {
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