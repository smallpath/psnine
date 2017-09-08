import parser from 'cheerio-without-node-native'

export default function (html) {
  const $ = parser.load(html)

  const obj =  {
    content: $('textarea').text(),
    title: $('input[name=title]').val(),
    hb: $('select[name=hb]').val(),
    psngameid: $('input[name=psngameid]').val(),
    node:　$('select[name=node]').val(),
    id: $('input[type=hidden]').last().val(),
    key: 'editqa'
  }
  // console.log(obj)
  return obj
}