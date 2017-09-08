const parser = require('cheerio-without-node-native')

export default function (html, type) {
  const $ = parser.load(html, {
    decodeEntities: true
  })

  const list = []

  if (type === 'topic') {
    $('ul form li').each(function (i, elem) {
      const $this = $(this)
      const img = $this.find('img').attr('src')
      const text = $this.text()
      const arr = text.split('\n').map(item => item.replace(/\t/g, '').trim()).filter(item => item)
      // arr.shift()
      const matched = $this.find('.title a').attr('href').match(/\d+/)
      const id = matched ? matched[0] : arr[1] + arr[2]
      const mock = {
        count: '',
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
  } else if (type === 'gene') {
    $('ul form li').each(function (i, elem) {
      const $this = $(this)
      const img = $this.find('img').attr('src')
      const thumbs = Array.from($this.find('img').map(function (i, elem) {
        return $(this).attr('src')
      }).filter(index => !!index))

      const text = $this.text()
      const arr = text.split('\n').map(item => item.replace(/\t/g, '').trim()).filter(item => item)
      const matched = $this.find('.meta').prev().attr('onclick').match(/\d+/)
      const id = matched ? matched[0] : arr[1] + arr[2]
      arr.shift()
      const nextArr = arr.slice(-3)
      let circle = $this.find('a.node').text() || ''
      let base = 1
      if (!circle) base = 0
      const mock = {
        circle,
        content: arr.slice(base, -3).join('\n') || arr[0],
        psnid: nextArr[0],
        date: nextArr[1],
        avatar: img,
        url: $this.find('.meta').prev().attr('onclick'),
        id,
        thumbs,
        count: nextArr[2],
        type: nextArr[2]
      }
      list.push(mock)
    })
  } else if (type === 'psnid') {
    $('table tr').each(function (i, elem) {
      const $this = $(this)
      const info = {}

      const text = $this.text()
      const arr = text.split('\n').map(item => item.trim()).filter(item => item)
      arr.unshift('')
      info.rank = arr[0]
      info.avatar = $this.find('img').attr('src')
      info.href = $this.find('a').attr('href')
      info.psnid = arr[1]
      info.exp = ($this.find('[class=twoge]').html() || '').replace(/<.*?>/igm, ' ').split(' ').filter(item => item).pop(),
      info.level = ($this.find('[class=twoge]').html() || '').split('<')[0],
      info.content = `<div>${$this.find('p').parent().html().trim().replace(/<p>.*?<\/p>/,'')}</div>`
      info.games = arr[3]
      info.id = arr[1]
      info.perfectRate =arr[4]
      info.platinum = arr[5]
      info.gold = arr[6]
      info.silver = arr[7]
      info.url = $this.find('a').attr('href')
      info.bronze = arr[8]
      info.type = 'general'
      list.push(info)
    })
  } else if (type === 'qa') {
    $('ul form li').each(function (i, elem) {
      const $this = $(this)
      const img = $this.find('img').attr('src')
      const text = $this.text()
      const arr = text.split('\n').map(item => item.replace(/\t/g, '')).filter(item => item)

      const matched = $this.find('.title a').attr('href').match(/\d+/)
      const id = matched ? matched[0] : arr[1] + arr[2]
      arr.shift()
      const mock = {
        count: parseInt(arr[3]),
        views: 1,
        title: arr[0],
        psnid: arr[1],
        date: arr[2],
        avatar: img,
        id,
        url: $this.find('.title a').attr('href'),
        platform: arr.slice(-1).pop()
      }
      list.push(mock)
    })
  }

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
    numPages: page.length >= 2 ? parseInt(page[page.length - 2].text) : 1,
    len: parseInt($('.page li').find('.disabled a').last().html())
  }
}
