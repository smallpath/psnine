import parser from 'cheerio-without-node-native'

export default function (html) {

  const $ = parser.load(html, {
    decodeEntities: true
  })
  
  const list = []
  $('ul[class=dd_ul]').find('li').each(function (i, elem) {
    const $this = $(this)
    const img = $this.find('img').attr('src')
    const text = $this.text()
    const arr = ($this.find('div').first().text() || '').split('\n').map(item => item.trim()).filter(item => item)
    const contentArr = Array.from($this.children('div').last().contents().map(function() { 
        return $(this).html() || $(this).text() || '' 
      })
    ).map(item => item.trim().replace(/\s+/igm, ' ')).filter(item => item)
    contentArr[contentArr.length - 1] = `<div class="pd10">${contentArr[contentArr.length - 1].replace(/\<\/.*?>/igm, text => text + '&nbsp;')}</div>`
    const prevContent = contentArr.join('<br>')
    const storeLink = prevContent.match(/store\(\'(.*?)\',\'(.*?)\'/)
    const isOK = storeLink && storeLink[1] && storeLink[2]
    const onclick = isOK ? `http://psnine.com/store/${storeLink[1]}::${storeLink[2]}` : ''
    const mock = {
      avatar: img,
      platform: arr[0],
      price: arr[1],
      content: prevContent.replace('javascript:void(0)', onclick),
      id: ($this.find('.dd_title a').attr('href') || '').split('/').pop(),
      isOff: $this.find('.dd_status').text(),
      type: 'outter'
    }
    if (!mock.id) {
      mock.id = ($this.find('.dd_info a').attr('href') || '').split('/').pop()
      mock.type = 'inner'
    }
    list.push(mock)
  })
  const games = []
  const matched = html.match(/<title>(.*?)<\/title>/)
  const title = matched ? matched[1] : '游折'
    $('tr').each(function (i, elem) {

    const $this = $(this)
    const img = $this.find('img').attr('src')

    const text = $this.text()
    const arr = text.split('\n').map(item => item.replace(/\t/g, '').trim()).filter(item => item.trim())

    const title = $this.find('td p a').text()
    const matched = img.match(/\/(\d+)\./)

    const id = matched ? matched[1] : arr[1] + arr[2]

    const startIndex = arr.some(item => item.includes('%')) ? -8 : -7
    const regionArr = arr.slice(1, startIndex)
    const trophyArr = arr.slice(startIndex)

    const mock = {
      title: title,
      avatar: img,
      id,
      region: regionArr.join(''),
      platium: trophyArr[1],
      gold: trophyArr[2],
      selver: trophyArr[3],
      bronze: trophyArr[4],
      platform: $this.find('td p span').text()
    }

    games.push(mock)
  })
  return {
    list,
    games,
    title
  }
}