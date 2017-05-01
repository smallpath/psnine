import parser from 'cheerio-without-node-native'

export default function (html) {
  const $ = parser.load(html, {
    decodeEntities: false
  })

  const all = $('.main .box')
  const titleArr = all.children().first().text().split('\n').map(item => item.replace(/\t/g, '').trim()).filter(item => item)
  const titleText =  all.find('.pd10').first().children().first().html().replace(/\<br\>/igm, '\n')
  const titleInfo = {
    title: titleText,
    psnid: titleArr[1],
    date: titleArr[2],
    reply: titleArr[3],
    node: titleArr.slice(4).join(' ')
  }

  const body = all.children().filter(function(i, el) {
    return $(this).attr('class') === 'content pd10';
  })
  const contentInfo = {
    html: body.html()
  }
  
  const commentList = all.last().find('.post').map(function(i, elem) {
    const $this = $(this)
    const id = $this.attr('id')
    const img = $this.find('img').attr('src')
    const psnid = $this.find('.meta a').text()
    const content = $this.find('.content').html().replace(/\<br\>/igm, '\n')
    const date = $this.find('.meta').text().split('\n').filter(item => item.trim()).pop().replace(/\t/g, '')
    return {
      id,
      img,
      psnid,
      content,
      date
    }
  })

  return {
    titleInfo,
    contentInfo,
    commentList: Array.from(commentList)
  }
}