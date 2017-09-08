import parser from 'cheerio-without-node-native'

export default function (html) {
  const $ = parser.load(html)

  const obj =  {
    num: $('select[name=num]').val(),
    psngameid: $('input[name=psngameid]').val(),
    startdate: $('select[name=startdate]').val(),
    trophies: $('input[name=trophies]').val(),
    content: $('textarea').text(),
    key: 'editbattle',
    id: $('input[type=hidden]').last().val()
  }
  // console.log(obj)
  return obj
}