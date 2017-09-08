import parser from 'cheerio-without-node-native'

export default function (html) {
  const $ = parser.load(html)

  const obj =  {
    category: $('select[name=category]').val(),
    type: $('select[name=type]').val(),
    pf: $('select[name=pf]').val(),
    way: $('select[name=way]').val(),
    version: $('select[name=version]').val(),
    lang: $('select[name=lang]').val(),
    province: $('select[name=province]').val(),

    content: $('textarea').text(),
    title: $('input[name=title]').val(),
    price: $('input[name=price]').val(),
    qq: $('input[name=qq]').val(),
    tb: $('input[name=tb]').val(),
    photo: $('input[name=photo]').val().split(',').filter(item => item),
    key: 'edittrade',
    id: $('input[type=hidden]').last().val()
  }
  // console.log(obj)
  return obj
}