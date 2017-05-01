'use strict';
import topicParser from '../parser/community'
import geneParser from '../parser/gene'
import battleParser from '../parser/battle'
import userParser from '../parser/user'
import messageParser from '../parser/message'
import qaParser from '../parser/qa'
import gamesParser from '../parser/game'
import topicApiParser from '../parser/detail/topic'
import geneApiParser from '../parser/detail/gene'

const safeFetch = function(reqUrl) {
  return new Promise((resolve, reject) => {
    let timeout = setTimeout(() => reject('request time out'), 20000);
    fetch(reqUrl).then((response) => {
      clearTimeout(timeout);
      const text = response.text()
      return resolve(text);
    }).catch((error) => {
      console.error(error)
      clearTimeout(timeout);
      resolve([]);
    });
  });
};

const host = `http://120.55.124.66`;

const webHost = `http://psnine.com`;

const getTopicsAPI = (page, type) => !type ? `${webHost}/topic?page=${page}&node=${type}` : `${webHost}/node/${type}?page=${page}`;

const getGenesAPI = (page, type) => `${webHost}/gene?page=${page}&type=${type}`;

export const fetchTopics = (page = 1,type = '') => safeFetch(getTopicsAPI(page,type)).then(res => topicParser(res));

export const fetchGenes = (page = 1, type = 'all') => safeFetch(getGenesAPI(page,type)).then(res => geneParser(res));

export const getTopicAPI = uri => safeFetch(uri).then(res => topicApiParser(res))

export const getGeneAPI = uri => safeFetch(uri).then(res => geneApiParser(res))

export const getTopicURL = id => webHost + '/topic/' + id; 

export const getGeneURL = id => webHost + '/gene/' + id;

export const getHappyPlusOneURL = id => webHost + '/youhui';

export const getDealURL = id => webHost + '/trade';

export const getStoreURL = id => webHost + '/store';

export const pngPrefix = 'http://photo.d7vg.com/'

export const getMessagesAPI = id => webHost + '/my/notice';

export const fetchMessages = id => safeFetch(getMessagesAPI(id)).then(res => messageParser(res));

export const getBattlesAPI = id => webHost + '/battle';

export const fetchBattles = () => safeFetch(getBattlesAPI()).then(res => battleParser(res));

export const getBattleURL = id => webHost + '/battle/' + id;

export const getGamePngURL = id => `${pngPrefix}/psngame/${id}.png@91w.png`

export const getHomeURL = id => `${webHost}/psnid/${id}`;

export const getRankURL = () => `${webHost}/psnid`;

export const getMyGameURL = id => `${webHost}/psnid/${id}/psngame`;

export const fetchUser = id => safeFetch(getHomeURL(id)).then(res => userParser(res, id))

export const getQasAPI = (page, type, sort) => webHost + `/qa?page=${page}&type=${type}&ob=${sort}`

export const fetchQuestion = (page = 1, type = 'all', sort = 'obdate') => safeFetch(getQasAPI(page, type, sort)).then(res => qaParser(res));

export const getQAUrl = id => `${webHost}/qa/${id}`

export const fetchGames = (page = 1, sort = 'newest', pf = 'all', dlc = 'all') => safeFetch(getGamesAPI(page, sort, pf, dlc)).then(res => gamesParser(res));

export const getGamesAPI = (page, sort, pf, dlc) => `${webHost}/psngame?page=${page}&ob=${sort}&pf=${pf}&dlc=${dlc}`

export const getGameUrl = id => `${webHost}/psngame/${id}`