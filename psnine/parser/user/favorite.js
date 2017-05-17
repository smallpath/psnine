const parser = require('cheerio-without-node-native')

export default function parseThophy(html) {
  const $ = parser.load(html, {
    decodeEntities: false
  })

  const list = []

  $('ul form li').each(function (i, elem) {
    const that = $(this)
    const info = {}
    info.avatar = that.find('img').attr('src')
    info.href = that.find('img').parent().attr('href')
    info.title = that.find('.title a').text()
    info.url = that.find('.title a').attr('href')

    info.psnid = that.find('.psnnode').text()
    info.userURL = that.find('.psnnode').attr('href')
    info.time = that.find('.meta').contents()
      .filter(function () { return this.nodeType === 3 }).text().trim()

    list.push(info)
  })


  const page = []

  $('.page ul').last().find('a').each(function (i, elem) {
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
    numberPerPage: 30, // ??
    numPages: parseInt(page[page.length - 2].text),
    len: parseInt($('.page li').find('.disabled a').last().html())
  }
}
