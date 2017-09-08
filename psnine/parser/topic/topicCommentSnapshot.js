import parser from 'cheerio-without-node-native'

export default function (html, type = 'gene') {
  const $ = parser.load(html, {
    decodeEntities: false
  })

  let all = $('.main .box')
  if (all.length === 0) all = $('.inner .box')

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
    commentList: commentList
  }
}