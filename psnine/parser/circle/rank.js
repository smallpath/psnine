import parser from 'cheerio-without-node-native'

export default function (html) {
  const $ = parser.load(html, {
    decodeEntities: true
  })

  const titleInfo = {}

  // console.log($('.box .pd10').first().text())
  const title = $('.box .pd10')
  titleInfo.avatar = title.first().find('img').attr('src')
  titleInfo.name = title.first().find('h1').text()
  titleInfo.access = title.first().find('p').first().text()
  titleInfo.content = `<div>${title.first().find('.content').html()}</div>`
  titleInfo.owener = title.find('a.psnnode').text()

  const list = []

  $('table tr').each(function (i, elem) {
    const $this = $(this)
    const info = {}

    const text = $this.text()
    const arr = text.split('\n').map(item => item.trim()).filter(item => item)
    info.rank = arr[0]
    info.avatar = $this.find('img').attr('src')
    info.href = $this.find('a').attr('href')
    info.psnid = arr[1]
    info.exp = (arr[2].split('经验') || [])[1]
    info.level = (arr[2].split('经验') || [])[0]
    info.content = `<div>${$this.find('p').parent().html().trim().replace(/<p>.*?<\/p>/,'')}</div>`
    info.games = arr[3]
    info.perfectRate =arr[4]
    info.platinum = arr[5]
    info.gold = arr[6]
    info.silver = arr[7]
    info.bronze = arr[8]
    info.type = 'general'
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