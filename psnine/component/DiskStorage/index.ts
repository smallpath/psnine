
import fs from 'react-native-fs'
import {
  Platform
} from 'react-native'
const isIOS = Platform.OS === 'ios'

const key = isIOS ? 'DocumentDirectoryPath' : 'ExternalStorageDirectoryPath'

const en = encodeURIComponent

export default class DiskStorage {
  psnineFolder: string
  constructor({ namespace = 'stats' }) {
    const psnineFolder = this.psnineFolder = fs[key] + `/psnine/${namespace}`
    fs.stat(psnineFolder).then(data => {
      const isDirectory = data.isDirectory()
      if (!isDirectory) {
        fs.unlink(psnineFolder).catch(() => {}).then(() => fs.mkdir(psnineFolder))
      }
    }).catch(() => {
      fs.mkdir(psnineFolder).catch(err => console.log(err, 'DiskStorage:line#27'))
    })
  }

  async setItem(key, value) {
    const filePath = this.psnineFolder + `/${en(key)}.json`
    try {
      await fs.writeFile(filePath, value, 'utf8')
      // console.log(success)
      return true
    } catch (err) {
      // console.log(err)
      return false
    }
  }

  async getItem(key) {
    const filePath = this.psnineFolder + `/${en(key)}.json`
    try {
      const content = await fs.readFile(filePath, 'utf8')
      // console.log(content)
      return content
    } catch (err) {
      // console.log(err)
      return null
    }
  }

  async removeItem(key) {
    const filePath = this.psnineFolder + `/${en(key)}.json`
    try {
      await fs.unlink(filePath)
      // console.log(content)
      return true
    } catch (err) {
      // console.log(err)
      return false
    }
  }

  async removeAll() {
    await fs.unlink(this.psnineFolder).catch(() => {})
    await fs.mkdir(this.psnineFolder)
  }
}
