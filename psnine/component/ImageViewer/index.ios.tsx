import React from 'react'

import fs from 'react-native-fs'
import ImageViewer from 'react-native-image-zoom-viewer'

declare var global

const psnineFolder = fs.ExternalStorageDirectoryPath || fs.DocumentDirectoryPath + '/psnine'

fs.stat(psnineFolder).then(data => {
  const isDirectory = data.isDirectory()
  if (!isDirectory) {
    fs.unlink(psnineFolder).catch(() => { }).then(() => fs.mkdir(psnineFolder))
  }
}).catch(() => {
  fs.mkdir(psnineFolder).catch(err => console.log(err, 'ImageViewer:line#27'))
})

const onSave = (image) => {
  // console.log(image, psnineFolder + '/' + image.split('/').pop())
  const result = fs.downloadFile({
    fromUrl: image,
    toFile: psnineFolder + '/' + image.split('/').pop()
  })
  return result.promise.then(() => {
    global.toast('保存成功')
  }).catch(err => global.toast('保存失败: ' + err.toString()))
}

export default class extends React.Component<any, any> {
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