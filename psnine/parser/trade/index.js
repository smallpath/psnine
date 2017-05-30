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
    const mock = {
      title: $this.find('div.title').text().replace(/(.*?)元/, '').trim(),
      content: arr.slice(1, -3).join('\n'),
      psnid: nextArr[0],
      date: nextArr[1].replace(/&nbsp;/igm, ''),
      avatar: img,
      href: $this.attr('onclick').match(/\'(.*?)\'/)[1],
      id: ($this.attr('onclick').match(/trade\/(\d+)/) || [0, -1])[1],
      thumbs,
      price: $this.find('.title .r').text(),
      count: nextArr[2]
    }
    list.push(mock)
  })
  // return result

  const page = []

  $('.page a').each(function (i, elem) {
    const $this = $(this)
    const url = 'http://psnine.com' + $this.attr('href')
    const text = $this.text()
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
    numPages: parseInt(page[page.length - 2].text),
    len: parseInt($('.page li').find('.disabled a').last().html())
  }
}