

const loginURL = 'http://psnine.com/sign/in';

export const registURL = `http://psnine.com/psnauth`;

export const safeLogin = function(psnid, pass) {
    let signin = '';
    let formBody = [];
    let details = {psnid, pass, signin};
    for (var property in details) {
        var encodedKey = encodeURIComponent(property);
        var encodedValue = encodeURIComponent(details[property]);
        formBody.push(encodedKey + "=" + encodedValue);
    }
    formBody = formBody.join("&");
    //console.log(formBody)

    return new Promise((resolve, reject) => {
        fetch(loginURL,{
            method: 'POST',
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formBody,
        })
        .then((responseData) => {
            resolve(responseData);
        })
    });
};


// fetch('https://mywebsite.com/endpoint/', {
//   method: 'POST',
//   headers: {
//     'Accept': 'application/json',
//     'Content-Type': 'application/json',
//   },
//   body: JSON.stringify({
//     firstParam: 'yourValue',
//     secondParam: 'yourOtherValue',
//   })
// })