const parser = require('cheerio-without-node-native')

export default function parseThophy(html) {
  const $ = parser.load(html, {
    decodeEntities: false
  })
  const all = $('.mt40 .main')
  const childrens = all.children()
  // console.log(childrens.length)

  const trophy = $('.mt40 div.l')

  const gameInfo = {}
  const game = $('div.box').first()

  if (game) {
    gameInfo.platform = Array.from(game.find('h1 span').map(function (i, elem) { return $(this).text() }))
    gameInfo.title = (game.find('h1').text().match(new RegExp('《(.*?)》')) || ['', '解析错误'])[1]
    gameInfo.version = game.find('h1 em').text().split('\n').map(item => item.trim()).filter(item => item)
    gameInfo.trophyArr = Array.from(game.find('em span').map(function (i, elem) { return $(this).text() }))
    gameInfo.avatar = game.find('img').attr('src')
    const alert = game.find('em span').parent().next()
    if (alert.text()) {
      gameInfo.alert = alert.text()
      if (alert.next().text()) {
        gameInfo.rare = alert.next().text()
      }
    }
  }

  const commentList = []

  if ($('ul.list').length !== 0) {
    $('ul.list').children().each(function (i, elem) {
      const $this = $(this)
      const info = {}
      info.avatar = $this.find('img').attr('src')
      info.date = $this.find('img').parent().next().next().find('a').parent().next().text()
      info.url = $this.find('img').parent().attr('href')
      info.psnid = $this.find('img').parent().next().find('a').first().text()
      info.text = $this.find('img').parent().next().find('a').parent().next().html()
      const son = $this.find('ul.sonlist li')
      info.commentList = []
      info.id = $this.attr('id')
      if (son.length !== 0) {
        son.each(function (j, elem) {
          const that = $(this)
          const child = {}
          child.time = (that.find('.r span').text() || '').trim()
          child.psnid = that.find('.psnnode').text()
          child.url = that.find('.psnnode').attr('href')
          child.text = '<div>' + (that.find('.content').html().replace(`<span class="meta">${that.find('.content').children().html()}</span>`, '').trim() || '').trim().replace('\n\t\t', '') + '</div>'

          child.id = `son-comment-${j}`
          child.shouldDisplay = (that.attr('style') || '').includes('display:none') === false
          info.commentList.push(child)
        })
      }
      commentList.push(info)

    })
  } else {
    $('.box .post').each(function (i, elem) {
      const $this = $(this)
      const info = {}
      info.avatar = $this.find('img').attr('src')
      info.date = ($this.find('.meta').contents().filter(function () { return this.nodeType === 3 }).text() || '').trim()
      info.url = $this.find('img').parent().attr('href')
      info.psnid = $this.find('img').parent().next().find('a').last().text()
      info.text = ($this.find('.meta').prev().html() || '').trim()
      info.commentList = []
      info.id = $this.attr('id')
      commentList.push(info)
    })
  }

  return {
    gameInfo,
    commentList,
    isOldPage: html.includes('<input type="hidden" name="old" value="yes"')
  }
}