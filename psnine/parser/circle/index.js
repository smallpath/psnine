import parser from 'cheerio-without-node-native'

export default function (html) {
  const $ = parser.load(html, {
    decodeEntities: false
  })

  const list = []

  $('tbody tr').each(function (i, elem) {
    const $this = $(this)
    const arr = $this.text().split('\n').map(item => item.trim()).filter(item => item)

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
    list.push(info)
  })


  const page = []
  
  $('.page li a').each(function (i, elem) {
    const $this = $(this)
    const url = 'http://psnine.com' + $this.attr('href')
    const text = $this.text()
    page.push({
      url,
      text,
      type: $this.attr('href').includes('javascript:') ? 'disable' : 'enable'
    })
  })


  return {
    list: list,
    page,
    numberPerPage: 30,
    numPages: parseInt((page[page.length - 2] || {}).text),
    len: parseInt($('.page li').find('.disabled a').last().html())
  }
}