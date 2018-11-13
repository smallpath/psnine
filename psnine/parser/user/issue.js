const parser = require('cheerio-without-node-native')

export default function (html, type) {
  const $ = parser.load(html, {
    decodeEntities: true
  })

  const list = []

  if (type === 'topic') {
    $('ul.list li').each(function (i, elem) {
      const $this = $(this)
      const img = $this.find('img').attr('src')
      const text = $this.text()
      const arr = text.split('\n').map(item => item.replace(/\t/g, '').trim()).filter(item => item)
      // arr.shift()
      const matched = $this.find('.title a').attr('href').match(/\d+/)
      const id = matched ? matched[0] : arr[1] + arr[2]
      const base = $this.find('.rep').text() ? 1 : 0
      const mock = {
        count: $this.find('.rep').text() || 0,
        views: 1,
        title: arr[base],
        psnid: arr[base + 1],
        date: arr[base + 2],
        avatar: img,
        id,
        edit: ($this.find('.title a').attr('href') || '') + '/edit',
        type: arr[base + 3]
      }
      // console.log(mock, arr)
      list.push(mock)
    })
  } else if (type === 'gene') {
    $('ul.list li').each(function (i, elem) {
      const $this = $(this)
      const img = $this.find('img').attr('src')
      const thumbs = Array.from($this.find('img').map(function (i, elem) {
        return $(this).attr('src')
      }).filter(index => !!index))

      const text = $this.text()
      const arr = text.split('\n').map(item => item.replace(/\t/g, '').trim()).filter(item => item)
      const href = $this.find('.content')[0].parent.attribs.href
      const matched = href.match(/\d+/)
      // console.log($this.find('.content')[0].parent.attribs.href, matched)
      const id = matched ? matched[0] : arr[1] + arr[2]
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
        url: href,
        edit: href + '/edit',
        id,
        thumbs,
        count: nextArr[2],
        type: nextArr[2],
        circleHref: ($this.find('a.node').attr('href') || '').trim()
      }
      // console.log($this.find('div.ml64 a').attr('href'), $this.find('div.ml64 a').attr('href').match(/\d+/))
      list.push(mock)
    })
  } else if (type === 'trade') {
    $('ul.list li').each(function (i, elem) {
      const $this = $(this)
      const img = $this.find('img').attr('src')
      const thumbs = Array.from($this.find('img').map(function (i, elem) {
        return $(this).attr('src')
      }).filter(index => !!index))

      const text = $this.text()
      const arr = text.split('\n').map(item => item.replace(/\t/g, '').trim()).filter(item => item)

      const nextArr = arr.slice(-3)
      const mock = {
        title: $this.find('div.title').text().replace(/(.*?)元/, '').trim(),
        content: arr.slice(1, -3).join('\n'),
        psnid: nextArr[0],
        date: nextArr[1].replace(/&nbsp;/igm, ''),
        avatar: img,
        href: $this.attr('onclick').match(/\'(.*?)\'/)[1],
        id: ($this.attr('onclick').match(/trade\/(\d+)/) || [0, -1])[1],
        thumbs,
        price: $this.find('.title .r').text(),
        count: nextArr[2]
      }
      mock.edit = 'https://psnine.com/trade/' + mock.id + '/edit'
      list.push(mock)
    })
  } else if (type === 'qa') {
    $('ul.list li').each(function (i, elem) {
      const $this = $(this)
      const img = $this.find('img').attr('src')
      const text = $this.text()
      let arr = text.split('\n').map(item => item.replace(/\t/g, '')).filter(item => item)

      arr = [arr[0], ...arr.slice(-4)]
      const matched = $this.find('.title a').attr('href').match(/\d+/)
      const id = matched ? matched[0] : arr[1] + arr[2]
      // arr.shift()
      // console.log(arr)
      const mock = {
        count: parseInt(arr[3]),
        views: 1,
        title: arr[0],
        psnid: arr[1],
        date: arr[2],
        avatar: img,
        edit: ($this.find('.title a').attr('href') || '') + '/edit',
        id,
        url: $this.find('.title a').attr('href'),
        platform: arr.slice(-1).pop()
      }
      list.push(mock)
    })
  } else if (type === 'battle') {
    $('tr').each(function (i, elem) {
      const $this = $(this)
      const thumbs = Array.from($this.find('img').map(function (i, elem) {
        return $(this).attr('src')
      }))

      const text = $this.text()
      const platform = Array.from($this.find('.pd10 p span').map(function (i, elem) {
        return $(this).text()
      }))
      let arr = text.split('\n').map(item => item.replace(/\t/g, '')).filter(item => item)
      let shouldConcat = false
      let isConcat = false
      arr = arr.reduce((prev, curr) => {
        if (shouldConcat === true) {
          prev[prev.length - 1] += curr
          isConcat = true
          shouldConcat = false
        }
        if (curr.charCodeAt(curr.length - 1) === 13) {
          shouldConcat = true
        }
        if (isConcat === false) {
          prev.push(curr)
        } else {
          isConcat = false
        }
        return prev
      }, [])
      const matched = $this.find('.pd15 p a').attr('href').match(/\d+/)
      const id = matched ? matched[0] : arr[1] + arr[2]
      const psnid = $this.find('.h-p a').attr('href').split('/').slice(-1).join('')
      const numArr = arr[4] ? arr[4].match(/\d+/) : ['2']
      const mock = {
        count: arr[1].match(/\d+/)[0],
        title: arr[2],
        psnid,
        date: arr[3].replace('开始', ''),
        game: arr[0].replace(platform.join(''), ''),
        gameAvatar: thumbs[1],
        avatar: thumbs[0],
        edit: $this.find('.pd15 p a').attr('href') + '/edit',
        num: numArr ? numArr[0] : arr[4],
        platform,
        id
      }
      list.push(mock)
    })
  }

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

  return {
    list,
    page,
    numberPerPage: 30, // ??
    numPages: page.length >= 2 ? parseInt(page[page.length - 2].text) : 1,
    len: parseInt($('.page li').find('.disabled a').last().html())
  }
}
