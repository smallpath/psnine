import parser from 'cheerio-without-node-native'

export default function (html) {
  const $ = parser.load(html, {
    decodeEntities: true
  })

  const list = []
  // console.log($('div.box ul.list li').length)
  $('div.box ul.list li').each(function (i, elem) {
    const $this = $(this)
    const img = $this.find('img').attr('src')
    const text = $this.text()
    const arr = text.split('\n').map(item => item.replace(/\t/g, '').trim()).filter(item => item)
    if (isNaN(parseInt(arr))) arr.unshift(0)
    const matched = $this.find('.title a').attr('href').match(/\d+/)
    const id = matched ? matched[0] : arr[1] + arr[2]
    const mock = {
      count: parseInt(arr[0]),
      views: 1,
      title: arr[1],
      psnid: arr[2],
      date: arr[3],
      avatar: img,
      id,
      type: arr[4]
    }
    list.push(mock)
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
    list,
    page,
    numberPerPage: 30,
    numPages: page.length >= 2 ? parseInt(page[page.length - 2].text) : 1,
    len: parseInt($('.page li').find('.disabled a').last().html())
  }
}