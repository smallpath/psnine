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
  return list
}