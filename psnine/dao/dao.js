'use strict';

import React from 'react-native';

const safeFetch = function(reqUrl) {
  console.log('req:', reqUrl);
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

const fetchTopics = (page = 1,type = '') => safeFetch(getTopicsAPI(page,type));

const fetchGenes = (page = 1, type = 'all') => safeFetch(getGenesAPI(page,type));

const getTopicURL = id => webHost + '/topic/' + id; 

const getGeneURL = id => webHost + '/gene/' + id;


module.exports = {
    fetchTopics,
    getTopicURL,
    fetchGenes,
    getGeneURL,
}