import parser from 'cheerio-without-node-native'

export default function (html) {
  const $ = parser.load(html, {
    decodeEntities: true
  })
  
  const list = []

  $('table tr').each(function (i, elem) {
    const $this = $(this)
    const img = $this.find('img').attr('src')
    const mock = {
      avatar: img,
      server: $this.find('img').last().attr('src'),
      rank: $this.find('strong').text(),
      psnid: $this.find('a').last().text(),
      url: $this.find('a').last().attr('href'),
      time: $this.find('em').first().text(),
      cost: ($this.find('.twoge').text() || '').replace('总耗时', ''),
      progress: $this.find('.progress').text(),
      trophies: Array.from($this.find('.progress').next().find('span').map(function(i, elem) {return $(this).text()}))
    }
    list.push(mock)
  })

  // console.log(list)
  const page = []

  $('.page a').each(function (i, elem) {
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
    len: $('.page li').find('.disabled a').last().html()
  }
}
