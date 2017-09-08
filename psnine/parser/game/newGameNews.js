import parser from 'cheerio-without-node-native'

import newsParser from '../community'

export default function (html) {
  // const $ = parser.load(html, {
  //   decodeEntities: true
  // })
  
  const $ = parser.load(html)
  const result = []

  $('ul.newlist li').each(function (i, elem) {
    const $this = $(this)
    const img = $this.find('img').attr('src')
    const text = $this.text()
    const arr = text.split('\n').map(item => item.replace(/\t/g, '').trim()).filter(item => item)
    const href = $this.find('a.touch').attr('href') || ''
    const matched = href.match(/\d+/)
    const type = href.includes('/gene/') ? 'gene' : 'community'
    const id = matched ? matched[0] : arr[1] + arr[2]
    // console.log(arr)
    const mock = {
      count: arr.slice().pop(),
      views: 1,
      title: arr.slice(0, -3).join('\n'),
      psnid: arr.slice(0, -2).pop(),
      date: arr.slice(0, -1).pop(),
      avatar: img,
      id,
      type,
      newsType: type,
      thumbs: Array.from($this.find('.thumb img').map(function(){ return $(this).attr('src')}))
    }
    // console.log(mock)
    result.push(mock)
  })

  return result
}
