import parser from 'cheerio-without-node-native'

export default function (html) {
  const $ = parser.load(html)
  const result = []

  $('tr').each(function (i, elem) {

    const $this = $(this)
    const img = $this.find('img').attr('src')

    const text = $this.text()
    const arr = text.split('\n').map(item => item.replace(/\t/g, '').trim()).filter(item => item.trim())

    const title = $this.find('td p a').text()
    const matched = img.match(/\/(\d+)\./)

    const id = matched ? matched[1] : arr[1] + arr[2]

    const startIndex = arr.some(item => item.includes('%')) ? -8 : -7
    const regionArr = arr.slice(1, startIndex)
    const trophyArr = arr.slice(startIndex)

    const mock = {
      title: title,
      avatar: img,
      id,
      region: regionArr.join(''),
      platium: trophyArr[0],
      gold: trophyArr[1],
      selver: trophyArr[2],
      bronze: trophyArr[3],
      platform: arr[0].replace(title, '')
    }

    result.push(mock)
  })
  return result
}
