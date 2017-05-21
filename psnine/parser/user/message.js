import parser from 'cheerio-without-node-native'

export default function (html) {
  const $ = parser.load(html)
  const result = []

  $('ul.list li').each(function (i, elem) {
    const $this = $(this)
    // const img = $this.find('img').attr('src')
    const from = Array.from($this.find('a').map(function (i, elem) {
      return $(this).text()
    }))[1]
    const text = $this.text()
    let content = $this.find('.content').html().replace(/<a.*?class="font12 r">.*?<\/a>/, '')
    const psnid = $this.find('a.psnnode').text()
    const url = $this.find('a.psnnode').prev().attr('href')
    const matchedComment = url.match(/comment\-(\d+)$/)
    const matchedID = url.match(/\/(\d+)$/)

    const mock = {
      content,
      from,
      psnid,
      id: matchedComment ? matchedComment[1] : matchedID ? matchedID[1] : url,
      url
    }

    result.push(mock)
  })
  return result
}