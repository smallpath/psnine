import parser from 'cheerio-without-node-native'

const backgroundColorMapper = {
  t1: '#d5d9e4',
  t2: '#f6e5c8',
  t3: '#dcdcdc',
  t4: '#e4cdc1',
}

const typeMapper = {
  t1: '白金',
  t2: '金',
  t3: '银',
  t4: '铜'
}

const pointMapper = {
  t1: 180,
  t2: 90,
  t3: 30,
  t4: 15
}

export default function (html, hasPsnid = false) {
  const $ = parser.load(html)
  const all = $('.mt40 .main')
  const childrens = all.children()
  // console.log(childrens.length)

  const trophyArrLength = childrens.filter('.hd').length

  const first = all.find('ul.dropmenu').parent()
  let index = 0

  let node = first
  let prevObj = {}
  const toolbarId = hasPsnid ? 2 : 1
  const playerId = hasPsnid ? 1 : 2
  while (node.prev().attr('class')) {
    index++
    node = node.prev()
    if (index === toolbarId) {
      prevObj['toolbar'] = node
    } else if (index === playerId) {
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
    const temp = $('.side .hd3').first()
    gameInfo.linkGame = temp.text() === '关联游戏' ? (temp.next().find('a').attr('href') || ''): ''
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
        const className = $this.find('p a').next().attr('class')
        if (!className) {

        }
        const hasTranslate = !className
        const hasTip = className && className.length !== 0
        const tryTip = $this.find('p a').next().next().text()
        const indexID = ($this.find('.h-p').parent().find('.r').text() || '').replace('#', '')
        const t = $this.find('td').attr('class') || 't1'
        const info = {
          id: (($this.find('p a').attr('href') || '-1').match(/trophy\/(\d+)/) || [0, -1])[1],
          avatar: $this.find('img').attr('src'),
          title: $this.find('p a').text(),
          href: $this.find('p a').attr('href'),
          text: $this.find('td p').next().text(),
          translate: hasTranslate ? $this.find('p a').next().text() : '',
          tip: tryTip ? tryTip : hasTip ? $this.find('p a').next().text() : '',
          rare: $this.find('td').last().text().replace('珍贵度', ''),
          translateText: $this.find('td p').next().next().text(),
          indexID,
          backgroundColor: backgroundColorMapper[t] || backgroundColorMapper['t4'],
          type: typeMapper[t] || typeMapper['t4'],
          point: pointMapper[t] || pointMapper['t4']
        }
        const time = $this.find('td em.lh180')
        if (time.attr('tips')) {
          const result = formatTime($this.find('td em.lh180').attr('tips') + ($this.find('td em.lh180').text().match(/(\d+\-\d+\:\d+)/igm) || [''])[0])
          info.time = result[0]
          info.timestamp = result[1]
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
    toolbarInfo: toolbarInfo.filter(item => item.text !== '奖杯'),
    trophyArr
  }
}

function formatTime(text) {
  if (!text) return ['', 0]
  const arr = text.split('').filter(item => item !== '-' && item !== ':')
  const ts = arr.slice()
  arr.splice(7, 0, '月')
  arr.splice(10, 0, '日')
  arr.splice(13, 0, '点')
  ts.splice(4, 1, '-')
  ts.splice(7, 0, '-')
  ts.splice(10, 0, 'T')
  ts.splice(13, 0, ':')
  ts.push(':00.000Z')
  const timestamp = ts.join('')
  return [arr.join(''), new Date(timestamp).valueOf()]
}