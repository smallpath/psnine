'use strict';

const safeFetch = function(reqUrl) {
  return new Promise((resolve, reject) => {
    fetch(reqUrl)
      .then((response) => response.json())
      .then((responseData) => {
        resolve(responseData);
      })
      .catch((error) => {
        console.error(error);
        resolve(null);
      });
  });
};

const host = `http://120.55.124.66`;

const webHost = `http://psnine.com`;

const getTopicsAPI = (page, type) => `${host}/topic?page=${page}&node=${type}`;

const getGenesAPI = (page, type) => `${host}/gene?page=${page}&type=${type}`;

export const fetchTopics = (page = 1,type = '') => safeFetch(getTopicsAPI(page,type));

export const fetchGenes = (page = 1, type = 'all') => safeFetch(getGenesAPI(page,type));

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