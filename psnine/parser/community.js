import parser from 'cheerio-without-node-native'

export default function (html, forceNews = false) {
  const $ = parser.load(html)
  const result = []

  forceNews === false && $('ul.list li').each(function (i, elem) {
    const $this = $(this)
    const img = $this.find('img').attr('src')
    const text = $this.text()
    const arr = text.split('\n').map(item => item.replace(/\t/g, '').trim()).filter(item => item)
    if (isNaN(parseInt(arr))) arr.unshift(0)
    const matched = $this.find('.title a').attr('href').match(/\d+/)
    const id = matched ? matched[0] : arr[1] + arr[2]
    const mock = {
      count: parseInt(arr[0]),
      views: 1,
      title: arr[1],
      psnid: arr[2],
      date: arr[3],
      avatar: img,
      id,
      type: arr[4],
      thumbs: []
    }
    result.push(mock)
  })

  let target = $('ul.newlist')
  if (forceNews) {
    target = $('ul.list')
  }
  if (result.length === 0 && target.length !== 0) {
    
    target.find('li').each(function (i, elem) {
      const $this = $(this)
      const img = $this.find('img').attr('src')
      const text = $this.text()
      const arr = text.split('\n').map(item => item.replace(/\t/g, '').trim()).filter(item => item)
      const href = $this.find('a.touch ').attr('href') || ''
      const matched = href.match(/\d+/)
      const type = href.includes('/gene/') ? 'gene' : 'community'
      const id = matched ? matched[0] : arr[1] + arr[2]

      const mock = {
        count: arr.slice().pop(),
        views: 1,
        title: arr.slice(0, -3).join('\n'),
        psnid: arr.slice(0, -2).pop(),
        date: arr.slice(0, -1).pop(),
        avatar: img,
        id,
        newsType: type,
        thumbs: Array.from($this.find('.thumb img').map(function(){ return $(this).attr('src')}))
      }
      // console.log(mock)
      result.push(mock)
    })
  }

  return result
}