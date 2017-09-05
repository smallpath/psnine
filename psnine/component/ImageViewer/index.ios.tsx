import React from 'react'

import fs from 'react-native-fs'
import ImageViewer from 'react-native-image-zoom-viewer'
import {
  Animated,
  Easing
} from 'react-native'

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

const errHandler = err => global.toast.show('保存失败: ' + err.toString())

export default class extends React.Component<any, any> {
  constructor(props) {
    super(props)

    this.state = {
      translate: new Animated.Value(1)
    }
  }

  componentDidMount() {
    this.onTap(200)
  }

  onTap = (event) => {
    const delay = typeof event === 'number' ? event : 0
    const toValue = this.isHidden ? 0 : 1
    Animated.timing(this.state.translate, {
      toValue: toValue,
      duration: 350,
      easing: Easing.out(Easing.poly(5)),
      delay,
      useNativeDriver: true
    }).start(() => {
      this.isHidden = toValue === 1
    })
  }

  onActionSelected = (index) => {
    const { images, index: currentIndex } = this.state
    switch (index) {
      case 0:
        const url = images[currentIndex].url
        return onSave(url).then((data) => {
          // console.log(data)
          global.Share.open({
            url: `file:///${psnineFolder + '/' + url.split('/').pop()}`,
            message: '[PSNINE] ',
            title: 'PSNINE'
          }).catch((err) => { err && console.log(err) })
        }).catch(errHandler)
      case 0:
        return onSave(images[currentIndex].url).then(() => {
          // console.log(data)
          global.toast.show('保存成功')
        }).catch(errHandler)
    }
  }
  isHidden = true
  renderFooter = () => {
    const { modeInfo } = this.props.screenProps
    const title = '图片欣赏'
    const color = modeInfo.isNightMode ? '#000' : '#fff'
    return (
      <Animated.View style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 2,
        elevation: 4,
        backgroundColor: modeInfo.standardColor, height: 44,
        transform: [{
          translateY: this.state.translate.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 44]
          })
        }]
      }}>
      <global.Icons.ToolbarAndroid
        navIconName='md-arrow-back'
        iconColor={color}
        title={title}
        titleColor={color}
        actions={[{
          title: '分享图片', iconName: 'md-share', value: '', show: 'always'
        }, {
          title: '保存图片', iconName: 'md-download', value: '', show: 'always'
        }]}
        onActionSelected={this.onActionSelected}
        renderStatusBar={false}
        onIconClicked={() => this.props.navigation.goBack()}
        style={{height: 44, elevation: 4}}
      />
      </Animated.View>
    )
  }

  render() {
    const images = this.props.navigation.state.params.images
    if (images.length === 0) return null

    if (typeof images[0].url === 'object') {
      return <ImageViewer onClick={this.onTap}
        renderFooter={this.renderFooter}
        imageUrls={images[0].url.imageUrls} index={images[0].url.index} onSave={onSave}/>
    }
    return (
      <ImageViewer
        onClick={this.onTap}
        renderFooter={this.renderFooter}
        imageUrls={images} onSave={onSave} />
    )
  }
}