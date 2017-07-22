import {
  AsyncStorage,
} from 'react-native';

let numStr = '<b style="color:red;">';
let dayStr = '<b style="color:green;">';

const signonURL = 'http://psnine.com/set/qidao/ajax';

export const fetchSignOn = function (psnid) {

  return new Promise((resolve, reject) => {
    fetch(signonURL, {
      method: 'POST',
      headers: {
        'Accept': '*/*'
      }
    }).then((response) => {
      setTimeout(() => null, 0);
      return response.text();
    })
    .then(html => {
      if (html === '今天已经签过了') {
        return resolve('今天已经签过了')
      }
      let num = parseSignOn(html, numStr);
      let day = parseDays(html, dayStr);
      resolve(num + '\r\n' + day);
    })
  });
};

const parseSignOn = (source, pattern) => {
  let index = source.indexOf(pattern);
  let str = '';
  if (index != -1) {
    index += pattern.length;
    while (source[index] != '<') {
      str += source[index];
      index++;
    }
  }
  return '本次祈祷得到 ' + str + ' 铜币';
}

const parseDays = (source, pattern) => {
  let index = source.indexOf(pattern);
  let str = '';
  if (index != -1) {
    index += pattern.length;
    while (source[index] != '<') {
      str += source[index];
      index++;
    }
  }
  return '恭喜你已签到 ' + str + ' 天了';
}


export const safeSignOn = async function (psnid) {
  if (psnid == null)
    return;

  let data = await fetchSignOn(psnid);

  return data;
};