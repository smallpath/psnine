import parser from 'cheerio-without-node-native'

export default function (html, type = 'gene') {
  const $ = parser.load(html, {
    decodeEntities: false
  })
  // console.log(html)
  let all = $('.main .box')
  if (all.length === 0) all = $('.inner .box')
  const titleArr = all.children('div[class=pd10]').first().text().split('\n').map(item => item.replace(/\t/g, '').replace(/\&nbsp;/igm, '').trim()).filter(item => item)
  const titleText = (all.children('div[class=pd10]').first().children().first().html() || '').replace(/\<br\>/igm, '\n')
  const shareInfo = {}
  // const str = all.find('.psnnode').first().parent().parent().find('div.meta span.r a').text()
  const element = all.find('a.node').text() || ''
  if (element) titleArr.shift()
  
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

  const sideGame = $('.side .hd3')
  const hd = sideGame.first().text()
  if (hd === '关联游戏') {
    shareInfo.linkGame = sideGame.next().find('a').last().text()
    shareInfo.linkGameUrl = sideGame.next().find('a').attr('href')
  }

  all.find('.psnnode').parent().parent().next().find('.meta a').each(function (i, elem) {
    const $this = $(this)
    const text = $this.text()
    const href = $this.attr('href')
    // console.log(text, text === '编辑', href)
    if (text === '编辑') {
      shareInfo.edit = href
    }
  })

  // console.log(titleArr)

  if (titleArr[1].includes('微博')) {
    titleArr.splice(1, 1)
  }

  const titleInfo = {
    title: titleText,
    psnid: titleArr[1],
    date: titleArr[2].replace('编辑', ''),
    reply: titleArr[3],
    node: titleArr.slice(5),
    shareInfo,
    avatar: $('.side img').attr('src')
  }

  if (element) {
    titleInfo.node = [element]
    titleInfo.title = all.find('.content').first().html() || ''
  }

  if (type !== 'gene') {
    titleInfo.title = all.find('h1').text()
  }

  // console.log(shareInfo, titleArr)

  const body = Array.from(all.children().filter(function (i, el) {
    const $this = $(this)
    return $this.attr('class') === 'content pd10' || ($this.attr('align') === 'center' && $this.parent().parent().attr('class') !== 'side' );
  }).map(function (i, elem) {
    return $(this).html()
  }))
  const page = []

  all.find('.page a').each(function (i, elem) {
    const $this = $(this)
    const url = 'https://psnine.com' + $this.attr('href')
    const text = $this.text()
    page.push({
      url,
      text,
      isCurrent: $this.parent().attr('class') === 'current'
    })
  })

  const external = []
  all.find('dd a').each(function (i, elem) {
    const $this = $(this)
    const url = $this.attr('href')
    const text = $this.text()
    external.push({
      url,
      text
    })
  })

  const gameTable = []

  all.find('.list').find('table tr').each(function (i, elem) {

    const $this = $(this)
    const img = $this.find('img').attr('src')
    if (!img) return
    const text = $this.text()
    const arr = text.split('\n').map(item => item.replace(/\t/g, '').trim()).filter(item => item.trim())

    const title = $this.find('td p a').text()
    const matched = img.match(/\/(\d+)\./)

    const id = matched ? matched[1] : arr[1] + arr[2]

    const startIndex = arr.some(item => item.includes('%')) ? -6 : -5
    const regionArr = $this.find('p em').text().split('\n')
    const trophyArr = Array.from($this.find('.meta em').map(function(){return $(this).text()}))//arr.slice(startIndex)
    const firstRegion = ($this.find('.pd10 em').first().text() || '').split('\n')
    const mock = {
      title: title,
      avatar: img,
      id,
      region: regionArr.map(item => item.replace(/\&nbsp\;/igm, '').trim()).join(''),
      platium: trophyArr[0],
      gold: trophyArr[1],
      selver: trophyArr[2],
      bronze: trophyArr[3],
      platform: $this.find('.pd10 .meta').prev().find('span').text() || arr[0].replace(title, ''),
      blockquote: $this.find('blockquote') || ''
    }
    if (mock.blockquote) {
      mock.blockquote = $.html($this.find('blockquote'))
    }
    mock.alert = $this.find('.twoge span').text()
    mock.allPercent = $this.find('.twoge em').text()
    // if (i === 0) {
    //   console.log(firstRegion.map(item => item.replace(/\&nbsp\;/igm, '').trim()).join(''))
    //   console.log(regionArr.map(item => item.replace(/\&nbsp\;/igm, '')).join(''))
    // }
    gameTable.push(mock)
  })

  const contentInfo = {
    html: `<div>${(body.join('') || '').trim()}</div>`,
    page: page,
    gameTable,
    external
  }
  // console.log(external, page)
  const commentList = []
  all.find('.post').each(function (i, elem) {
    const $this = $(this)
    const arr = ($this.find('span.r a').first().attr('onclick') || '').match(/(\d+)/)
    let id = arr && arr[1] ? arr[1] : 0
    const shouldRevert = $this.find('form.mt10').length !== 0
    if (shouldRevert === false && $this.find('a').html() !== '查看更早的评论') {
      id = i + '1'
    }
    if (!id) {
      commentList.push({
        isGettingMoreComment: true
      })
      return
    }
    const img = $this.find('img').attr('src')
    const psnid = $this.find('.meta a').filter(function (i, elem) {
      return $(this).attr('class') === 'psnnode'
    }).text()
    let content = $this.find('.content').length ?
      $this.find('.content').html().trim() : 'not found'
    const date = $this.find('.meta').text().split('\n').map(item => item.replace(/\t/g, '')).filter(item => item.trim()).pop()
    commentList.push({
      id: id.toString().replace('comment-', ''),
      img,
      psnid,
      content,
      date,
      editcomment: $this.find('form.mt10 textarea[name=content]').text(),
      count: parseInt(($this.find('.text-success').text() || '').replace('顶(', '')),
      isGettingMoreComment: false
    })
  })

  return {
    titleInfo,
    contentInfo,
    commentList: commentList
  }
}