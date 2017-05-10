const parser = require('cheerio-without-node-native')

export default function parseThophy(html) {
  const $ = parser.load(html, {
    decodeEntities: false
  })
  const all = $('.mt40 .main')
  const childrens = all.children()
  // console.log(childrens.length)

  const gameInfo = {}
  const game = $('.mt40 div.box img.imgbgnb').parent()

  if (game.length !== 0) {
    gameInfo.avatar = game.find('img').attr('src')
    gameInfo.title = (game.find('h1').contents().filter(function () { return this.nodeType === 3 }).text() || '').trim()
    gameInfo.trophy = Array.from(game.find('em span').map(function (i, elem) { return $(this).text() }))
    gameInfo.platform = Array.from(game.find('h1 span').map(function (i, elem) { return $(this).text() }))
  }

  const commentList = []

  $('ul.list').children().each(function (i, elem) {
    const $this = $(this)
    const info = {}
    info.avatar = $this.find('img').attr('src')
    info.url = $this.find('img').parent().attr('href')
    info.psnid = $this.find('img').parent().next().find('a').text()
    info.text = $this.find('img').parent().next().find('a').parent().next().html()
    const son = $this.find('ul.sonlist li')
    info.commentList = []
    if (son.length !== 0) {
      son.each(function (j, elem) {
        const that = $(this)
        const child = {}
        child.time = (that.find('.r span').text() || '').trim()
        child.psnid = that.find('.psnnode').text()
        child.url = that.find('.psnnode').attr('href')
        child.text = (that.find('.content').contents().filter(function () { return this.nodeType === 3 }).text() || '').trim()
        info.commentList.push(child)
      })
    }
    commentList.push(info)

  })

  return {
    gameInfo,
    commentList
  }
}
