import parser from 'cheerio-without-node-native'

export default function (html) {
  
  const $ = parser.load(html, {
    decodeEntities: false
  })

  const list = []

  $('ul.storelist li').each(function (i, elem) {
    const $this = $(this)
    const arr = $this.find('div.storeinfo').text().split('\n').map(item => item.trim()).filter(item => item)
    const matched = $this.find('img').parent().attr('onclick').match(/\'(.*?)\'/igm)
    const info = {
      avatar: $this.find('img').attr('src'),
      onclick: $this.find('img').parent().attr('onclick'),
      id: matched ? matched[0].replace(/\'/igm, '') : '-1',
      server: matched ? matched[1].replace(/\'/igm, '') : 'hk',
      title: arr[0],
      type: arr[1].replace('类别：', ''),
      comment: arr.slice(-1).pop().replace('备注：', ''),
      price: arr.slice(-2).shift().replace('售价：', ''),
      date: arr.slice(-3).shift().replace('发行：', ''),
      platform: (arr.join('').match(/平台：(.*?)发行/) || [0, 'UNKNOWN'])[1]

    }
    list.push(info)
  })


  const page = []

  $('.page a').each(function (i, elem) {
    const $this = $(this)
    const url = 'http://psnine.com' + $this.attr('href')
    const text = $this.text() || '1'
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