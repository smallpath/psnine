'use strict'
import topicParser from '../parser/community'
import geneParser from '../parser/gene'
import battleParser from '../parser/battle'
import userParser from '../parser/user'
import messageParser from '../parser/user/message'
import qaParser from '../parser/qa'
import gamesParser from '../parser/game'
import ranksParser from '../parser/rank'
import topicApiParser from '../parser/topic/topic'
import battleTopicParser from '../parser/battle/battle'
import topicContentApiParser from '../parser/topic/topicContent'
import topicCommentApiParser from '../parser/topic/topicComment'
import topicCommentSnapshotApiParser from '../parser/topic/topicCommentSnapshot'
import gameParser from '../parser/game/game'
import homeParser from '../parser/user/home'
import trophyParser from '../parser/game/trophy'
import myGameParser from '../parser/user/myGame'
import gameTopicParser from '../parser/game/gameTopic'

import gameBattleParser from '../parser/game/gameBattle'
import gameListParser from '../parser/game/gameList'
import gameQaParser from '../parser/game/gameQa'
import gameRankParser from '../parser/game/gameRank'
import newGameDiscountParser from '../parser/game/newGameDiscount'
import newGameGuideParser from '../parser/game/newGameGuide'
import newGameNewsParser from '../parser/game/newGameNews'
import newGameQaParser from '../parser/game/newGameQa'
import newGameExpParser from '../parser/game/newGameExp'

import favoriteParser from '../parser/user/favorite'
import issueParser from '../parser/user/issue'
import qaTopicParser from '../parser/qa/qa'
import userBoardParser from '../parser/user/comment'
import gamePointParser from '../parser/game/gamePoint'
import storeParser from '../parser/store'
import storeTopicParser from '../parser/store/store'
import tradeParser from '../parser/trade'
import tradeTopicParser from '../parser/trade/trade'
import circlesParser from '../parser/circle'
import circleParser from '../parser/circle/circle'
import circleLeaderParser from '../parser/circle/rank'
import userCircleParser from '../parser/user/circle'
import userGroupParser from '../parser/user/element'
import photoParser from '../parser/user/photo'
import detailParser from '../parser/user/detail'
import customParser from '../parser/user/custom'
import newQaParser from '../parser/new/qa'
import newBattleParser from '../parser/new/battle'
import topicEditParser from '../parser/edit/topic'
import qaEditParser from '../parser/edit/qa'
import geneEditParser from '../parser/edit/gene'
import battleEditParser from '../parser/edit/battle'
import tradeEditParser from '../parser/edit/trade'
import userDiaryParser from '../parser/user/diary'
import userTopicParser from '../parser/user/topic'
import userGeneParser from '../parser/user/gene'
import mainParser from '../parser/main'
import gameNewTopicParser from '../parser/game/gameNewTopic'
import newGeneElementParser from '../parser/circle/element'
import userBlockParser from '../parser/user/block'
import nbParser from '../parser/user/nb'

const safeFetch = function(reqUrl, type = 'text') {
  return new Promise((resolve, reject) => {
    let timeout = setTimeout(() => reject('请求超时::dao.js::line#31'), 20000)
    console.log(reqUrl)
    fetch(reqUrl).then((response) => {
      clearTimeout(timeout)
      const text = response[type]()
      return resolve(text)
    }).catch((error) => {
      console.warn(error)
      clearTimeout(timeout)
      resolve([])
    })
  })
}

const host = `http://120.55.124.66`

const webHost = `http://psnine.com`

const getTopicsAPI = ({ page, type, title }) => {
  if (!type) {
    return `${webHost}/topic?page=${page}&node=${type}${title ? `&title=${title}` : '' }`
  } else {
    const target = type === 'news' ? '/news/' : '/node/' + type
    return `${webHost}${target}?page=${page}${title ? `&title=${title}` : '' }`
  }
}

const getGenesAPI = ({ page, type, title }) => `${webHost}/gene?page=${page}&type=${type}${title ? `&title=${title}` : '' }`

export const fetchTopics = (...args) => safeFetch(getTopicsAPI(...args)).then(res => topicParser(res))

export const fetchGenes = (...args) => safeFetch(getGenesAPI(...args)).then(res => geneParser(res))

export const fetchCreateDiary = (uri, isTopic) => safeFetch(uri).then(res => isTopic ? topicParser(res) : geneParser(res))

export const getTopicAPI = uri => safeFetch(uri).then(res => topicApiParser(res, uri.includes('/gene/') ? 'gene' : 'topic'))

export const getBattleAPI = uri => safeFetch(uri).then(res => battleTopicParser(res))

export const getNBAPI = uri => safeFetch(uri).then(res => nbParser(res))

export const getGameAPI = uri => safeFetch(uri).then(res => gameParser(res))

export const getTrophyAPI = uri => safeFetch(uri).then(res => trophyParser(res))

export const getUserBoardCommentAPI = uri => safeFetch(uri).then(res => userBoardParser(res))

export const getUserDiaryAPI = uri => safeFetch(uri).then(res => userDiaryParser(res))

export const getUserTopicAPI = uri => safeFetch(uri).then(res => userTopicParser(res))

export const getUserGeneAPI = uri => safeFetch(uri).then(res => userGeneParser(res))

export const getMainAPI = () => safeFetch(webHost).then(res => mainParser(res))

export const getFavoriteAPI = (uri, type = 'topic') => safeFetch(`${uri}&channel=${type}`).then(res => favoriteParser(res, type))

export const getIssueAPI = (uri, type = 'topic') => safeFetch(`${uri}&channel=${type}`).then(res => issueParser(res, type))

export const getQaTopicAPI = uri => safeFetch(uri).then(res => qaTopicParser(res))

export const getMyGameAPI = uri => safeFetch(uri).then(res => myGameParser(res, uri.split('/').pop()))

export const getTradeTopicAPI = uri => safeFetch(uri).then(res => tradeTopicParser(res, uri.split('/').pop()))

export const getGameTopicAPI = uri => safeFetch(uri).then(res => gameTopicParser(res, uri.split('/').pop()))

export const getGameMapperAPI = uri => safeFetch(uri).then(res => {

  const id = uri.replace(/\?(.*?)$/, '').split('/').pop()
  switch (id) {
    case 'news':
      return newGameNewsParser(res)
    case 'guide':
      return newGameGuideParser(res)
    case 'exp':
      return newGameExpParser(res)
    case 'qa':
      return uri.includes('/psngame/') ? gameQaParser(res) : newGameQaParser(res)
    case 'discount':
      return newGameDiscountParser(res)
    case 'rank':
      return gameRankParser(res)
    case 'battle':
      return gameBattleParser(res)
    case 'gamelist':
      return gameListParser(res)
    default:
      return {}
  }
})

export const getGameNewTopicAPI = uri => safeFetch(uri).then(res => gameNewTopicParser(res, uri.split('/').pop()))

export const getHomeAPI = uri => safeFetch(uri).then(res => homeParser(res, uri.split('/').pop()))

export const getTopicContentAPI = uri => safeFetch(uri).then(res => topicContentApiParser(res))

export const getTopicCommentAPI = uri => safeFetch(uri).then(res => topicCommentApiParser(res))

export const getTopicCommentSnapshotAPI = uri => safeFetch(uri).then(res => topicCommentSnapshotApiParser(res))

export const getTopicURL = id => webHost + '/topic/' + id

export const getGeneURL = id => webHost + '/gene/' + id

export const getHappyPlusOneURL = id => webHost + '/youhui'

export const getDealURL = id => webHost + '/trade'

export const getStoreURL = id => webHost + '/store'

export const pngPrefix = 'http://photo.d7vg.com/'

export const getMessagesAPI = id => webHost + '/my/notice'

export const fetchMessages = id => safeFetch(getMessagesAPI(id)).then(res => messageParser(res))

export const getBattlesAPI = id => webHost + '/battle'

export const fetchBattles = () => safeFetch(getBattlesAPI()).then(res => battleParser(res))

export const getBattleURL = id => webHost + '/battle/' + id

export const getGamePngURL = id => `${pngPrefix}/psngame/${id}.png@91w.png`

export const getHomeURL = id => `${webHost}/psnid/${id}`

export const getRankURL = () => `${webHost}/psnid`

export const getMyGameURL = id => `${webHost}/psnid/${id}/psngame?page=1`

export const fetchUser = id => safeFetch(getHomeURL(id)).then(res => userParser(res, id))

export const getQasAPI = ({ page = 1, type = 'all', sort = 'obdate', title }) => webHost + `/qa?page=${page}&type=${type}&ob=${sort}${title ? `&title=${title}` : '' }`

export const fetchQuestion = (...args) => safeFetch(getQasAPI(...args)).then(res => qaParser(res))

export const getQAUrl = id => `${webHost}/qa/${id}`

export const fetchGames = (...args) => safeFetch(getGamesAPI(...args)).then(res => gamesParser(res))

export const fetchRanks = (...args) => safeFetch(getRanksAPI(...args)).then(res => ranksParser(res))

export const getUserUrl = id => `${webHost}/psnid/${id}`

export const getRanksAPI = ({ page = 1, sort = 'point', server = 'hk', cheat = '0', title }) => `${webHost}/psnid?page=${page}&ob=${sort}&server=${server}&cheat=${cheat}${title ? `&title=${title}` : '' }`

export const getGamesAPI = ({ page = 1, sort = 'newest', pf = 'all', dlc = 'all', title }) => `${webHost}/psngame?page=${page}&ob=${sort}&pf=${pf}&dlc=${dlc}${title ? `&title=${title}` : '' }`

export const getStoresAPI = ({ page, server, ob, pf, plus, title }) => `${webHost}/store?page=${page}&server=${server}&ob=${ob}&pf=${pf}&plus=${plus}${title ? `&title=${title}` : '' }`

export const fetchStores = (...args) => safeFetch(getStoresAPI(...args)).then(res => storeParser(res))

export const getCustomAPI = url => safeFetch(url).then(res => customParser(res))

export const getNewBattleAPI = () => safeFetch('http://psnine.com/set/battle').then(res => newBattleParser(res))

export const getNewQaAPI = () => safeFetch('http://psnine.com/set/qa').then(res => newQaParser(res))

export const getStoreAPI = ({ id, server}) => {
  let url
  let param
  if (server == 'cn') {
    param = 'CN/zh'
    // uparam = 'zh-hans-cn';
  } else if (server == 'hk') {
    param = 'HK/zh'
    // uparam = 'zh-hans-hk';
  } else if (server == 'jp') {
    param = 'JP/ja'
    // uparam = 'ja-jp';
  } else if (server == 'us') {
    param = 'US/en'
    // uparam = 'en-us';
  }
  return 'https://store.playstation.com/store/api/chihiro/00_09_000/container/' + param + '/999/' + id
}

export const fetchStore = ({ id, server}) => safeFetch(getStoreAPI({ id, server}), 'json').then(res => storeTopicParser(res, server))

export const getTradeAPI = ({ page, category, type, pf, lang, province, ob, title }) => `${webHost}/trade?page=${page}&category=${category}&type=${type}&pf=${pf}&lang=${lang}&province=${province}&ob=${ob}${title ? `&title=${title}` : '' }`

export const fetchTrades = (...args) => safeFetch(getTradeAPI(...args)).then(res => tradeParser(res))

export const fetchCircles = (...args) => safeFetch(getCirlclesAPI(...args)).then(res => circlesParser(res))

export const fetchCircle = url => safeFetch(url).then(res => circleParser(res))

export const parseNewGeneElement = url => url.includes('psnine.com/gene') ? url : `${webHost}/gene?ele=${url}&page=1`

export const fetchNewGeneElement = url => safeFetch(parseNewGeneElement(url)).then(res => newGeneElementParser(res))

export const getGroupAPI = url => safeFetch(url).then(res => userGroupParser(res))

export const getBlockAPI = url => safeFetch(url).then(res => userBlockParser(res))

export const fetchCircleLeader = url => safeFetch(url).then(res => circleLeaderParser(res))

export const getDetailAPI = url => safeFetch(url).then(res => detailParser(res))

export const getCirlclesAPI = ({ page, title, type }) => `${webHost}/group?page=${page}&type=${type}${title ? `&title=${title}` : '' }`

export const getCirlcleAPI = ({ id, page }) => `${webHost}/group/${id}?page=${page}`

export const getCirlcleLeaderAPI = ({ id, page }) => `${webHost}/group/${id}/rank?page=${page}`

export const getGamePointURL = id => `${webHost}/psngame/${id}/comment`

export const getGamePointAPI = url => safeFetch(url).then(res => gamePointParser(res))

export const getPhotoAPI = url => safeFetch(url).then(res => photoParser(res))

export const getUserCircleAPI = url => safeFetch(url).then(res => userCircleParser(res))

export const getGameUrl = id => `${webHost}/psngame/${id}`

export const getTopicEditAPI = url => safeFetch(url).then(res => topicEditParser(res))

export const getQaEditAPI = url => safeFetch(url).then(res => qaEditParser(res))

export const getGeneEditAPI = url => safeFetch(url).then(res => geneEditParser(res))

export const getBattleEditAPI = url => safeFetch(url).then(res => battleEditParser(res))

export const getTradeEditAPI = url => safeFetch(url).then(res => tradeEditParser(res))