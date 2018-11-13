const parser = require('cheerio-without-node-native')

import newsParser from '../community'

export default function parseThophy(html) {
  let $ = parser.load(html, {
    decodeEntities: false
  })

  const titleInfo = {}
  titleInfo.content = Array.from($('.gameinfo').contents().map(function() { 
    return $(this).html() || $(this).text() || '' 
  })).map(item => item.trim().replace(/\s+/igm, ' ')).filter(item => item)
  titleInfo.title = $('h1').text()
  titleInfo.avatar = $('.gamebox').find('img').attr('src')
  titleInfo.backgroundImage = ($('.gamebg').attr('style').match(/\'(.*?)\'/) || [0, ''])[1]

  $ = parser.load(html, {
    decodeEntities: true
  })

  const list = []
  $('ul.list li').each(function (i, elem) {
    const $this = $(this)
    const img = $this.find('img').attr('src')
    const text = $this.text()
    const arr = text.split('\n').map(item => item.replace(/\t/g, '').trim()).filter(item => item)
    const href = $this.find('.title a').attr('href') || ''
    const matched = href.match(/\d+/)
    const type = href.includes('/gene/') ? 'gene' : 'community'
    const id = matched ? matched[0] : arr[1] + arr[2]
    arr.shift()
    const mock = {
      count: arr.slice().pop(),
      views: 1,
      title: arr.slice(0, -3).join('\n'),
      psnid: arr.slice(0, -2).pop(),
      date: arr.slice(0, -1).pop(),
      avatar: img,
      id,
      newsType: type,
      type: type,
      thumbs: Array.from($this.find('.thumb img').map(function(){ return $(this).attr('src')}))
    }
    // console.log(mock)
    list.push(mock)
  })

  const gameTable = []

  $('ul.darklist').find('li').each(function (i, elem) {

    const $this = $(this)
    let img = $this.find('img').attr('src')
    if (!img) img = $this.parent().find('img').attr('src')
    const text = $this.text()
    const arr = text.split('\n').map(item => item.replace(/\t/g, '').trim()).filter(item => item.trim())

    const title = $this.find('td p a').text()
    const matched = $this.find('a').attr('href').match(/\/(\d+)/)

    const id = matched ? matched[1] : arr[1] + arr[2]

    const startIndex = arr.some(item => item.includes('%')) ? -6 : -5
    const regionArr = arr.slice(1, startIndex)
    const trophyArr = arr.slice(startIndex)
    const mock = {
      title: $this.find('a').last().text(),
      avatar: img,
      id,
      platform: trophyArr[0],
      region: trophyArr[2] || ''
    }

    gameTable.push(mock)
  })

  if (list.length === 0) {
    $('ul.newlist li').each(function (i, elem) {
      const $this = $(this)
      const img = $this.find('img').attr('src')
      const text = $this.text()
      const arr = text.split('\n').map(item => item.replace(/\t/g, '').trim()).filter(item => item)
      const href = $this.find('a.touch').attr('href') || ''
      const matched = href.match(/\d+/)
      const type = href.includes('/gene/') ? 'gene' : 'community'
      const id = matched ? matched[0] : arr[1] + arr[2]
      // console.log(arr)
      const mock = {
        count: arr.slice().pop(),
        views: 1,
        title: arr.slice(0, -3).join('\n'),
        psnid: arr.slice(0, -2).pop(),
        date: arr.slice(0, -1).pop(),
        avatar: img,
        id,
        type,
        newsType: type,
        thumbs: Array.from($this.find('.thumb img').map(function(){ return $(this).attr('src')}))
      }
      // console.log(mock)
      list.push(mock)
    })
  }

  const page = []

  $('.page a').each(function (i, elem) {
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
    gameTable,
    titleInfo,
    page,
    numberPerPage: 30,
    numPages: page.length >= 2 ? parseInt(page[page.length - 2].text) : 1,
    len: parseInt($('.page li').find('.disabled a').last().html())
  }
}
