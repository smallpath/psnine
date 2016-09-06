import { pngPrefix } from './dao';

let imageIndexStr = `psn-rsc.prod.dl.playstation.net/psn-rsc/`;
let platinumStr = 'text-platinum">';
let goldStr = 'text-gold">';
let silverStr ='text-silver">';
let bronzeStr = 'text-bronze">'
let signStr = 'class="btn" style="color:white;">';

const parseAvatar = (source, pattern)=>{
    let index = source.indexOf(pattern);
    let str = '';
    if(index!=-1){
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
    if(index!=-1){
        index+=pattern.length;
        while (source[index] != '<'){
            str += source[index];
            index++;
        }
    }
    return str;
}

const parseSignState = (source, pattern) =>{
    let index = source.indexOf(pattern);
    let str = '';
    if(index!=-1){
        return false  
    }
    return true;  
}

export const parseAll = (source)=>{
    let obj = {};
    obj.avatar = { uri: parseAvatar(source, imageIndexStr) };
    obj.platinum = parseTrophy(source, platinumStr);
    obj.gold = parseTrophy(source, goldStr);
    obj.silver = parseTrophy(source, silverStr);
    obj.bronze = parseTrophy(source, bronzeStr);
    obj.isSigned = parseSignState(source, signStr);
    return obj;
}

export const fetchUser = function(psnid) {
    const userURL = `http://psnine.com/psnid/${psnid}`;

    return new Promise((resolve, reject) => {
        fetch(userURL)
        .then((response)=>{
            setTimeout(() => null, 0);
            return response.text();
        })
        .then(html=>{
            let obj = parseAll(html);
            resolve(obj);
        })
    });
};

