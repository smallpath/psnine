import parser from 'cheerio-without-node-native'

export default function (html, psnid) {
  const $ = parser.load(html)

  const avatar = $('.psnava img').attr('src')
  const arr = $('.psninfo tr td').map(function (i, elem) {
    return $(this).text()
  })

  const trophyArr = $('.psntrophy span').map(function (i, elem) {
    return $(this).text()
  })

  const backgroundImage = $('.header').next().attr('style').match(/\((.*?)\)/)

  const reg = new RegExp(`${psnid}`, 'gmi')
  const isSigned = !html.includes('onclick="qidao(this)')
  const playerInfo = {
    backgroundImage: backgroundImage[1].replace(/\'/g, ''),
    avatar: avatar,
    psnid: arr[0].match(reg) ? arr[0].match(reg)[0] : psnid,
    description: arr[0].replace(reg, ''),
    exp: arr[1],
    ranking: arr[2].replace(/\D+/, ''),
    allGames: arr[3].replace(/\D+/, ''),
    perfectGames: arr[4].replace(/\D+/, ''),
    hole: arr[5].replace(/\D+/, ''),
    ratio: arr[6],
    followed: arr[7].replace(/\D+/, ''),
    platinum: trophyArr[0],
    gold: trophyArr[1],
    silver: trophyArr[2],
    bronze: trophyArr[3],
    all: trophyArr[4],
    isSigned,
    point: $('.psninfo tr td').find('.text-level').attr('tips'),
    icons: Array.from($('.psnava img').filter(i => i > 0).map(function() {
      return  $(this).attr('src')
    }))
  }

  if (playerInfo.psnid && typeof playerInfo.psnid === 'string') playerInfo.psnid = playerInfo.psnid.toLowerCase() 

  // const psnButtonInfo = []
  // $('.psnbtn a').each(function (i, elem) {
  //   psnButtonInfo.push({
  //     psnid,
  //     text: $(this).text()
  //   })
  // })
  // if (psnButtonInfo.length === 2) {
  //   psnButtonInfo.push({
  //     psnid,
  //     text: '同步'
  //   })
  // }
  const base = `http://psnine.com/psnid/${psnid}`
  const psnButtonInfo = [{
    text: '屏蔽',
    psnid
  }, {
    text: '关注',
    psnid
  }, {
    text: '感谢',
    psnid
  }, {
    text: '等级同步',
    psnid
  }, {
    text: '游戏同步',
    psnid
  }]
  $('.psnbtn a').each(function (i, elem) {
    const text = $(this).text() || ''
    if (text.includes('冷却')) {
      psnButtonInfo[4].text = text
    }
  })

  const toolbarInfo = []
  $('.inav a').each(function (i, elem) {
    toolbarInfo.push({
      url: $(this).attr('href'),
      text: $(this).text()
    })
  })

  const gameTable = []
  $('.inav').next().find('tr').each(function (i, elem) {
    const $this = $(this)
    const info = {}
    $this.find('td').each(function (j, elem) {
      const that = $(this)
      if (j === 0) {
        info.avatar = that.find('img').attr('src')
        info.href = that.find('a').attr('href')
      } else if (j === 1) {
        info.title = that.find('p a').text()
        info.platform = Array.from(that.find('span').map(function (k, elem) { return $(this).text() }))
        info.syncTime = that.find('small').text()
      } else if (j === 2) {
        info.allTime = (that.text() || '').replace('总耗时', '')
      } else if (j === 3) {
        info.alert = that.find('span').text()
        info.allPercent = that.find('em').text()
      } else if (j === 4) {
        info.percent = that.find('.mb10 div').text()
        info.trophyArr = (that.find('small').text() || '').replace(/\n/igm, '')
      }
    })
    gameTable.push(info)
  })

  const diaryTable = []
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
    mock.href = 'http://psnine.com/diary/' + mock.id
    diaryTable.push(mock)
  })

  return {
    playerInfo,
    psnButtonInfo,
    toolbarInfo,
    gameTable,
    diaryTable
  }
}