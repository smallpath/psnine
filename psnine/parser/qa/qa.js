import parser from 'cheerio-without-node-native'

export default function (html) {
  const $ = parser.load(html, {
    decodeEntities: true
  })

  const all = $('.main .box')
  const side = $('.side p a.title2')
  const titleText = all.find('.pd10 h1').text()
  const titleInfo = {
    title: titleText,
    psnid: side.text(),
    avatar: side.parent().prev().find('img').attr('src'),
    date: (all.find('.pd10 div.meta a.psnnode').next().text() || '').trim(),
  }

  const body = all.children().filter(function (i, el) {
    const $this = $(this)
    return $this.attr('class') === 'content pd10' || $this.attr('align') === 'center';
  })
  const page = []

  all.find('.page a').each(function (i, elem) {
    const $this = $(this)
    const url = 'http://psnine.com' + $this.attr('href')
    const text = $this.text()
    page.push({
      url,
      text
    })
  })

  const gameInfo = {}
  const game = $('ul.darklist li')

  if (game.length !== 0) {
    gameInfo.avatar = game.find('img').attr('src')
    gameInfo.url = game.find('a').attr('href')
    gameInfo.title = game.find('a').text()
    gameInfo.platform = Array.from(game.find('p span').map(function (i, elem) { return $(this).text() }))
  }

  const contentInfo = {
    html: `<div>${(body.html() || '').trim()}</div>`,
    page: page
  }
  // console.log(body.html())
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
          that.find('.content').remove('span')

          child.text = that.find('.content').html().replace(`<span class="meta">${that.find('.content').children().html()}</span>`, '').trim().replace('\n\t\t', '')
          child.id = `son-comment-${j}`
          child.shouldDisplay = (that.attr('style') || '').includes('display:none') === false

          info.commentList.push(child)
        })
      }
      commentList.push(info)

    })
  }
  return {
    contentInfo,
    gameInfo,
    titleInfo,
    commentList
  }
}