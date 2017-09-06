import React from 'react'

import fs from 'react-native-fs'
import ImageViewer from 'react-native-image-zoom-viewer'
import {
  Animated,
  Easing,
  CameraRoll
} from 'react-native'

declare var global

const psnineFolder = fs.DocumentDirectoryPath + '/psnine'

fs.stat(psnineFolder).then(data => {
  const isDirectory = data.isDirectory()
  if (!isDirectory) {
    fs.unlink(psnineFolder).catch(() => {}).then(() => fs.mkdir(psnineFolder))
  }
}).catch(() => {
  fs.mkdir(psnineFolder).catch(err => console.log(err, 'ImageViewer:line#27'))
})

const onSave = (image) => {
  // console.log(image, psnineFolder + '/' + image.split('/').pop())
  const result = CameraRoll.saveToCameraRoll(image)
  return result.then((url) => {
    global.toast('保存成功')
    return url
  }).catch(err => global.toast('保存失败: ' + err.toString()))
}

const errHandler = err => global.toast.show('保存失败: ' + err.toString())

export default class extends React.Component<any, any> {
  constructor(props) {
    super(props)

    this.state = {
      translate: new Animated.Value(1)
    }
    this.index = 0
    const { images } = this.props.navigation.state.params
    this.images = images
    if (typeof images[0].url === 'object') {
      this.index = images[0].url.index
      this.images = images[0].url.imageUrls
    }
  }

  index = 0
  images = []

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
    const { images } = this
    switch (index) {
      case 0:
        const url = images[this.index].url
        return onSave(url).then((realURL) => {
          // console.log(data)
          global.Share.open({
            url: realURL,
            message: '[PSNINE] ',
            title: 'PSNINE'
          }).catch((err) => { err && console.log(err) })
        }).catch(errHandler)
      case 1:
        return onSave(images[this.index].url)
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

  onChange = (index) => {
    this.index = index
  }

  render() {
    return (
      <ImageViewer
        onDoubleClick={this.onTap}
        renderFooter={this.renderFooter}
        imageUrls={this.images} onChange={this.onChange} saveToLocalByLongPress={false} index={this.index} onSave={onSave} />
    )
  }
}