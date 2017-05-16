import parser from 'cheerio-without-node-native'

export default function (html) {
  const $ = parser.load(html, {
    decodeEntities: false
  })

  const all = $('.main .box')

  const body = Array.from(all.children().filter(function (i, el) {
    const $this = $(this)
    return $this.attr('class') === 'content pd10' || $this.attr('align') === 'center';
  }).map(function (i, elem) {
    return $(this).html()
  }))

  const contentInfo = {
    html: `<div>${body.join('').trim()}</div>`
  }

  return {
    contentInfo
  }
}