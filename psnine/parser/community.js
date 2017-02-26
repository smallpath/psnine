import parser from 'cheerio-without-node-native'

export default function (html) {
  const $ = parser.load(html)
  const result = []

  $('ul.list li').each(function(i, elem) {
    const $this = $(this)
    const img = $this.find('img').attr('src')
    const text = $this.text()
    const arr = text.split('\n').filter(item => item)
    const mock = {
      count: parseInt(arr[0]),
      views: 1,
      title: arr[1],
      psnid: arr[2],
      date: arr[3],
      avatar: img,
      id: arr[1] + arr[2],
      type: arr[4]
    }
    result.push(mock)
  })
  return result
}