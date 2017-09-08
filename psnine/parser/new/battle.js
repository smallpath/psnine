import parser from 'cheerio-without-node-native'

export default function (html) {
  const $ = parser.load(html)

  const num = []

  $('select[name=num] option').each(function (i, elem) {
    const $this = $(this)
    const value = $this.val()
    if (!value) return
    num.push({
      text: $this.text(),
      value
    })
  })

  const game = []
  $('select[id=mypsngame] option').each(function (i, elem) {
    const $this = $(this)
    const value = $this.val()
    if (!value) return
    game.push({
      text: $this.text(),
      value
    })
  })
  const startdate = []
  $('select[name=startdate] option').each(function (i, elem) {
    const $this = $(this)
    const value = $this.val()
    if (!value) return
    startdate.push({
      text: $this.text(),
      value
    })
  })
  // console.log(startday, starttime)
  return {
    num,
    game,
    startdate
  }
}
