import parser from 'cheerio-without-node-native'

export default function (html) {
  const $ = parser.load(html, {
    decodeEntities: true
  })

  const list = []

  $('ul.list li').each(function (i, elem) {
    const $this = $(this)
    const href = $this.find('a').attr('href')
    list.push({
      title: $this.find('a').text(),
      url: href,
      id: href.split('/').pop(),
      content: $.html($this.find('blockquote'))
    })
  })

  return list
}
