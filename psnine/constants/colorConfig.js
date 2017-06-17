import palette from 'google-material-color'

import * as common from './commonColor'

const colorNameArr = Object.keys(palette.palette).filter(name => ['Black', 'White', 'Grey', 'Blue Grey', 'Brown'].includes(name) === false)

const dayColor = {
  backgroundColor: '#fff',
  brighterLevelOne: '#f8f8f8',
  standardTextColor: '#757575',
  titleTextColor: '#202020'
}

const nightColor = {
  backgroundColor: '#212121',
  brighterLevelOne: '#424242',
  standardTextColor: '#e0e0e0',
  titleTextColor: '#fff',
}

const getColor = palette.get.bind(palette)
const exports = {}

const getAccentColorName = name => {
  const index = colorNameArr.indexOf(name)
  let targetIndex = index - 5
  if (targetIndex < 0) targetIndex += colorNameArr.length
  return colorNameArr[targetIndex]
}

for (const name of colorNameArr) {
  const finalName = name[0].toLowerCase() + name.replace(' ', '').slice(1)
  exports[finalName] = {
    ...dayColor,
    ...common,
    deepColor: getColor(name, 700),
    standardColor: getColor(name, 500),
    tintColor: getColor(name, 100),
    accentColor: getColor(getAccentColorName(name), 'A200')
  }

  exports[`${finalName}Night`] = {
    ...nightColor,
    ...common,
    deepColor: getColor(name, 900),
    standardColor: getColor(name, 700),
    tintColor: getColor(name, 300),
    accentColor: getColor(getAccentColorName(name), 'A400')
  }
  // console.log(getColor(getAccentColorName(name), 'A200'), getColor(getAccentColorName(name), 'A400'))
}

Object.assign(exports, common)
export default exports
export * from './commonColor'