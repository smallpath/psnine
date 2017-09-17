import palette from 'google-material-color'
import * as common from './commonColor'

interface Exports {
  trophyColor1?: string
  trophyColor2?: string
  trophyColor3?: string
  trophyColor4?: string
}

export const colorNameArr = Object.keys(palette.palette).filter(name => ['Black', 'White'].includes(name) === false)

const dayColor = {
  backgroundColor: '#fff',
  brighterLevelOne: '#f8f8f8',
  standardTextColor: '#757575',
  titleTextColor: '#202020',
  hairColor: '#e8e8e8'
}

const nightColor = {
  backgroundColor: '#212121',
  brighterLevelOne: '#424242',
  standardTextColor: '#e0e0e0',
  titleTextColor: '#fff',
  hairColor: '#424242'
}

const prevGetColor = palette.get.bind(palette)
const getColor = (...args) => {
  const value = prevGetColor(...args)
  if (value) return value
  const safe = prevGetColor(args[0], '500')
  return safe
}
const exports: Exports = {}

for (const name of colorNameArr) {
  const finalName = name[0].toLowerCase() + name.replace(' ', '').slice(1)
  exports[finalName] = {
    ...dayColor,
    ...common,
    deepColor: getColor(name, 700),
    standardColor: getColor(name, 500),
    tintColor: getColor(name, 100),
    secondaryColorBackup: getColor(name, 'A200')
  }

  exports[`${finalName}Night`] = {
    ...nightColor,
    ...common,
    deepColor: getColor(name, 900),
    standardColor: getColor(name, 700),
    tintColor: getColor(name, 300),
    secondaryColorBackup: getColor(name, 'A400')
  }
}

Object.assign(exports, common)
export default exports
export * from './commonColor'
export const getAccentColorFromName = (name, isNight) => {
  return exports[`${name}${isNight ? 'Night' : ''}`].secondaryColorBackup
}
