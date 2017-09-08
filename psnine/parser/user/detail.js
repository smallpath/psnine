import parser from 'cheerio-without-node-native'

export default function (html, psnid) {
  const $ = parser.load(html, {
    decodeEntities: false
  })

  const vipInfo = {}

  $('table').each(function (i, elem) {
    const $this = $(this)
    if (i === 0) {
      vipInfo.zb = $this.find('.pd15').first().text()
      vipInfo.level = $this.find('.pd15').last().text()
    } else if (i === 1) {
      vipInfo.ssInfo = ($this.find('.pd15').html().match(/<br>(.*?)<a/) || [0, 'Not Found'])[1]
      vipInfo.serverInfo = []
      $('ul.list li').each(function (j, elem) {
        vipInfo.serverInfo.push({
          name: $(this).html().match(/<span class=\"r\">(.*?)</)[1],
          ip: $(this).html().match(/<\/span>(.*?)$/)[1]
        })
      })
    } else if (i === 2) {
      vipInfo.history = $.html($this)
    }
  })

  return {
    vipInfo
  }
}