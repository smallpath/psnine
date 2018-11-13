import parser from 'cheerio-without-node-native'

export default function (html, psnid) {
  const $ = parser.load(html)

  const diary = []
  $('.inav').parent().find('div.touchclick').each(function (i, elem) {
    const $this = $(this)
    const img = $this.find('img').attr('src')
    const thumbs = []
    $this.find('.thumb img').each(function (i, elem){
      thumbs.push($(this).attr('src'))
    }) 
    const arr = $this.find('a.psnnode').parent().text().split('\n').map(item => item.trim()).filter(item => item)
    const mock = {
      count: arr[2],
      date: arr[1],
      content: $this.find('div.content').html(),
      psnid: arr[0],
      thumbs: thumbs,
      id: $this.attr('onclick').match(/\/diary\/(\d+)\'/)[1]
    }
    if (!mock.content) {
      mock.content = $this.find('.title').html()
    }
    mock.href = 'https://psnine.com/diary/' + mock.id
    diary.push(mock)
  })

  return {
    diary
  }
}