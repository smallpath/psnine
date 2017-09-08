import parser from 'cheerio-without-node-native'

export default function (html) {
  const $ = parser.load(html, {
    decodeEntities: false
  })

  const result = []
  $('ul.list li').each(function (i, elem) {
    const $this = $(this)
    result.push({
      url: $this.find('a').attr('href'),
      text: $this.find('a').text() || ''
    })
  })
  // console.log(html)

  return result
}