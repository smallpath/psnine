
import {
  AsyncStorage
} from 'react-native'

import {
  getMyGameAPI,
  getGameAPI
} from '../dao'

const getGameURL = (psnid, page) => `http://psnine.com/psnid/${psnid}/psngame?page=${page}`

const getGameList = async (psnid, callback) => {
  const list: any = []
  let page = 1
  callback && callback({
    title: `正在获取第${page}页游戏`
  })
  let result = await getMyGameAPI(getGameURL(psnid, page))
  while (result.list.length !== 0) {
    list.push(...result.list)
    page++
    callback && callback({
      title: `正在获取第${page}页游戏`
    })
    result = await getMyGameAPI(getGameURL(psnid, page))
  }
  return list
}

export const getTrophyList = async (psnid, callback, forceNew = false) => {
  if (forceNew === false) {
    let cacheStr = await AsyncStorage.getItem(`Statistics::TrophyList::${psnid.toLowerCase()}`)
    if (cacheStr) {
      const cache = JSON.parse(cacheStr)
      // console.log('hehe', Object.keys(cache))
      return cache
    }
  }
  const statsInfo: any = {}
  const gameList = (await getGameList(psnid, callback))//.slice(0, 2)
  const trophyList: any = []

  let index = 0
  for (const game of gameList) {
    const result = await getGameAPI(game.href)
    result.trophyArr.forEach(temp => {
      temp.list.forEach(trophy => {
        trophy.gameInfo = result.gameInfo
        trophy.playerInfo = result.playerInfo
        trophy.banner = temp.banner
        trophyList.push(trophy)
      })
    })

    callback && callback({
      gameInfo: result.gameInfo,
      trophyLength: trophyList.length,
      gameIndex: index + 1
    })
    index++
  }

  const earnedTrophyList = trophyList.filter(item => item.timestamp).sort((a: any, b: any) => b.time - a.time)
  const unearnedTrophyList = trophyList.filter(item => !item.timestamp)
  statsd(statsInfo, gameList, {
    earnedTrophyList,
    unearnedTrophyList
  })

  await AsyncStorage.setItem(`Statistics::TrophyList::${psnid.toLowerCase()}`, JSON.stringify({
    gameList,
    trophyList,
    unearnedTrophyList,
    statsInfo
  }))
  return { gameList, trophyList: earnedTrophyList, statsInfo, unearnedTrophyList }
}

function mapObj(obj) {
  return Object.keys(obj).map(name => {
    return {
      label: name,
      value: obj[name]
    }
  })
}

function statsd(statsInfo, gameList, {
  unearnedTrophyList,
  earnedTrophyList
}) {
  // 平台
  statsInfo.platform = mapObj(gameList.reduce((prev, curr) => {
    const { platform } = curr
    if (platform.length > 1) {
      // fuck ts
      if (prev.多平台) {
        prev.多平台++
      } else {
        prev.多平台 = 1
      }
      return prev
    }

    const target = platform[0]
    if (prev[target]) {
      prev[target]++
    } else {
      prev[target] = 1
    }
    return prev
  }, {}))

  // 奖杯种类
  statsInfo.trophyNumber = mapObj(earnedTrophyList.reduce((prev, curr) => {
    const { type } = curr

    if (prev[type]) {
      prev[type]++
    } else {
      prev[type] = 1
    }
    return prev
  }, {}))

  // 点数
  statsInfo.trophyPoints = mapObj(earnedTrophyList.reduce((prev, curr) => {
    const { point, type } = curr
    if (!type) {
      return prev
    }
    if (prev[type]) {
      prev[type] += point
    } else {
      prev[type] = point
    }
    return prev
  }, {}))

  // 奖杯稀有度
  statsInfo.trophyRarePercent = (earnedTrophyList.reduce((prev, curr) => {
    return prev + parseFloat(curr.rare)
  }, 0) / earnedTrophyList.length).toFixed(2) + '%'
  statsInfo.trophyRare = mapObj(earnedTrophyList.reduce((prev, curr) => {
    const { rare } = curr
    const num = parseFloat(rare)

    let type = '简单'
    switch (true) {
      case num === 0.1:
        type = '地狱'
        break
      case num <= 1:
        type = '噩梦'
        break
      case num <= 5:
        type = '困难'
        break
      case num <= 25:
        type = '普通'
        break
      case num <= 50:
        type = '一般'
        break
    }

    prev[type] += 1
    return prev
  }, {
    '地狱': 0,
    '噩梦': 0,
    '困难': 0,
    '普通': 0,
    '一般': 0,
    '简单': 0
  }))

  // 游戏完成率
  statsInfo.gameRarePercent = (earnedTrophyList.length / unearnedTrophyList.length).toFixed(2) + '%'
  statsInfo.gamePercent = mapObj(gameList.reduce((prev, curr) => {

    const num = new Function(`return ${curr.percent.replace('%', '/100')}`)()

    let type = '80%'
    switch (true) {
      case num <= 0.2:
        type = '0%'
        break
      case num <= 0.4:
        type = '20%'
        break
      case num <= 0.6:
        type = '40%'
        break
      case num <= 0.8:
        type = '60%'
        break
    }
    if (prev[type]) {
      prev[type] += 1
    } else {
      prev[type] = 1
    }
    return prev
  }, {}))

  // 游戏难度
  const tempDiff = gameList.reduce((prev, curr) => {
    const type = curr.alert
    if (prev[type]) {
      prev[type] += 1
    } else {
      prev[type] = 1
    }
    return prev
  }, {})
  statsInfo.gameDifficulty = mapObj({
    '地狱': tempDiff.地狱,
    '噩梦': tempDiff.噩梦,
    '困难': tempDiff.困难,
    '麻烦': tempDiff.麻烦,
    '普通': tempDiff.普通,
    '容易': tempDiff.容易
  })

  // 月活
  statsInfo.monthTrophy = mapObjToLine(earnedTrophyList.reduce((prev, curr) => {
    if (!curr.timestamp) return prev
    const date = new Date(curr.timestamp)
    const month = (date.getUTCMonth() + 1)
    const str = date.getUTCFullYear() + '-' + (month < 10 ? '0' + month : month)
    if (prev[str]) {
      prev[str] += 1
    } else {
      prev[str] = 1
    }
    return prev
  }, {})).sort((a: any, b: any) => a.time - b.time)

  // 日活
  const tempAllMinute = {}
  const tempDayTrophy = mapObjToMultiLine(earnedTrophyList.reverse().reduce((prev, curr) => {
    if (!curr.timestamp) return prev
    const date = new Date(curr.timestamp)
    const month = (date.getUTCMonth() + 1)
    const day = date.getUTCDate()
    const str = date.getUTCFullYear() + '-' + (month < 10 ? '0' + month : month) + '-'
      + (day < 10 ? '0' + day : day)
    const hour = date.getHours()
    const minute = date.getMinutes()
    const tempAllMinuteStr = str + `:${hour}-${minute}`
    if (tempAllMinute[tempAllMinuteStr]) {
      tempAllMinute[tempAllMinuteStr]++
    } else {
      tempAllMinute[tempAllMinuteStr] = 1
    }
    const type = curr.type
    if (prev[str]) {
      prev[str][type] ++
    } else {
      prev[str] = {
        '白金': 0,
        '金': 0,
        '银': 0,
        '铜': 0
      }
      prev[str][type] ++
    }
    return prev
  }, {}))

  const dayTrophyObj: any = {
    '白金': [],
    '金': [],
    '银': [],
    '铜': []
  }
  statsInfo.minuteArr = Object.keys(tempAllMinute)
  statsInfo.dayArr = []
  tempDayTrophy.forEach(item => {
    statsInfo.dayArr.push(item.label)
    dayTrophyObj.白金.push(item.value.白金)
    dayTrophyObj.金.push(item.value.金)
    dayTrophyObj.银.push(item.value.银)
    dayTrophyObj.铜.push(item.value.铜)
  })

  statsInfo.dayTrophy = mapObjToLine(dayTrophyObj)

  const tempHour = earnedTrophyList.reduce((prev, curr) => {
    const date = new Date(curr.timestamp)
    const str = date.getUTCHours()
    // if (str === 6) console.log(curr.timestamp)
    if (!str) return prev
    if (prev[str]) {
      prev[str] ++
    } else {
      prev[str] = 1
    }
    return prev
  }, {})
  const hours = '0'.repeat(24).split('').map((_, i) => i.toString())
  Object.keys(tempHour).forEach(item => {
    const index = hours.indexOf(item)
    if (index !== -1) hours.splice(index, 1)
  })
  hours.forEach(str => {
    tempHour[str] = 0
  })
  statsInfo.hourTrophy = mapObj(tempHour).sort((a: any, b: any) => {
    return parseInt(a.label, 10) - parseInt(b.label, 10)
  })

  let points = 0
  statsInfo.levelTrophy = []
  const tempWeek = earnedTrophyList.reverse().sort((a, b) => a.timestamp - b.timestamp).reduce((prev, curr) => {
    if (!curr.timestamp) return prev
    const date = new Date(curr.timestamp)

    const num = date.getDay()
    const str = weekdays[num]
    const { point } = curr
    let nextPoints = points + point
    const targetPoints = historyLevel[statsInfo.levelTrophy.length]
    const isBigger = targetPoints ? nextPoints >= targetPoints : nextPoints > 0
    // console.log(nextPoints, points, targetPoints, isBigger, points <= targetPoints, isBigger && points <= targetPoints)
    if (isBigger && points <= targetPoints) {
      // console.log('hit level')
      statsInfo.levelTrophy.push(Object.assign({}, curr, {
        level: statsInfo.levelTrophy.length + 1
      }))
    }
    points = nextPoints
    if (prev[str]) {
      prev[str] ++
    } else {
      prev[str] = 1
    }
    return prev
  }, {})
  statsInfo.levelTrophy = statsInfo.levelTrophy.reverse()
  const weekdaysTemp = weekdays.slice()
  Object.keys(tempWeek).forEach(item => {
    const index = weekdaysTemp.indexOf(item)
    // console.log(item, index, '===>')
    if (index !== -1) weekdaysTemp.splice(index, 1)
  })
  // console.log(weekdaysTemp, '===> deleted')
  weekdaysTemp.forEach(str => {
    tempWeek[str] = 0
  })
  // console.log(tempWeek)
  statsInfo.weekTrophy = mapObj(tempWeek).sort((a: any, b: any) => {
    return weekdays.indexOf(a.label) - weekdays.indexOf(b.label)
  })

  // 等级历史

}

const weekdays: any = []
weekdays[0] = '周天'
weekdays[1] = '周一'
weekdays[2] = '周二'
weekdays[3] = '周三'
weekdays[4] = '周四'
weekdays[5] = '周五'
weekdays[6] = '周六'


function mapObjToLine(obj) {
  return Object.keys(obj).map(name => {
    const arr = name.split('-')

    return {
      label: name,
      y: obj[name],
      time: new Date(parseInt(arr[0], 10), parseInt(arr[1], 10)).valueOf()
    }
  })
}

function mapObjToMultiLine(obj) {
  return Object.keys(obj).map(name => {
    const arr = name.split('-')

    return {
      label: name,
      value: obj[name],
      time: new Date(
        parseInt(arr[0], 10),
        parseInt(arr[1], 10),
        parseInt(arr[2], 10)
      ).valueOf()
    }
  })
}

const historyLevel: any = [
  0,
  200,
  600,
  1200,
  2400,
  4000,
  6000,
  8000,
  10000,
  12000,
  14000,
  16000,
  24000,
  32000,
  40000,
  48000,
  56000,
  64000,
  72000,
  80000,
  88000,
  96000,
  104000,
  112000,
  120000,
  128000
]

for (let i = historyLevel.length; i < 100 ; i++) {
  const finalOne = historyLevel[historyLevel.length - 1]
  historyLevel.push(finalOne + 10000)
}
