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
    let content = $this.find('.content').html()
    const psnid = $this.find('a.psnnode').text()
    const url = $this.find('a.psnnode').prev().attr('href')

    const mock = {
      content,
      from,
      psnid,
      id: url.split('/').pop().match(/\d+/)[0],
      url
    }

    result.push(mock)
  })
  return result
}