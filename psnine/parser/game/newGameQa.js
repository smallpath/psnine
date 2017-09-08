import parser from 'cheerio-without-node-native'

export default function (html) {
  const $ = parser.load(html, {
    decodeEntities: true
  })
  
  const list = []
  $('ul.list li').each(function (i, elem) {
    const $this = $(this)
    const img = $this.find('img').attr('src')
    const text = $this.text()
    const arr = text.split('\n').map(item => item.replace(/\t/g, '')).map(item => item.trim()).filter(item => item)

    const matched = $this.find('.title a').attr('href').match(/\d+/)
    const id = matched ? matched[0] : arr[1] + arr[2]
    const mock = {
      title: arr[0],
      psnid:arr.slice(0, -2).pop(),
      date: arr.slice(0, -1).pop(),
      avatar: img,
      id,
      price: arr[1],
      type: arr[4],
      count: parseInt(arr.slice().pop()),
      platform: arr.slice(-1).pop()
    }
    list.push(mock)
  })

  return list
}
