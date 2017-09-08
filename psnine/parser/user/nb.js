import parser from 'cheerio-without-node-native'

export default function (html, psnid) {
  const $ = parser.load(html, {
    decodeEntities: true
  })

  return ($('.alert-warning').text() || '').trim()
}