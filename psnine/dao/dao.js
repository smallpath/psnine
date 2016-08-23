'use strict';

import React from 'react-native';

const host = `http://120.55.124.66`

const topicsAPI = (page = 1,type = '') => `${host}/topic?page=${page}&node=${type}`;

const safeFetch = function(reqUrl) {
  // console.log('reqUrl', reqUrl);
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

const fetchTopics = (page = 1,type = '') => safeFetch(topicsAPI(page,type));

const getTopicURL = (id) => host + '/topic/' + id; 

module.exports = {
    fetchTopics,
    getTopicURL,
}