import parser from 'cheerio-without-node-native'

export default function (html) {
  const $ = parser.load(html)
  const all = $('.mt40 .main')
  const childrens = all.children()
  // console.log(childrens.length)

  const trophyArrLength = childrens.filter('.hd').length

  const first = all.find('ul.dropmenu').parent()
  let index = 0

  let node = first
  let prevObj = {}
  while (node.prev().attr('class')) {
    index++
    node = node.prev()
    if (index === 1) {
      prevObj['toolbar'] = node
    } else if (index === 2) {
      if (node.prev().attr('class')) {
        prevObj['player'] = node
      } else {
        prevObj['game'] = node
      }
    } else if (index === 3 && !node.prev().attr('class')) {
      prevObj['game'] = node
    }
  }

  const trophyArrTemp = []

  let next = first
  while (next.attr('class')) {
    if ((next.attr('class') || '').includes('box')) (
      trophyArrTemp.push(next)
    )
    next = next.next()
  }

  const { game, player, toolbar } = prevObj

  const gameInfo = {}
  const playerInfo = {}
  const toolbarInfo = []

  if (game) {
    gameInfo.platform = Array.from(game.find('h1 span').map(function (i, elem) { return $(this).text() }))
    gameInfo.title = (game.find('h1').text().match(new RegExp('《(.*?)》')) || ['', '解析错误'])[1]
    gameInfo.version = game.find('h1 em').text().split('\n').map(item => item.trim()).filter(item => item)
    gameInfo.trophyArr = Array.from(game.find('em span').map(function (i, elem) { return $(this).text() }))
    gameInfo.avatar = game.find('img').attr('src')
    const alert = game.find('em span').parent().next()
    if (alert.text()) {
      gameInfo.alert = alert.text()
      if (alert.next().text()) {
        gameInfo.rare = alert.next().text()
      }
    }
  }

  if (player) {
    // console.log('player', player.text().length)
    player.find('td').each(function (i, elem) {
      const $this = $(this)
      switch (i) {
        case 0:
          playerInfo.psnid = $this.find('a').text()
          playerInfo.url = $this.find('a').attr('href')
          playerInfo.total = $this.find('span').text()
          break;
        case 1:
          playerInfo.first = $this.text().replace('首个杯', '')
          break;
        case 2:
          playerInfo.last = $this.text().replace('最后杯', '')
          break;
        case 3:
          playerInfo.time = $this.text().replace('总耗时', '')
          break;

      }
    })
  }

  if (toolbar) {
    toolbar.find('li').each(function (i, elem) {
      const $this = $(this)
      const img = 'http://psnine.com' + $this.find('img').attr('src')
      const text = $this.find('a').text()
      const url = $this.find('a').attr('href')
      toolbarInfo.push({ img, text, url })
    })
  }

  const trophyArr = []
  trophyArrTemp.forEach((item, index) => {
    const temp = {
      banner: {},
      list: []
    }
    item.find('tr').each(function (i, elem) {
      $this = $(this)
      // console.log($this.)
      if (i === 0) {
        // 此组的奖杯信息
        const banner = {
          avatar: $this.find('img').attr('src'),
          title: $this.find('div p').text(),
          trophyArr: $this.find('div em').text().split('\n').map(item => item.trim()).filter(item => item)
        }
        temp.banner = banner
      } else {
        // 奖杯
        const info = {
          avatar: $this.find('img').attr('src'),
          title: $this.find('p a').text(),
          href: $this.find('p a').attr('href'),
          text: $this.find('td p').next().text(),
          translate: $this.find('p a').next().text(),
          tip: $this.find('p a').next().next().text(),
          rare: $this.find('td').last().text().replace('珍贵度', ''),
          translateText: $this.find('td p').next().next().text()
        }
        const time = $this.find('td em.lh180')
        if (time.attr('tips')) {
          info.time = formatTime($this.find('td em.lh180').attr('tips') + ($this.find('td em.lh180').text().match(/(\d+\-\d+\:\d+)/igm) || [''])[0])
        }
        temp.list.push(info)
      }
    })
    trophyArr.push(temp)
  })
  // console.log(temp)

  return {
    gameInfo,
    playerInfo,
    toolbarInfo,
    trophyArr
  }
}

function formatTime(text) {
  if (!text) return ''
  const arr = text.split('').filter(item => item !== '-' && item !== ':')
  arr.splice(7, 0, '月')
  arr.splice(10, 0, '日')
  arr.splice(13, 0, '分')
  return arr.join('')
}