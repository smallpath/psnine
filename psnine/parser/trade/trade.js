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
    content: all.find('.content').html(),
    tableText: titleArr.slice(2, -4).map(item => `${item.slice(0, 2)}：${item.slice(2)}`),
    table: titleArr.slice(2, -4).map(item => item.slice(2)),
    warning: all.find('h1').next().text(),
    edit: '',
    dalao: ''
  }
  $('.psnnode').parent().parent().next().find('.meta a').each(function (i, elem) {
    const $this = $(this)
    const text = $this.text()
    const href = $this.attr('href')
    if (text === '编辑') {
      titleInfo.edit = href
    } else if (text === '打捞') {
      titleInfo.dalao = ($this.attr('onclick').split(',') || ['', ''] )[1].replace(/\'/igm, '').replace(')', '')
    }
  })

  // console.log(titleInfo)

  const body = Array.from(all.children().filter(function (i, el) {
    const $this = $(this)
    return $this.attr('class') === 'content pd10' || $this.attr('align') === 'center';
  }).map(function (i, elem) {
    return $(this).html()
  }))

  const contentInfo = {
    html: `<div>${(body.join('') || '').trim()}</div>`
  }
  // console.log(body.html())
  const commentList = []
  all.last().find('.post').each(function (i, elem) {
    const $this = $(this)
    const id = i + '1'
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
      id: id.replace('comment-', ''),
      img,
      psnid,
      content,
      editcomment: $this.find('form.mt10 textarea[name=content]').text(),
      count: parseInt(($this.find('.text-success').text() || '').replace('顶(', '')),
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