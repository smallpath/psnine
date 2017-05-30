import parser from 'cheerio-without-node-native'

export default function (html) {
  const $ = parser.load(html, {
    decodeEntities: false
  })

  const all = $('.main .box')
  const titleArr = all.children().first().text().split('\n').map(item => item.replace(/\t/g, '').replace(/\&nbsp;/igm, '').trim()).filter(item => item)
  const titleText = all.find('.pd10').first().children().first().html().replace(/\<br\>/igm, '\n')
  const titleInfo = {
    title: titleText,
    psnid: titleArr.slice(-3).shift(),
    date: titleArr.slice(-2).shift().replace('编辑', ''),
    reply: titleArr.slice(-1).shift(),
    content: titleArr.slice(5, -3).pop(),
    tableText: titleArr.slice(5, -4).map(item => `${item.slice(0, 2)}：${item.slice(2)}`),
    table: titleArr.slice(5, -4).map(item => item.slice(2))
  }

  const body = Array.from(all.children().filter(function (i, el) {
    const $this = $(this)
    return $this.attr('class') === 'content pd10' || $this.attr('align') === 'center';
  }).map(function (i, elem) {
    return $(this).html()
  }))
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
    const regionArr = arr.slice(1, startIndex)
    const trophyArr = arr.slice(startIndex)
    const mock = {
      title: title,
      avatar: img,
      id,
      region: regionArr.map(item => item.replace('&nbsp;', ' ')).join(''),
      platium: trophyArr[0],
      gold: trophyArr[1],
      selver: trophyArr[2],
      bronze: trophyArr[3],
      platform: arr[0].replace(title, '')
    }

    gameTable.push(mock)
  })

  const contentInfo = {
    html: `<div>${(body.join('') || '').trim()}</div>`,
    page: page,
    gameTable
  }
  // console.log(body.html())
  const commentList = []
  all.last().find('.post').each(function (i, elem) {
    const $this = $(this)
    const id = $this.attr('id')
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
      id,
      img,
      psnid,
      content,
      date,
      isGettingMoreComment: false
    })
  })

  return {
    titleInfo,
    contentInfo,
    commentList: commentList
  }
}