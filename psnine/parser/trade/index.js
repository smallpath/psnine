import parser from 'cheerio-without-node-native'

export default function (html) {
  const $ = parser.load(html, {
    decodeEntities: false
  })

  const list = []

  $('ul.list li').each(function (i, elem) {
    const $this = $(this)
    const img = $this.find('img').attr('src')
    const thumbs = Array.from($this.find('img').map(function (i, elem) {
      return $(this).attr('src')
    }).filter(index => !!index))

    const text = $this.text()
    const arr = text.split('\n').map(item => item.replace(/\t/g, '').trim()).filter(item => item)

    const nextArr = arr.slice(-3)
    const content = arr.slice(1, -3).join('\n')
    const mock = {
      title: content.split('\n').slice(0, 5).join(' '),
      content: content.split('\n').slice(5).join('\n'),
      psnid: nextArr[0],
      date: nextArr[1].replace(/&nbsp;/igm, ''),
      avatar: img,
      href: $this.find('a.touch').attr('href'),
      id: ($this.find('a.touch').attr('href').match(/trade\/(\d+)/) || [0, -1])[1],
      thumbs,
      price: $this.find('.r').text(),
      count: nextArr[2]
    }
    list.push(mock)
  })
  // return result

  const page = []

  $('.page a').each(function (i, elem) {
    const $this = $(this)
    const url = 'https://psnine.com' + $this.attr('href')
    const text = $this.text() || '1'
    page.push({
      url,
      text,
      type: $this.attr('href').includes('javascript:') ? 'disable' : 'enable'
    })
  })

  return {
    list,
    page,
    numberPerPage: 30,
    numPages: page.length >= 2 ? parseInt(page[page.length - 2].text) : 1,
    len: parseInt($('.page li').find('.disabled a').last().html())
  }
}