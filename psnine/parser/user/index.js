import parser from 'cheerio-without-node-native'
// let isSigned = true 
export default function (html, psnid) {
  const $ = parser.load(html)

  const avatar = $('.psnava img').attr('src')
  const arr = $('.psninfo tr td').map(function (i, elem) {
    return $(this).text()
  })

  const trophyArr = $('.psntrophy span').map(function (i, elem) {
    return $(this).text()
  })

  const backgroundImage = $('.header').next().attr('style').match(/\((.*?)\)/)

  const reg = new RegExp(`${psnid}`, 'gmi')
  const isSigned = !html.includes('qidao(this)')
  const result = {
    backgroundImage: backgroundImage[1].replace(/\'/g, ''),
    avatar: { uri: avatar },
    psnid: arr[0].match(reg) ? arr[0].match(reg)[0] : psnid,
    description: arr[0].replace(reg, ''),
    exp: arr[1],
    ranking: arr[2].replace(/\D+/, ''),
    allGames: arr[3].replace(/\D+/, ''),
    perfectGames: arr[4].replace(/\D+/, ''),
    hole: arr[5].replace(/\D+/, ''),
    ratio: arr[6],
    all: trophyArr[4],
    followed: arr[7].replace(/\D+/, ''),
    platinum: trophyArr[0],
    gold: trophyArr[1],
    silver: trophyArr[2],
    bronze: trophyArr[3],
    isSigned,
    nums: 0,
    icons: Array.from($('.psnava img').filter(i => i > 0).map(function() {
      return  $(this).attr('src')
    })),
    hasMessage: html.includes('<span class="badge dot"></span>')
  }

  // isSigned = false

  if (result.psnid && typeof result.psnid === 'string') result.psnid = result.psnid.toLowerCase() 

  if (result.hasMessage === true) {
    result.nums = parseInt((html.match(/\<span\sclass=\"badge badge-4\"\>(\d+)\<\/span>/) || [0, 0])[1])
  }
  return result
}