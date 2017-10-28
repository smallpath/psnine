import parser from 'cheerio-without-node-native'

export default function (html, psnid) {
  const $ = parser.load(html, {
    decodeEntities: false
  })

  const setting = {
    sections: [],
    isVIP: false
  }

  $('.hd4').each(function (i, elem) {
    // if (i === 0) return
    const $this = $(this)
    setting.sections.push($this.text())
    if (i === 0) {
      setting.bg = {
        items: Array.from($this.next().find('input').map(function (j, elem){
          const $this = $(this)
          return {
            img: $this.prev().prev().attr('src'),
            href: $this.prev().prev().attr('src'),
            value: $this.attr('value'),
            id: ($this.attr('id') || '').replace('sel_', '')
          } 
        }))
      }
    } else if ($this.text() === 'VIP自定义') {
      setting.isVIP = true
    }
  })

  const filter = function (i, j) {
    const $this = $(this)
    if ($this.prop('checked')) {
      return true
    }
    return false
  }

  setting.form = {
    light: $('input[name="light"]').filter(filter).val(),
    bg: $('input[name="bg"]').filter(filter).val() || '',
    home: $('input[name="home"]').filter(filter).val(),
    bgvip: parseInt($('#bgnum').text()),
    avavip: parseInt($('#avanum').text()),
    setting: $('input[name="setting"]').filter(filter).val() || '',
    topicopen: $('input[name="topicopen"]').filter(filter).val() || '0',
    geneopen: $('input[name="geneopen"]').filter(filter).val() || '0',
    adopen: $('input[name="adopen"]').filter(filter).val() || '0',
  }

  // console.log(setting)
  return setting
}