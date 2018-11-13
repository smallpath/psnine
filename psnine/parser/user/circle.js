import parser from 'cheerio-without-node-native'

export default function (html) {
  const $ = parser.load(html, {
    decodeEntities: false
  })

  const list = []

  $('.box tr').each(function (i, elem) {
    const $this = $(this)
    const arr = $this.text().split('\n').map(item => item.trim()).filter(item => item)
    if (i === 0) {
      return
    }
    const info = {
      avatar: $this.find('img').attr('src'),
      href: $this.find('a').attr('href'),
      title: arr[0],
      owner: arr[1].replace('类别：', ''),
      type: arr[2],
      access: arr[3],
      hot: arr[4],
      id: $this.find('a').attr('href').match(/group\/(\d+)/)[1],
      createdAt: arr.slice().pop(),
    }
    list.push(info)
  })

  const page = []
  
  $('.page li a').each(function (i, elem) {
    const $this = $(this)
    const url = 'https://psnine.com' + $this.attr('href')
    const text = $this.text()
    page.push({
      url,
      text,
      type: $this.attr('href').includes('javascript:') ? 'disable' : 'enable'
    })
  })
  return {
    list,
    page,
    numberPerPage: 30,
    numPages: page.length >= 2 ? parseInt(page[page.length - 2].text) : 1,
    len: parseInt($('.page li').find('.disabled a').last().html())
  }
}