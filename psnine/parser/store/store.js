import parser from 'cheerio-without-node-native'

const isEmptyObject = obj => {
  let name;

  for ( name in obj ) {
    return false;
  }
  return true;
}

export default function (data, server) {
  let img = '';
  let plus = '';
  let skuname = '';
  let reledate = '';
  let price = '';
  let cover = '';
  let links = '';
  let genre = '';
  if (!isEmptyObject(data.promomedia)) {
    if (!isEmptyObject(data.promomedia[1])) {
      if (!isEmptyObject(data.promomedia[1].materials)) {
        if (!isEmptyObject(data.promomedia[1].materials[0].urls)) {
          data.promomedia[1].materials.forEach((item, i) => {
            img += '<br/><img src="' + item.urls[0].url + '" />';
          })
        }
      }
    } else if (!isEmptyObject(data.promomedia[0])) {
      if (!isEmptyObject(data.promomedia[0].materials)) {
        if (!isEmptyObject(data.promomedia[0].materials[0].urls)) {
          data.promomedia[0].materials.forEach((item, i) => {
            img += '<br/><img src="' + item.urls[0].url + '" />';
          })
        }
      }
    }
  }
  if (!isEmptyObject(data.default_sku)) {
    if (!isEmptyObject(data.default_sku.rewards)) {
      plus = '<em>　-　折扣价：</em><span class="text-warning">' + data.default_sku.rewards[0].display_price + '</span>（' + data.default_sku.rewards[0].discount + '% Off）';
    }

    if (!isEmptyObject(data.default_sku.name)) {
      skuname = data.default_sku.name;
      price = data.default_sku.display_price;
    }
  }
  if (!isEmptyObject(data.images)) {
    cover = data.images[0].url;
  }
  if (!isEmptyObject(data.links)) {
    links = '<br><br><div class="hd3">关联内容:</div><br><br><ul class="storebg storelist">';
    data.links.forEach((item, i) => {
      links += '<li><div class="pd10"><p align="center"><a href="javascript:void(0)" onclick="store(\'' + item.id + '\',\'' + server + '\')"><img src="' + item.images[2].url + '" width="160" height="160" /></a></p>';
      links += '<br><div class="lh180">';
      links += item.name;
      if (!isEmptyObject(item.game_contentType)) {
        links += '<br/><em>类别：</em>' + item.game_contentType;
      }
      if (!isEmptyObject(item.release_date)) {
        links += '<br/><em>发行：</em>' + item.release_date;
      }
      if (!isEmptyObject(item.default_sku)) {
        links += '<br/><em>售价：</em>' + item.default_sku.display_price;
        links += '<br/><em>备注：</em>' + item.default_sku.name;
      }
      links += '</div></div></li>';
    });
    links += '<div class="clear"></div></ul>';
  }
  if (!isEmptyObject(data.metadata.genre)) {
    genre = '<br><em>类型：</em>' + data.metadata.genre.values
  }
  if (!isEmptyObject(data.release_date)) {
    reledate = '<br><em>发行日期</em>：' + data.release_date
  }
  const obj = {
    content: '<div class="storebg content pd20"><div align="center"><img src="' + cover + 
              '" class="pd10 r h-p"/></div><h3 class="pb10">' + data.name + '&nbsp;<em>' + skuname + 
              '</em></h3><p><br><a href="https://store.playstation.com/#!/cid=' + data.id + 
              '" target="_blank">去官方商城（PlayStation Store）购买</a></p><br><br><p><br><br><em><br><br>分类：</em>' + data.game_contentType + 
              '</p><br><p>' + reledate + '<br><em>发行商：</em>' + data.provider_name + 
              '</p><br><p><em>平台</em>：' + data.playable_platform + genre + 
              '</p><br><p><em>零售价</em>：' + price + plus + '</p><br><br><div class="pd10">' + data.long_desc + 
              '</div>' + img + '</div>' + links
  }
  return obj
}