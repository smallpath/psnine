import parser from 'cheerio-without-node-native'

export default function (html) {
  const $ = parser.load(html)
  const result = []

  $('tr').each(function (i, elem) {

    const $this = $(this)
    const img = $this.find('img').attr('src')

    const text = $this.text()
    const arr = text.split('\n').map(item => item.replace(/\t/g, '').trim()).filter(item => item.trim())

    const title = $this.find('td.title a').text()
    const idUrl = $this.find('a').attr('href')
    const matched = idUrl.match(/\/(\d+)/)

    const id = matched ? matched[1] : arr[1] + arr[2]

    const startIndex = -8
    const regionArr = arr.slice(1, startIndex)
    const trophyArr = arr.slice(startIndex)
    if (trophyArr[0] && trophyArr[0].includes('白') === false) {
      trophyArr.unshift(arr[1])
    }
    const mock = {
      title: title,
      avatar: img,
      id,
      region: arr.slice(0, arr.length -2).pop(),
      platium: trophyArr[0],
      gold: trophyArr[1],
      selver: trophyArr[2],
      bronze: trophyArr[3],
      platform: arr.slice(0, arr.length -1).pop()
    }
    result.push(mock)
  })
  // console.log(result)
  return result
}
