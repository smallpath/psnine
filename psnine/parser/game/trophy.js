const parser = require('cheerio-without-node-native')

export default function parseThophy (html) {
  const $ = parser.load(html, {
    decodeEntities: false
  })
  const all = $('.mt40 .main')
  const childrens = all.children()
  // console.log(childrens.length)

  const trophy = $('.mt40 div.l')

  const trophyInfo = {}
  if (trophy.length !== 0) {
    trophyInfo.title = trophy.parent().find('h1').text()
    trophyInfo.text = trophy.parent().find('h1').next().text()
    trophyInfo.avatar = trophy.find('img').attr('src')
  }

  const gameInfo = {}
  const game = $('ul.darklist li')

  if (game.length !==0) {
    gameInfo.avatar = game.find('img').attr('src')
    gameInfo.url = game.find('a').attr('href')
    gameInfo.title = game.find('a').text()
    gameInfo.platform = Array.from(game.find('p span').map(function(i, elem) { return $(this).text() }))
  }

  const commentList = []

  if ($('ul.list').length !== 0) {
    $('ul.list').children().each(function(i, elem) {
      const $this = $(this)
      const info = {}
      info.avatar = $this.find('img').attr('src')
      info.date =$this.find('img').parent().next().next().find('a').parent().next().text()
      info.url = $this.find('img').parent().attr('href')
      info.psnid = $this.find('img').parent().next().find('a').first().text()
      info.text = $this.find('img').parent().next().find('a').parent().next().html()
      const son = $this.find('ul.sonlist li')
      info.commentList = []
      info.id = $this.attr('id')
      if (son.length !== 0) {
        son.each(function(j, elem) {
          const that = $(this)
          const child = {}
          child.time = (that.find('.r span').text() || '').trim()
          child.psnid = that.find('.psnnode').text()
          child.url = that.find('.psnnode').attr('href')
          child.text = '<div>' +(that.find('.content').html().replace(`<span class="meta">${that.find('.content').children().html()}</span>`, '').trim() || '').trim().replace('\n\t\t', '') + '</div>'
          console.log(child.text)
          child.id = `son-comment-${j}`
          child.shouldDisplay = (that.attr('style') || '').includes('display:none') === false
          info.commentList.push(child)
        })
      }
      commentList.push(info)
      
    })
  } else {
    $('.box .post').each(function(i, elem) {
      const $this = $(this)
      const info = {}
      info.avatar = $this.find('img').attr('src')
      info.date = ($this.find('.meta').contents().filter(function(){return this.nodeType === 3}).text() || '').trim()
      info.url = $this.find('img').parent().attr('href')
      info.psnid = $this.find('img').parent().next().find('a').last().text()
      info.text = ($this.find('.meta').prev().html() || '').trim()
      info.commentList = []
      info.id = $this.attr('id')
      commentList.push(info)
    })
  }

  return {
    trophyInfo,
    gameInfo,
    commentList
  }
}
