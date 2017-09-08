import parser from 'cheerio-without-node-native'

export default function (html) {
  const $ = parser.load(html, {
    decodeEntities: false
  })

  const joinedList = []
  const ownedList = []

  $('tbody tr').each(function (i, elem) {
    const $this = $(this)
    const arr = $this.text().split('\n').map(item => item.trim()).filter(item => item)
    arr.shift()
    // console.log(arr)
    const info = {
      avatar: $this.find('img').attr('src'),
      href: $this.find('a').attr('href'),
      title: arr[0],
      owner: arr[1].replace('机长：', ''),
      platform: (arr.join('').match(/平台：(.*?)发行/) || [0, 'UNKNOWN'])[1],
      type: arr[2],
      access: arr[3],
      hot: arr[4],
      createdAt: arr.slice().pop(),
    }
    joinedList.push(info)
  })

  return {
    joinedList,
    ownedList
  }
}