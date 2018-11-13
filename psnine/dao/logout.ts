import {
  AsyncStorage
} from 'react-native'

const logoutURL = 'https://psnine.com/sign/out'

export const safeLogout = async function (psnid) {
  if (psnid === null) return

  await fetch(logoutURL)

  await AsyncStorage.removeItem('@psnid')
}