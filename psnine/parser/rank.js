import parser from 'cheerio-without-node-native'

export default function (html) {
  const $ = parser.load(html, {
    decodeEntities: true
  })
  const result = []
  const totalPage = parseInt($('.page li.disabled').last().prev().text() || 1)
  $('table tr').each(function (i, elem) {
    const $this = $(this)
    const info = {}
    // console.log($this.text())
    $this.find('td').each(function (j, elem) {
      const that = $(this)
      if (j === 0) {
        info.rank = that.text()
      } else if (j === 1) {
        info.avatar = that.find('img').attr('src')
        info.href = that.find('a').attr('href')
        info.psnid = that.find('a').attr('href').split('/').pop()
      } else if (j === 2) {
        info.content = `<div>${that.html().trim().replace(/<p>.*?<\/p>/,'')}</div>`
      } else if (j === 3) {
        info.exp = that.find('em').text()
        info.level = that.html().replace(/<em>.*?<\/em>/, '').trim()
      } else if (j === 4) {
        info.games = that.text()
      } else if (j === 5) {
        info.perfectRate = that.text()
      } else if (j === 6) {
        info.platinum = that.text()
      } else if (j === 7) {
        info.gold = that.text()
      } else if (j === 8) {
        info.silver = that.text()
      } else if (j === 9) {
        info.bronze = that.text()
      }
    })
    const text = $this.text()
    if (text.includes('Z币')) {
      info.type = 'zb'
    } else if (text.includes('N币')) {
      info.type = 'nb'
    } else if (text.includes('第一天签到')) {
      info.type = 'qidao'
    } else {
      info.type = 'general'
    }
    result.push(info)
  })

  return {
    list: result,
    totalPage: totalPage
  }
}