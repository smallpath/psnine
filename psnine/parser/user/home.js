import parser from 'cheerio-without-node-native'

export default function (html, psnid) {
  const $ = parser.load(html)

  const avatar = $('.psnava img').attr('src')
  const arr = $('.psninfo tr td').map(function(i, elem) {
      return $(this).text()
  })

  const trophyArr = $('.psntrophy span').map(function(i, elem) {
      return $(this).text()
  })

  const backgroundImage = $('.header').next().attr('style').match(/\((.*?)\)/)
  
  const reg = new RegExp(`${psnid}`, 'gmi')
  const isSigned = !html.includes('onclick="qidao(this)')
  const playerInfo = {
    backgroundImage: backgroundImage[1].replace(/\'/g, ''),
    avatar: { uri: avatar },
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
    isSigned
  }

  const psnButtonInfo = []
  $('.psnbtn').each(function(i, elem) {
    psnButtonInfo.push({
      psnid,
      text: $(this).find('a').text()
    })
  })

  const toolbarInfo = []
  $('.nav a').each(function(i, elem) {
    toolbarInfo.push({
      url: $(this).attr('href'),
      text: $(this).text()
    })
  })

  const gameTable = []
  $('.nav').next().find('tr').each(function(i, elem) {
    const $this = $(this)
    const info = {}
    $this.find('td').each(function(j, elem) {
      const that = $(this)
      if (j === 0) {
        info.avatar = that.find('img').attr('src')
        info.href = that.find('a').attr('href')
      } else if (j === 1) {
        info.title = that.find('p a').text()
        info.platform = Array.from(that.find('span').map(function(k, elem) { return $(this).text()}))
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


  return {
    playerInfo,
    psnButtonInfo,
    toolbarInfo,
    gameTable
  }
}