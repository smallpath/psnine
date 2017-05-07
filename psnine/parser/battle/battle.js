import parser from 'cheerio-without-node-native'

export default function (html) {
  const $ = parser.load(html, {
    decodeEntities: false
  })

  const all = $('.mt40')
  const body = all.find('.content').filter(function (i, elem) {
    const isContent = $(this).attr('class') === 'content pd15'
    return isContent
  })
  const titleInfo = {}


  let game = {}

  const trophyTable = []


  all.find('tr').each(function (i, elem) {

    if (i === 0) {
      $(this).find('td').each(function (j, elem) {
        if (j > 1) return
        const $this = $(this)
        // Game infor
        if (j === 0) {
          game.avatar = $this.find('img').attr('src')
          game.url = $this.find('a').attr('href')
        } else {
          const text = $this.text().split('\n').map(item => item.trim()).filter(item => item)
          game.title = text[0]
          game.psnid = text.slice(1)[0]
          game.date = text.slice(1)[1]
        }
      })
    } else {

      const $this = $(this)
      const arr = $this.text().split('\n').map(item => item.trim()).filter(item => item)

      trophyTable.push({
        avatar: $this.find('img').attr('src'),
        title: arr[0],
        tip: arr[1].includes('Tips') ? arr[1] : '',
        href: $this.find('a').attr('href'),
        text: arr.slice(-2)[0],
        rare: (arr.slice(-2)[1] || '').replace('珍贵度', '')
      })
    }
  })

  let content = body.length ? body.text() : ''
  const contentInfo = {
    html: `<div>${content.trim()}</div>`,
    trophyTable,
    game
  }

  const commentList = []
  all.find('.post').each(function(i, elem) {
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
    titleInfo,
    contentInfo,
    commentList
  }
}