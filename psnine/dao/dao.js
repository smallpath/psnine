'use strict';
import topicParser from '../parser/community'
import geneParser from '../parser/gene'

const safeFetch = function(reqUrl) {
  return new Promise((resolve, reject) => {
    let timeout = setTimeout(reject, 2000);
    fetch(reqUrl)
      .then((response) => {
          clearTimeout(timeout);

          return response.text();
        })
      .then((responseData) => {
        resolve(responseData);
      })
      .catch((error) => {
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

export const getTopicURL = id => webHost + '/topic/' + id; 

export const getGeneURL = id => webHost + '/gene/' + id;

export const getHappyPlusOneURL = id => webHost + '/youhui';

export const getDealURL = id => webHost + '/trade';

export const getStoreURL = id => webHost + '/store';

export const pngPrefix = 'http://photo.d7vg.com/'

export const getMessagesAPI = id => host + '/user/' + id + '/notice';

export const fetchMessages = id => safeFetch(getMessagesAPI(id));

export const getBattlesAPI = id => host + '/battle';

export const fetchBattles = () => safeFetch(getBattlesAPI());

export const getBattleURL = id => webHost + '/battle/' + id;

export const getGamePngURL = id => `${pngPrefix}/psngame/${id}.png@91w.png`

export const getHomeURL = id => `${webHost}/psnid/${id}`;

export const getRankURL = () => `${webHost}/psnid`;

export const getMyGameURL = id => `${webHost}/psnid/${id}/psngame`;
