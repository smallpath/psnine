
import {
  DiskStorage
} from 'react-native'

const AsyncStorage = new DiskStorage({
  namespace: 'stats'
})

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
declare var global
export const removeAll = () => AsyncStorage.removeAll().then(() => global.toast('清理完毕')).catch(err => global.toast('清理失败: ' + err.toString()))

export const removeItem = (psnid) => AsyncStorage.removeItem(`Statistics::TrophyList::${psnid.toLowerCase()}`).then((

) => global.toast('清理完毕')).catch(err => global.toast('清理失败: ' + err.toString()))

export const getTrophyList = async (psnid, callback, forceNew = false) => {
  const prefix = `Statistics::TrophyList::${psnid.toLowerCase()}`
  console.log('===> it really starts')
  if (forceNew === false) {
    let cacheStr = await AsyncStorage.getItem(prefix)
    if (cacheStr) {
      const cache = JSON.parse(cacheStr)
      // await AsyncStorage.removeItem(prefix)
      if (cache && cache.trophyList) {
        console.log('removing !!')
        // alert('remove cahce')
        await AsyncStorage.removeItem(prefix)
      } else {
        console.log('hehe global cache hit', Object.keys(cache))
        const { gameList, statsInfo, trophyChunks } = cache
        console.log({
          trophyChunks
        })
        let trophyList: any = []
        if (trophyChunks < 20) {
          trophyList = ([] as any).concat(...(await Promise.all(
            '0'.repeat(trophyChunks).split('').map((_, index) => {
              return AsyncStorage.getItem(`${prefix}::trophyChunk::${index}`)
            })
          )).map(str => JSON.parse(str)))
        } else {
          for (let i = 0; i < trophyChunks; i++) {
            const str: string = await AsyncStorage.getItem(`${prefix}::trophyChunk::${i}`)
            trophyList.push(...JSON.parse(str))
            callback && callback({
              title: `正在读取中 (${i + 1}/${trophyChunks})`
            })
          }
        }
        // console.log(trophyList[0], trophyList[1], trophyList[2])
        const unearnedTrophyList = trophyList.filter(item => !item.timestamp)

        // console.log(unearnedTrophyList[0])
        // console.log(trophyList.length, unearnedTrophyList.length, 'combined')
        return {
          gameList, statsInfo, trophyList, unearnedTrophyList
        }
      }
    }
  }
  const statsInfo: any = {}
  const gameList = (await getGameList(psnid, callback))//.slice(0, 2)
  const trophyList: any = []

  let index = 0
  // gameList[0].percent = '0%'
  for (const game of gameList) {
    const cacheKey = `${prefix}::${game.href}`
    // ::${game.trophyArr}::${game.percent}
    const cacheGame = await AsyncStorage.getItem(cacheKey)
    const cacheResult = await AsyncStorage.getItem(`${cacheKey}::trophy`)
    let outterResult
    console.log(!!cacheGame, !!cacheResult)
    if (cacheGame && cacheResult) {
      const parsedGame = JSON.parse(cacheGame)
      console.log('===>', parsedGame.percent, game.percent)
      if (parsedGame.trophyArr === game.trophyArr
        && parsedGame.percent === game.percent) {
        console.log('cache hit for game ' + game.title)
        outterResult = JSON.parse(cacheResult)
      } else {
        console.log('=================> cache not hit')
      }
    }
    const result = outterResult || (await getGameAPI(game.href))
    if (!outterResult) {
      console.log('cache game for ' + game.title)
      await AsyncStorage.setItem(cacheKey, JSON.stringify(game))
      await AsyncStorage.setItem(`${cacheKey}::trophy`, JSON.stringify(result))
    }
    result.trophyArr.forEach(temp => {
      temp.list.forEach(trophy => {
        trophy.gameInfo = result.gameInfo
        trophy.playerInfo = result.playerInfo
        trophy.banner = temp.banner
        trophyList.push(trophy)
      })
    })
    // console.log('=========================================================>', index + 1, i)
    callback && callback({
      gameInfo: result.gameInfo,
      trophyLength: trophyList.length,
      gameIndex: index + 1
    })
    index++
  }
  // console.log(gameList.length, trophyList.length)
  const earnedTrophyList = trophyList.filter(item => item.timestamp).sort((a: any, b: any) => b.timestamp - a.timestamp)
  const unearnedTrophyList = trophyList.filter(item => !item.timestamp)
  statsd(statsInfo, gameList, {
    earnedTrophyList,
    unearnedTrophyList
  })

  const allTrophyArr = sliceArrayByNumber(trophyList, 500)
  await AsyncStorage.setItem(prefix, JSON.stringify({
    gameList,
    statsInfo,
    trophyChunks: allTrophyArr.length
  }))
  console.log({
    trophyChunks: allTrophyArr.length,
    trophyList: trophyList.length
  })
  if (allTrophyArr.length < 20) {
    await Promise.all(
      allTrophyArr.map((item, index) => {
        // console.log('=========================================>',item.length, item[0])
        return AsyncStorage.setItem(`${prefix}::trophyChunk::${index}`, JSON.stringify(item))
      })
    )
  } else {
    for (let index = 0; index < allTrophyArr.length; index++) {
      await AsyncStorage.setItem(`${prefix}::trophyChunk::${index}`, JSON.stringify(allTrophyArr[index]))
      callback && callback({
        title: `正在存储中 (${index + 1}/${allTrophyArr.length})`
      })
    }
  }
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
  }, {
      '白金': 0,
      '金': 0,
      '银': 0,
      '铜': 0
    }))

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
  }, {
      '白金': 0,
      '金': 0,
      '银': 0,
      '铜': 0
    }))

  // 奖杯稀有率
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
    })).filter(item => item.value !== 0)

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
  }, {
      '80%': 0,
      '60%': 0,
      '40%': 0,
      '20%': 0,
      '0%': 0
    })).filter(item => item.value !== 0)

  // 游戏难度
  const tempDiff = gameList.reduce((prev, curr) => {
    const type = curr.alert
    if (prev[type]) {
      prev[type] += 1
    } else {
      prev[type] = 1
    }
    return prev
  }, {
      '地狱': 0,
      '噩梦': 0,
      '困难': 0,
      '麻烦': 0,
      '普通': 0,
      '容易': 0,
      '极易': 0
    })
  statsInfo.gameDifficulty = mapObj({
    '地狱': tempDiff.地狱,
    '噩梦': tempDiff.噩梦,
    '困难': tempDiff.困难,
    '麻烦': tempDiff.麻烦,
    '普通': tempDiff.普通,
    '容易': tempDiff.容易,
    '极易': tempDiff.极易
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
      prev[str][type]++
    } else {
      prev[str] = {
        '白金': 0,
        '金': 0,
        '银': 0,
        '铜': 0
      }
      prev[str][type]++
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
    if (prev[str]) {
      prev[str]++
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
      prev[str]++
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

  // 星期活跃度分布

  const weekLoc = earnedTrophyList.reduce((prev, curr) => {
    if (!curr.timestamp) return prev
    const date = new Date(curr.timestamp)

    const num = date.getDay()
    // const day = weekdays[num]
    const hour = date.getUTCHours()

    const key = `${num}-${hour}`
    if (prev[key]) {
      prev[key]++
    } else {
      prev[key] = 1
    }
    return prev
  }, {})
  const tempWeekLoc = Object.keys(weekLoc).map(item => {
    return {
      x: parseInt(item.split('-')[0] as string, 10),
      y: parseInt(item.split('-').pop() as string, 10),
      size: weekLoc[item],
      data: {
        y: parseInt(item.split('-').pop() as string, 10),
        size: weekLoc[item]
      }
    }
  })
  const max = tempWeekLoc.reduce((prev, curr) => {
    // console.log(curr.size)
    if (curr.size > prev) return curr.size
    return prev
  }, 0)
  const div = (max / 100) > 1 ? (max / 100) : 1
  statsInfo.weekLoc = tempWeekLoc.map(item => {
    return {
      ...item,
      size: ~~(item.size / div),
      data: {
        ...item.data,
        size: ~~(item.size / div),
      }
    }
  })
  // console.log(statsInfo.weekLoc, div, max)
  // console.log(div, max)
  statsInfo.daysMapper = weekdays

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

for (let i = historyLevel.length; i < 100; i++) {
  const finalOne = historyLevel[historyLevel.length - 1]
  historyLevel.push(finalOne + 10000)
}

function sliceArrayByNumber(arr, num) {
  const result: any = []
  for (let i = 0, len = arr.length; i < len; i += num) {
    result.push(arr.slice(i, i + num))
  }
  return result
}