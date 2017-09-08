import parser from 'cheerio-without-node-native'

export default function (html) {
  const $ = parser.load(html)

  const obj =  {
    content: $('textarea').text(),
    open: $('select[name=open]').val(),
    node: $('input[name=node]').val() || 'talk',
    title: $('input[name=title]').val(),
    key: 'edittopic',
    id: $('input[type=hidden]').last().val()
  }
  return obj
}