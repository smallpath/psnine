import parser from 'cheerio-without-node-native'

export default function (html) {
  const $ = parser.load(html, {
    decodeEntities: false
  })

  const all = $('.main .box')

  const body = all.children().filter(function (i, el) {
    const $this = $(this)
    return $this.attr('class') === 'content pd10' || $this.attr('align') === 'center';
  })

  const contentInfo = {
    html: `<div>${body.html().trim()}</div>`
  }

  return {
    contentInfo
  }
}