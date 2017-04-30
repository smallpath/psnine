import parser from 'cheerio-without-node-native'

export default function (html) {
  const $ = parser.load(html)
  const result = []

  $('ul.list li').each(function(i, elem) {
    const $this = $(this)
    const img = $this.find('img').attr('src')
    const text = $this.text()
    const arr = text.split('\n').map(item => item.replace(/\t/g, '')).filter(item => item)

    const matched = $this.find('.title a').attr('href').match(/\d+/)
    const id = matched ? matched[0] :arr[1] + arr[2]

    const mock = {
      count: parseInt(arr[6]),
      views: 1,
      title: arr[0],
      psnid: arr[4],
      date: arr[5],
      avatar: img,
      id,
      price: arr[1],
      type: arr[4],
      platform: arr.slice(-1).pop()
    }
    result.push(mock)
  })
  return result
}
