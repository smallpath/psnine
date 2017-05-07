import parser from 'cheerio-without-node-native'

export default function (html) {
  const $ = parser.load(html, {
    decodeEntities: false
  })

  const all = $('.mt20')

  const len = all.find('.page li').find('.disabled a').last().html()

  const numPages = Math.ceil(parseInt(len) / 60)
  
  const commentList = []
  all.last().find('.post').each(function(i, elem) {
    const $this = $(this)
    const id = $this.attr('id')
    if (!id) {
      commentList.push({
        isGettingMoreComment: true
      })
      return
    }
    const img = $this.find('img').attr('src')
    const psnid = $this.find('.meta a').filter(function(i, elem) {
      return $(this).attr('class') === 'psnnode'
    }).text()
    let content = $this.find('.content').length ? 
        $this.find('.content').html().replace(/\<br\>/igm, '\n').replace('\n', '').replace(/\t/igm, '') : 'not found'
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
    len: parseInt(len),
    numPages,
    numberPerPage: 60,
    commentList: commentList
  }
}