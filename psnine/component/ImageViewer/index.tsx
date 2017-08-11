import React from 'react'
import {
  ToastAndroid,
  View,
  Animated,
  Easing,
  StatusBar,
  Text
} from 'react-native'

import fs from 'react-native-fs'
import { ViewPagerZoom } from 'react-native-image-zoom'
import PhotoView from 'react-native-photo-view'

declare var global

const psnineFolder = fs.ExternalStorageDirectoryPath + '/psnine'

fs.stat(psnineFolder).then(data => {
  const isDirectory = data.isDirectory()
  if (!isDirectory) {
    fs.unlink(psnineFolder).catch(() => { }).then(() => fs.mkdir(psnineFolder))
  }
}).catch(() => {
  fs.mkdir(psnineFolder)
})

const onSave = (image) => {
  // console.log(image, psnineFolder + '/' + image.split('/').pop())
  const result = fs.downloadFile({
    fromUrl: image,
    toFile: psnineFolder + '/' + image.split('/').pop()
  })
  return result.promise
}

const errHandler = err => ToastAndroid.show('保存失败: ' + err.toString(), ToastAndroid.SHORT)

export default class extends React.Component<any, any> {
  constructor(props) {
    super(props)

    let images = this.props.navigation.state.params.images
    let index = 0
    if (images.imageUrls) {
      images = [images.imageUrls]
    } else if (typeof images[0].url === 'object') {
      index = images[0].url.index
      images = images[0].url.imageUrls
    }
    this.initialIndex = index
    this.state = {
      index,
      images,
      translate: new Animated.Value(1)
    }
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
          ToastAndroid.show('保存成功', ToastAndroid.SHORT)
        }).catch(errHandler)
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

  isHidden = true

  onPageScroll = (event) => {
    // console.log('init', event.nativeEvent)
    if (this.isHidden === false && event.nativeEvent.offset !== 0) {
      this.isHidden = true
      Animated.timing(this.state.translate, {
        toValue: 1,
        duration: 350,
        easing: Easing.out(Easing.poly(5)),
        useNativeDriver: true
      }).start()
    }
  }

  initialIndex = 0
  render() {
    const { images, index: currentIndex } = this.state
    const { modeInfo } = this.props.screenProps
    const imageArr = images.map((item, index) => {
      return (
        <View key={index} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <PhotoView
            source={{ uri: item.url }}
            resizeMode='contain'
            minimumZoomScale={1}
            maximumZoomScale={3}
            androidScaleType='fitCenter'
            style={{
              width: modeInfo.width,
              height: modeInfo.height - (StatusBar.currentHeight || 0) + 1
            }}
            onTap={this.onTap}
            onViewTap={this.onTap}
          />
        </View>
      )
    })
    const title = images.length !== 1 ? `${currentIndex + 1} / ${images.length}` : '图片欣赏'
    const color = modeInfo.isNightMode ? '#000' : '#fff'
    return (
      <View style={{ flex: 1 }}>
        <Animated.View style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 2,
          elevation: 4,
          backgroundColor: modeInfo.standardColor, height: 56,
          transform: [{
            translateY: this.state.translate.interpolate({
              inputRange: [0, 1],
              outputRange: [0, -56]
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
          onIconClicked={() => this.props.navigation.goBack()}
          style={{height: 56, elevation: 4}}
        />
        </Animated.View>
         <Animated.View style={{
          position: 'absolute',
          top: 56,
          left: 0,
          right: 0,
          zIndex: 2,
          opacity: this.state.translate.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 1]
          })
        }} pointerEvents='none'>
          <Text style={{
            color: modeInfo.dayModeInfo.backgroundColor,
            fontSize: 15,
            textAlign: 'center',
            textAlignVertical: 'center'
          }}>
            {images.length !== 1 ? title : ''}
          </Text>
        </Animated.View>
         <ViewPagerZoom initialPage={this.initialIndex} style={{ backgroundColor: '#000', flex: 1 }}
          onPageSelected={(event) => {
            this.setState({
              index: event.nativeEvent.position
            })
           }}
           onPageScroll={this.onPageScroll}>
          {imageArr}
        </ViewPagerZoom>
      </View>
    )
  }
}