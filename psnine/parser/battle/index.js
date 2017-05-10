import parser from 'cheerio-without-node-native'

export default function (html) {
  const $ = parser.load(html)
  const result = {}
  let index = 0
  $('.list').each(function (i, elem) {
    const $this = $(this)
    const text = $this.parent().prev().text()
    const weekDay = text.slice(0, 3)
    const day = text.slice(3)
    const target = result[`${weekDay} ${day}`] = []
    $this.find('tr').each(function (i, elem) {
      const $this = $(this)
      const thumbs = Array.from($this.find('img').map(function (i, elem) {
        return $(this).attr('src')
      }))

      const text = $this.text()
      const platform = Array.from($this.find('.pd10 p span').map(function (i, elem) {
        return $(this).text()
      }))
      let arr = text.split('\n').map(item => item.replace(/\t/g, '')).filter(item => item)
      let shouldConcat = false
      let isConcat = false
      arr = arr.reduce((prev, curr) => {
        if (shouldConcat === true) {
          prev[prev.length - 1] += curr
          isConcat = true
          shouldConcat = false
        }
        if (curr.charCodeAt(curr.length - 1) === 13) {
          shouldConcat = true
        }
        if (isConcat === false) {
          prev.push(curr)
        } else {
          isConcat = false
        }
        return prev
      }, [])
      const matched = $this.find('.pd15 p a').attr('href').match(/\d+/)
      const id = matched ? matched[0] : arr[1] + arr[2]
      const psnid = $this.find('.h-p a').attr('href').split('/').slice(-1).join('')
      const numArr = arr[4] ? arr[4].match(/\d+/) : ['2']
      const mock = {
        count: arr[1].match(/\d+/)[0],
        title: arr[2],
        psnid,
        date: arr[3].replace('开始', ''),
        game: arr[0].replace(platform.join(''), ''),
        gameAvatar: thumbs[1],
        avatar: thumbs[0],
        num: numArr ? numArr[0] : arr[4],
        platform,
        id
      }
      target.push(mock)
    })
  })
  return result
}