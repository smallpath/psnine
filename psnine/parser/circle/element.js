import parser from 'cheerio-without-node-native'

export default function (html) {
  const $ = parser.load(html, {
    decodeEntities: true
  })

  const titleInfo = {}

  // console.log($('.box .pd10').first().text())
  const title = $('.box .r')
  titleInfo.name = title.next().text() || ''
  titleInfo.content = `<div>${title.parent().find('.content').html()}</div>`
  titleInfo.owner = title.next().next().find('a.psnnode').text()
  titleInfo.create = ((title.find('.btn-success').attr('onclick') || '').match(/\'(.*?)\'/) || [0, ''])[1]
  // console.log(titleInfo)
  const list = []

  $('ul.list li').each(function (i, elem) {
    const $this = $(this)
    const img = $this.find('img').attr('src')
    const thumbs = Array.from($this.find('img').map(function (i, elem) {
      return $(this).attr('src')
    }).filter(index => !!index))

    const text = $this.text()
    const arr = text.split('\n').map(item => item.replace(/\t/g, '').trim()).filter(item => item)

    const matched = $this.find('.content')[0].parent.attribs.href.match(/\d+/)
    const id = matched ? matched[0] : arr[1] + arr[2]
    const nextArr = arr.slice(-3)
    const mock = {
      content: $this.find('.content').text(),
      psnid: nextArr[0],
      date: nextArr[1],
      avatar: img,
      id,
      href: $this.find('.content')[0].parent.attribs.href,
      thumbs,
      count: nextArr[2]
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

  // console.log(list)
  return {
    list,
    page,
    titleInfo,
    numberPerPage: 30,
    numPages: page.length >= 2 ? parseInt(page[page.length - 2].text) : 1,
    len: parseInt($('.page li').find('.disabled a').last().html())
  }
}