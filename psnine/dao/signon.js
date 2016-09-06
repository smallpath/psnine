import {
  AsyncStorage,
} from 'react-native';

let numStr = '<b style="color:red;">';

const signonURL = 'http://psnine.com/set/qidao/post';

export const fetchSignOn = function(psnid) {

    return new Promise((resolve, reject) => {
        fetch(signonURL)
        .then((response)=>{
            setTimeout(() => null, 0);
            return response.text();
        })
        .then(html=>{
            let obj = parseSignOn(html, numStr);
            resolve(obj);
        })
    });
};

const parseSignOn = (source, pattern)=>{
    let index = source.indexOf(pattern);
    let str = '';
    if(index!=-1){
        index+=pattern.length;
        while (source[index] != '<'){
            str += source[index];
            index++;
        }
    }
    return '本次祈祷得到 '+str+' 铜币';
}


export const safeSignOn = async function(psnid) {
      if(psnid == null)
        return;

      let data = await fetchSignOn(psnid);
    
      return data;
};