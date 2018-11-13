const parser = require('cheerio-without-node-native')

export default function (html, type) {
  const $ = parser.load(html, {
    decodeEntities: true
  })

  const list = []

  $('.imgbox').each(function (i, elem) {
    const $this = $(this)
    const url = $this.find('a').attr('href')
    const info = {
      href: url,
      img: url,
      delimg: $this.find('input').attr('value'),
      id: url.split('/').pop().split('.')[0]
    }
    list.push(info)
  })
  const page = []

  $('.page ul').last().find('a').each(function (i, elem) {
    const $this = $(this)
    const url = 'https://psnine.com' + $this.attr('href')
    const text = $this.text()
    page.push({
      url,
      text,
      type: $this.attr('href').includes('javascript:') ? 'disable' : 'enable'
    })
  })
  // console.log(list)
  return {
    list,
    page,
    numberPerPage: 30, // ??
    numPages: page.length >= 2 ? parseInt(page[page.length - 2].text) : 1,
    len: parseInt($('.page li').find('.disabled a').last().html())
  }
}
