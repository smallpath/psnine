import React from 'react'
import {
  ToastAndroid
} from 'react-native'
import ImageViewer from 'react-native-image-zoom-viewer'

import fs from 'react-native-fs'

const psnineFolder = fs.ExternalStorageDirectoryPath + '/psnine'

fs.stat(psnineFolder).then(data => {
  const isDirectory = data.isDirectory()
  if (!isDirectory) {
    fs.unlink(psnineFolder).catch(() => {}).then(() => fs.mkdir(psnineFolder))
  }
}).catch(() => {
  fs.mkdir(psnineFolder)
})

const onSave = (image) => {
  const result = fs.downloadFile({
    fromUrl: image,
    toFile: psnineFolder + '/' + image.split('/').pop()
  })
  result.promise.then(() => {
    ToastAndroid.show('保存成功', ToastAndroid.SHORT)
  }).catch(err => ToastAndroid.show('保存失败: ' + err.toString(), ToastAndroid.SHORT))
}

export default class extends React.Component {
  constructor(props) {
    super(props)
  }
  render() {
    const images = this.props.navigation.state.params.images
    if (images.length === 0) return null

    if (typeof images[0].url === 'object') {
      return <ImageViewer imageUrls={images[0].url.imageUrls} index={images[0].url.index} onSave={onSave}/>
    }
    return (
      <ImageViewer imageUrls={images} onSave={onSave} />
    )
  }
}