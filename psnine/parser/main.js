import parser from 'cheerio-without-node-native'

export default function (html) {
  
  let $ = parser.load(html, {
    decodeEntities: false
  })

  const hotGames = []
  $('div.showbar a').each(function(i, elem) {
    const $this = $(this)
    const href = $this.attr('href')
    hotGames.push({
      img: $this.find('img').attr('src'),
      href,
      url: href,
      id: href,
    })
  })
  const nodes = []
  $('.box .cloud a').each(function(i, elem) {
    const $this = $(this)
    const href = $this.attr('href')
    nodes.push({
      text: $this.text(),
      href,
      url: href,
      id: href.split('/').pop(),
    })
  })
  
  const tips = []
  $('ul.darklist').first().find('li').each(function(i, elem) {
    const $this = $(this)
    // console.log('??')
    const href = $this.find('a').attr('href')
    const img = $this.find('img').attr('src')
    tips.push({
      img,
      href,
      url: href,
      date: $this.find('p').text(),
      id: href.split('/').pop(),
      psnid: $this.find('.ml64 a').text()
    })
  })
  
  const comment = []
  $('ul.darklist').first().next().next().find('li').each(function(i, elem) {
    const $this = $(this)
    // console.log('??')
    const href = $this.find('a').attr('href')
    const img = $this.find('img').attr('src')
    comment.push({
      img,
      href,
      url: href,
      date: $this.find('p').text(),
      id: href.split('/').slice(-2)[0],
      psnid: $this.find('.ml100 a').text()
    })
  })

  let warning = $('.box .alert-warning').html() || $('.box .alert-error').html() || $('.box .alert-info').html() || $('.box .alert-success').html() || ''

  const list = []

  $ = parser.load(html, {
    decodeEntities: true
  })

  $('ul.list li').each(function (i, elem) {
    const $this = $(this)
    const img = $this.find('img').attr('src')
    const text = $this.text()
    const arr = text.split('\n').map(item => item.replace(/\t/g, '').trim()).filter(item => item)
    if (isNaN(parseInt(arr))) arr.unshift(0)
    const matched = $this.find('.title a').attr('href').match(/\d+/)
    const id = matched ? matched[0] : arr[1] + arr[2]
    const mock = {
      count: parseInt(arr[0]),
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

  return {
    hotGames,
    nodes,
    tips,
    comment,
    warning,
    list
  }
}