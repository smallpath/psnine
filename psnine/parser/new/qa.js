import parser from 'cheerio-without-node-native'

export default function (html) {
  const $ = parser.load(html)

  const hb = []

  $('select[name=hb] option').each(function (i, elem) {
    const $this = $(this)
    const value = $this.val()
    if (!value) return
    hb.push({
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
  const node = []
  $('select[name=node] option').each(function (i, elem) {
    const $this = $(this)
    const value = $this.val()
    if (!value) return
    node.push({
      text: $this.text(),
      value
    })
  })
  // console.log({
  //   hb,
  //   game
  // })
  return {
    hb,
    game,
    node
  }
}
