const parser = require('cheerio-without-node-native')

export default function parseThophy(html) {
  const $ = parser.load(html, {
    decodeEntities: false
  })

  const list = []

  $('.box table tr').each(function (i, elem) {
    const $this = $(this)
    const info = {}

    $this.find('td').each(function (j, elem) {
      const that = $(this)
      if (j === 0) {
        info.avatar = that.find('img').attr('src')
        info.href = that.find('a').attr('href')
      } else if (j === 1) {
        info.title = that.find('p a').text()
        info.platform = Array.from(that.find('span').map(function (k, elem) { return $(this).text() }))
        info.syncTime = that.find('small').text()
      } else if (j === 2) {
        info.allTime = (that.text() || '').replace('总耗时', '')
      } else if (j === 3) {
        info.alert = that.find('span').text()
        info.allPercent = that.find('em').text()
      } else if (j === 4) {
        info.percent = that.find('.mb10 div').text()
        info.trophyArr = (that.find('small').text() || '').replace(/\n/igm, '')
      }
    })

    list.push(info)
  })


  const page = []

  $('ul.dropmenu').next().find('a').each(function (i, elem) {
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
    numPages: page.length - 1,
    len: $('.page li').find('.disabled a').last().html()
  }
}
