const parser = require('cheerio-without-node-native')

export default function parseThophy(html) {
  const $ = parser.load(html, {
    decodeEntities: false
  })
  const all = $('.mt40 .main')
  const commentList = []
  if ($('ul.list').length !== 0) {
    $('ul.list').children().each(function (i, elem) {
      const $this = $(this)
      const info = {}
      info.avatar = $this.find('img').attr('src')
      info.date = $this.find('.meta span.r').next('span').text()
      info.url = $this.find('img').parent().attr('href')
      info.psnid = $this.find('img').parent().next().find('a').first().text()
      info.text = $this.find('img').parent().next().find('a').parent().next().html()
      const son = $this.find('ul.sonlist li')
      info.commentList = []
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
          child.text = '<div>' + (that.find('.content').html().replace(`<span class="meta">${that.find('.content').children().html()}</span>`, '').trim() || '').trim().replace('\n\t\t', '') + '</div>'

          child.id = `son-comment-${j}`
          child.shouldDisplay = (that.attr('style') || '').includes('display:none') === false
          info.commentList.push(child)
        })
      }
      commentList.push(info)

    })
  }

  return {
    commentList
  }
}
