
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
    let cacheStr = await AsyncStorage.getItem('Statistics::TrophyList')
    if (cacheStr) {
      const cache = JSON.parse(cacheStr)
      // console.log('hehe', Object.keys(cache))
      return cache
    }
  }
  const statsInfo: any = {}
  const gameList = (await getGameList(psnid, callback)).slice(0, 2)
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

  statsd(statsInfo, gameList, trophyList)

  await AsyncStorage.setItem('Statistics::TrophyList', JSON.stringify({
    gameList,
    trophyList,
    statsInfo
  }))
  return { gameList, trophyList, statsInfo }
}

function mapObj(obj) {
  return Object.keys(obj).map(name => {
    return {
      label: name,
      value: obj[name]
    }
  })
}

function statsd(statsInfo, gameList, trophyList) {
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
  statsInfo.trophyNumber = mapObj(trophyList.reduce((prev, curr) => {
    const { type } = curr

    if (prev[type]) {
      prev[type]++
    } else {
      prev[type] = 1
    }
    return prev
  }, {}))

  // 点数
  statsInfo.trophyPoints = mapObj(trophyList.reduce((prev, curr) => {
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
  statsInfo.trophyRarePercent = trophyList.reduce((prev, curr) => {
    return prev + parseFloat(curr.rare)
  }, 0) / trophyList.length
  statsInfo.trophyRare = mapObj(trophyList.reduce((prev, curr) => {
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

    if (prev[type]) {
      prev[type] += 1
    } else {
      prev[type] = 1
    }
    return prev
  }, {}))

  // 游戏完成率
  statsInfo.gameRarePercent = trophyList.filter(item => item.time).length / trophyList.length
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
  statsInfo.gameDifficulty = mapObj(gameList.reduce((prev, curr) => {
    const type = curr.alert
    if (prev[type]) {
      prev[type] += 1
    } else {
      prev[type] = 1
    }
    return prev
  }, {}))

  statsInfo.monthTrophy = mapObjToLine(trophyList.reduce((prev, curr) => {
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

  const tempDayTrophy = mapObjToMultiLine(trophyList.reduce((prev, curr) => {
    const date = new Date(curr.timestamp)
    const month = (date.getUTCMonth() + 1)
    const day = date.getUTCDate()
    const str = date.getUTCFullYear() + '-' + (month < 10 ? '0' + month : month) + '-'
      + (day < 10 ? '0' + day : day)
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
  }, {})).sort((a: any, b: any) => a.time - b.time)

  const dayTrophyObj: any = {
    '白金': [],
    '金': [],
    '银': [],
    '铜': []
  }
  statsInfo.dayArr = []
  tempDayTrophy.forEach(item => {
    statsInfo.dayArr.push(item.label)
    dayTrophyObj.白金.push(item.value.白金)
    dayTrophyObj.金.push(item.value.金)
    dayTrophyObj.银.push(item.value.银)
    dayTrophyObj.铜.push(item.value.铜)
  })

  statsInfo.dayTrophy = mapObjToLine(dayTrophyObj)

  const tempHour = trophyList.reduce((prev, curr) => {
    const date = new Date(curr.timestamp)
    const str = date.getHours().toString()
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

  const tempWeek = trophyList.reduce((prev, curr) => {
    const date = new Date(curr.timestamp)
    const num = date.getDay()
    const str = weekdays[num]
    if (prev[str]) {
      prev[str] ++
    } else {
      prev[str] = 1
    }
    return prev
  }, {})
  const weekdaysTemp = weekdays.slice()
  Object.keys(tempWeek).forEach(item => {
    const index = weekdays.indexOf(item)
    if (index !== -1) weekdaysTemp.splice(index, 1)
  })
  weekdaysTemp.forEach(str => {
    tempWeek[str] = 0
  })
  statsInfo.weekTrophy = mapObj(tempWeek).sort((a: any, b: any) => {
    return weekdays.indexOf(a.label) - weekdays.indexOf(b.label)
  })
}

const weekdays: any = []
weekdays[0] = '周一'
weekdays[1] = '周二'
weekdays[2] = '周三'
weekdays[3] = '周四'
weekdays[4] = '周五'
weekdays[5] = '周六'
weekdays[6] = '周天'

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
