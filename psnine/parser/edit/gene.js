import parser from 'cheerio-without-node-native'

export default function (html) {
  const $ = parser.load(html)

  const obj =  {
    content: $('textarea').first().text(),
    element: $('input[name=element]').val(),
    photo: $('input[name=photo]').val().split(',').filter(item => item),
    video: $('input[name=video]').val(),
    music: $('input[name=music]').val(),
    muparam: $('select[name=num]').val(),
    muid: $('input[name=muid]').val(),
    url: $('input[name=url]').val(),
    key: 'editgene',
    id: $('input[name=element]').parent().parent().parent().attr('id').split('-').pop()
  }
  // console.log(obj)
  return obj
}