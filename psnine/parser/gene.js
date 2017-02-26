import parser from 'cheerio-without-node-native'

export default function (html) {

  const $ = parser.load(html)
  const result = []

  $('ul.list li').each(function(i, elem) {
    const $this = $(this)
    const img = $this.find('img').attr('src')
    const thumbs = $this.find('img').map(function(i, elem) {
        return $(this).attr('src')
    }).filter(index => !!index)
    const text = $this.text()
    const arr = text
                    .split('\n')
                    .map(item => item.replace(/\s+/g, ''))
                    .filter(item => item)
                    .reduce((prev, curr, index, origin) => {
                        const len = origin.length
                        switch (true) {
                            case index === 0:
                                prev[index] = curr;
                                break;
                            case index === len - 1:
                                prev[4] = curr;
                                break;
                            case index === len - 2:
                                prev[3] = curr;
                                break;
                            case index === len - 3:
                                prev[2] = curr;
                                break;
                            default:
                                prev[1] = prev[1] ? prev[1] + curr : curr
                                break;
                        }
                        return prev
                    }, [])
    const matched = $this.find('.content')[0].parent.attribs.onclick.match(/\d+/)
    const id = matched ? matched[0] :arr[1] + arr[2]

    const mock = {
      circle: arr[0].split('：')[1],
      content: arr[1],
      psnid: arr[2],
      date: arr[3],
      avatar: img,
      id,
      thumbs,
      count: arr[4],
      type: arr[4]
    }
    result.push(mock)
  })
  return result
}