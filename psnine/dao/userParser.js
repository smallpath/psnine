import { pngPrefix } from './dao';

let imageIndexStr = `psn-rsc.prod.dl.playstation.net/psn-rsc/`;
let platinumStr = 'text-platinum">';
let goldStr = 'text-gold">';
let silverStr ='text-silver">';
let bronzeStr = 'text-bronze">'

const parseAvatar = (source, pattern)=>{
    let index = source.indexOf(pattern);
    let str = '';
    if(index!=0){
        index+=pattern.length;
        while (source[index] != '\"'){
            str += source[index];
            index++;
        }
    }
    return pngPrefix + str + '@70w.png';
}

const parseTrophy = (source, pattern)=>{
    let index = source.indexOf(pattern);
    let str = '';
    if(index!=0){
        index+=pattern.length;
        while (source[index] != '<'){
            str += source[index];
            index++;
        }
    }
    return str;
}

export const parseAll = (source)=>{
    let obj = {};
    obj.avatar = { uri: parseAvatar(source, imageIndexStr) };
    obj.platinum = parseTrophy(source, platinumStr);
    obj.gold = parseTrophy(source, goldStr);
    obj.silver = parseTrophy(source, silverStr);
    obj.bronze = parseTrophy(source, bronzeStr);
    return obj;
}

export const fetchUser = function(psnid) {
    const userURL = `http://psnine.com/psnid/${psnid}`;

    return new Promise((resolve, reject) => {
        fetch(userURL)
        .then(data=>{
            let obj = parseAll(data._bodyInit);
            //console.log(data);
            // let str = data._bodyInit;
            // let index = str.indexOf(imageIndexStr);
            // //console.log('位置:',index, '总长度', str.length)
            // let relativeImageURL = '';
            // if(index!=0){
            //     index+=imageIndexStr.length;
            //     while (str[index] != '\"'){
            //         relativeImageURL += str[index];
            //         index++;
            //     }
            // }

            resolve(obj);
        })
    });
};

