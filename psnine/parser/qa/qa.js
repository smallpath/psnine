import parser from 'cheerio-without-node-native'

export default function (html) {
  const $ = parser.load(html, {
    decodeEntities: true
  })
  const all = $('.main .box')
  const shareInfo = {}
  all.find('.psnnode').first().parent().parent().find('div.meta span.r a').each(function (i, elem){
    const $this = $(this)
    const text = $this.text()
    const href = $this.attr('href')
    if (text === '出处') {
      shareInfo.source = href
    } else if (text === '微博') {
      shareInfo.weibo = href
    } else if (text === '微信') {
      shareInfo.weixin = (($this.attr('onclick') || '').match(/content:\'(.*?)\'/)||[0, -1])[1]
    }
  })

  all.find('.psnnode').parent().parent().next().find('.meta a').each(function (i, elem) {
    const $this = $(this)
    const text = $this.text()
    const href = $this.attr('href')
    // console.log(text, text === '编辑', href)
    if (text === '编辑') {
      shareInfo.edit = href
    }
  })
  const side = $('.side p a.title2')
  const titleText = all.find('.pd10 h1').text()
  const titleInfo = {
    title: titleText,
    psnid: side.text(),
    avatar: side.parent().prev().find('img').attr('src'),
    date: (all.find('.pd10 div.meta a.psnnode').next().text() || '').trim(),
    shareInfo
  }

  // console.log(shareInfo)

  const body = all.children().filter(function (i, el) {
    const $this = $(this)
    return $this.attr('class') === 'content pd10' || $this.attr('align') === 'center';
  })
  const page = []

  all.find('.page a').each(function (i, elem) {
    const $this = $(this)
    const url = 'https://psnine.com' + $this.attr('href')
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
      info.date = $this.find('.meta span.r').next('span').text()
      info.url = $this.find('img').parent().attr('href')
      info.psnid = $this.find('img').parent().next().find('a').first().text()
      info.caina = false
      info.qid = 0
      info.isAccepted = false
      if ($this.find('a.psnnode').prev().text() === '本条答案已被采纳') {
        info.isAccepted = true
      }
      if (info.psnid.includes('采纳这个答案')) {
        info.caina = true
        info.psnid = $this.find('a.psnnode').text()
        info.qid = ($this.find('a.psnnode').prev().attr('onclick').split(',') || ['', ''] )[1].replace(/\'/igm, '')
      }
      // console.log(info, $this.find('a.psnnode').prev().text())
      info.text = $this.find('img').parent().next().find('a').parent().next().html()
      const son = $this.find('ul.sonlist li')
      info.commentList = []
      info.editcomment = $this.find('textarea[name=content]').text()
      const arr = ($this.find('span.r a').first().attr('onclick') || '').match(/(\d+)/)
      const id = arr && arr[1] ? arr[1] : 0
      info.id = id.toString()
      info.count = parseInt(($this.find('.text-success').text() || '').replace('顶(', ''))
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