
import {
  AsyncStorage
} from 'react-native'

import {
  getMyGameAPI,
  getGameAPI
} from '../dao'

const getGameURL = (psnid, page) => `http://psnine.com/psnid/${psnid}/psngame?page=${page}`

const getGameList = async (psnid) => {
  const list: any = []
  let page = 1
  let result = await getMyGameAPI(getGameURL(psnid, page))
  while (result.list.length !== 0) {
    list.push(...result.list)
    page++
    result = await getMyGameAPI(getGameURL(psnid, page))
  }
  return list
}

export const getTrophyList = async (psnid, callback, forceNew = false) => {
  if (forceNew === false) {
    let cacheStr = await AsyncStorage.getItem('Statistics::TrophyList')
    if (cacheStr) {
      console.log('hehe')
      const cache = JSON.parse(cacheStr)
      return cache
    }
  }
  const gameList = await getGameList(psnid)
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
  await AsyncStorage.setItem('Statistics::TrophyList', JSON.stringify({
    gameList,
    trophyList
  }))
  return trophyList
}
