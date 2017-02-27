import parser from 'cheerio-without-node-native'

export default function (html) {
  const $ = parser.load(html)
  const result = []

  $('ul.list li').each(function(i, elem) {
    const $this = $(this)
    // const img = $this.find('img').attr('src')
    const from = Array.from($this.find('a').map(function(i, elem){
      return $(this).text()
    }))[1]
    const text = $this.text()
    let content = text.split('\n').map(item => item.replace(/\t/g, '')).filter(item => item)[1].replace(from, '')
    const id = $this.find('a').attr('href')

    const mock = {
      content,
      from,
      id
    }

    result.push(mock)
  })
  return result
}