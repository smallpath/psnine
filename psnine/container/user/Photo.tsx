import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableNativeFeedback,
  RefreshControl,
  InteractionManager,
  Slider,
  FlatList,
  Alert,
  ToastAndroid,
  Platform
} from 'react-native'

const { width: SCREEN_WIDTH } = Dimensions.get('window')

import { standardColor, idColor } from '../../constant/colorConfig'

import Ionicons from 'react-native-vector-icons/Ionicons'
import { getPhotoAPI } from '../../dao'
import { postDeleteImage, postImage } from '../../dao/post'
declare var global

import FooterProgress from '../../component/FooterProgress'

let toolbarActions = [
  { title: '上传', iconName: 'md-cloud-upload', show: 'always' },
  { title: '跳页', iconName: 'md-map', show: 'always' },
  { title: '确定', iconName: 'md-done-all', show: 'always' }
]

import Item from '../../component/PhotoItem'

import ImagePicker from 'react-native-image-picker'

const uploadOptions: any = {
  title: '选择图片',
  cancelButtonTitle: '取消',
  takePhotoButtonTitle: '拍摄',
  chooseFromLibraryButtonTitle: '选择图片',
  mediaType: 'photo',
  noData: true,
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
}

export default class Photo extends Component<any, any> {
  constructor(props) {
    super(props)
    const { navigation } = this.props
    const { params } = navigation.state
    const { selections = [], type = 'general' } = params
    this.state = {
      list: [],
      numberPerPage: 60,
      numPages: 1,
      commentTotal: 1,
      currentPage: 1,
      isRefreshing: true,
      isLoadingMore: false,
      modalVisible: false,
      sliderValue: 1,
      selections,
      type
    }
  }

  onNavClicked = () => {
    const { navigation } = this.props
    navigation.goBack()
  }

  async componentWillMount() {
    const { params } = this.props.navigation.state
    this.fetchMessages(params.URL, 'jump')
  }

  fetchMessages = (url, type = 'down') => {
    this.setState({
      [type === 'down' ? 'isLoadingMore' : 'isRefreshing'] : true
    }, () => {
      InteractionManager.runAfterInteractions(() => {
        getPhotoAPI(url).then(data => {
          let thisList: any = []
          const thisPage = parseInt((url.match(/\?page=(\d+)/) || [0, 1])[1], 10)
          let cb = () => { }
          if (type === 'down') {
            thisList = this.state.list.concat(data.list)
            this.pageArr.push(thisPage)
          } else if (type === 'up') {
            thisList = this.state.list.slice()
            thisList.unshift(...data.list)
            this.pageArr.unshift(thisPage)
          } else if (type === 'jump') {
            // cb = () => this.listView.scrollTo({ y: 0, animated: true });
            thisList = data.list
            this.pageArr = [thisPage]
          }
          this.pageArr = this.pageArr.sort((a, b) => a - b)
          this.setState({
            list: thisList,
            numberPerPage: data.numberPerPage,
            numPages: data.numPages,
            commentTotal: data.len,
            currentPage: thisPage,
            isLoadingMore: false,
            isRefreshing: false,
            finalType: this.state.type
          }, cb)
        })
      })
    })
  }

  pageArr = [1]
  _onRefresh = () => {
    const { URL } = this.props.navigation.state.params
    const currentPage = this.pageArr[0] || 1
    let type = currentPage === 1 ? 'jump' : 'up'
    let targetPage = currentPage - 1
    if (type === 'jump') {
      targetPage = 1
    }
    if (this.pageArr.includes(targetPage)) type = 'jump'
    if (this.state.isLoadingMore || this.state.isRefreshing) return
    this.fetchMessages(URL.split('=').slice(0, -1).concat(targetPage).join('='), type)
  }

  _onEndReached = () => {
    const { URL } = this.props.navigation.state.params
    const currentPage = this.pageArr[this.pageArr.length - 1]
    const targetPage = currentPage + 1
    if (targetPage > this.state.numPages) return
    if (this.state.isLoadingMore || this.state.isRefreshing) return
    this.fetchMessages(URL.split('=').slice(0, -1).concat(targetPage).join('='), 'down')
  }

  onActionSelected = (index) => {
    switch (index) {
      case 0:

        ImagePicker.showImagePicker(uploadOptions, (response) => {
          // console.log('Response = ', response);
          const toast = Platform.OS === 'ios' ? global.toast : ToastAndroid.show.bind(ToastAndroid)
          if (response.didCancel) {
            // console.log('User cancelled image picker');
          } else if (response.error) {
            // console.log('ImagePicker Error: ', response.error);
          } else {
            let { uri = '', type = '', fileSize, fileName = '' } = response
            // console.log('??')
            if (fileSize > 1024 * 1024) {
              toast('PSNINE上传的图片文件最大为1M, 上传可能会失败', ToastAndroid.SHORT)
            } else {
              toast('上传中', ToastAndroid.SHORT)
            }
            if (!type) {
              type = 'image/' + (fileName || '').split('.').pop()
            }

            postImage({
              image: {
                uri
              },
              type: type || ''
            }).then(res => {
              return res.text()
            }).then(() => {
              global.toast('图片上传成功')
              const { navigation } = this.props
              const { params } = navigation.state
              this.fetchMessages(params.URL, 'jump')
            }).catch(err => {
              global.toast(err.toString())
            })
          }
        })
        return
      case 1:
        this.setState({
          modalVisible: true
        })
        return
      case 2:
        const { navigation } = this.props
        const { params } = navigation.state
        params.callbackAfterAll && params.callbackAfterAll(this.state.selections)
        navigation.goBack()
        return
      default:
        return
    }
  }

  ITEM_HEIGHT = 150 + 10

  _renderItem = ({ item: rowData }) => {
    const { modeInfo } = this.props.screenProps
    const { navigation } = this.props
    const { params } = navigation.state
    const { selections } = this.state
    // console.log(rowData)
    return <Item {...{
      navigation,
      rowData,
      modeInfo,
      ITEM_HEIGHT: SCREEN_WIDTH / 3 / modeInfo.numColumns,
      width: SCREEN_WIDTH / 3 / modeInfo.numColumns - 10,
      isChecked: selections.includes(rowData.id),
      onPress: () => {
        if (params.alertText && params.afterAlert) {
          Alert.alert(
            '提示',
            params.alertText,
            [
              {
                text: '取消', style: 'cancel'
              },
              {
                text: '确定', onPress: () => {
                  navigation.goBack()
                  params.afterAlert({ url: rowData.href || rowData.img })
                }
              }
            ]
          )
        } else if (params.callback) {
          navigation.goBack()
          params.callback({ url: rowData.href || rowData.img })
        } else if (params.type === 'multi') {
          const target = this.state.selections.includes(rowData.id) ?
              this.state.selections.filter(item => item !== rowData.id) :
              this.state.selections.slice().concat(rowData.id)
          this.setState({
            selections: target
          })
        }
      },
      onLongPress: () => {
        postDeleteImage({ delimg: rowData.delimg }).then(res => res.text()).then(() => {
          global.toast('删除成功')
          this.fetchMessages(params.URL, 'jump')
        })
      }
    }} />
  }

  sliderValue = 1
  render() {
    const { modeInfo } = this.props.screenProps
    const { params } = this.props.navigation.state
    // console.log('Message.js rendered');

    return (
      <View
        style={{ flex: 1, backgroundColor: modeInfo.backgroundColor }}
        onStartShouldSetResponder={() => false}
        onMoveShouldSetResponder={() => false}
      >
        <Ionicons.ToolbarAndroid
          navIconName='md-arrow-back'
          overflowIconName='md-more'
          iconColor={modeInfo.isNightMode ? '#000' : '#fff'}
          title={'图床'}
          style={[styles.toolbar, { backgroundColor: modeInfo.standardColor }]}
          titleColor={modeInfo.isNightMode ? '#000' : '#fff'}
          actions={params.type === 'multi' ? toolbarActions : toolbarActions.slice(0, 2)}
          onIconClicked={this.onNavClicked}
          onActionSelected={this.onActionSelected}
        />
        <FlatList style={{
          flex: 1,
          backgroundColor: modeInfo.backgroundColor
        }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this._onRefresh}
              colors={[modeInfo.accentColor]}
              progressBackgroundColor={modeInfo.backgroundColor}
            />
          }
          ListFooterComponent={() => <FooterProgress isLoadingMore={this.state.isLoadingMore} modeInfo={modeInfo} />}
          data={this.state.list}
          keyExtractor={(item) => item.url || item.href}
          renderItem={this._renderItem}
          onEndReached={this._onEndReached}
          onEndReachedThreshold={0.5}
          extraData={modeInfo}
          windowSize={21}
          key={modeInfo.themeName}
          numColumns={3 * modeInfo.numColumns}
          columnWrapperStyle={{
            flex: 1
          }}
          updateCellsBatchingPeriod={1}
          initialNumToRender={42}
          maxToRenderPerBatch={8}
          disableVirtualization={false}
          viewabilityConfig={{
            minimumViewTime: 1,
            viewAreaCoveragePercentThreshold: 0,
            waitForInteractions: true
          }}
        />
        {this.state.modalVisible && (
          <global.MyDialog modeInfo={modeInfo}
            modalVisible={this.state.modalVisible}
            onDismiss={() => { this.setState({ modalVisible: false }); this.isValueChanged = false }}
            onRequestClose={() => { this.setState({ modalVisible: false }); this.isValueChanged = false }}
            renderContent={() => (
              <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: modeInfo.backgroundColor,
                paddingVertical: 20,
                paddingHorizontal: 40,
                elevation: 4,
                opacity: 1,
                borderRadius: 2
              }} >
                <Text style={{ alignSelf: 'flex-start', fontSize: 18, color: modeInfo.titleTextColor }}>选择页数: {
                  this.isValueChanged ? this.state.sliderValue : this.state.currentPage
                }</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={{color: modeInfo.standardTextColor}}>{this.state.currentPage}</Text>
                  <Slider
                    maximumValue={this.state.numPages}
                    minimumValue={1}
                    maximumTrackTintColor={modeInfo.accentColor}
                    minimumTrackTintColor={modeInfo.standardTextColor}
                    thumbTintColor={modeInfo.accentColor}
                    style={{
                      paddingHorizontal: 90,
                      height: 50
                    }}
                    value={this.state.currentPage}
                    onValueChange={(value) => {
                      this.isValueChanged = true
                      this.setState({
                        sliderValue: Math.round(value)
                      })
                    }}
                  />
                  <Text style={{color: modeInfo.standardTextColor}}>{this.state.numPages}</Text>
                </View>
                <TouchableNativeFeedback onPress={() => {
                    this.setState({
                      modalVisible: false,
                      isLoading: true
                    }, () => {
                      const targetPage = params.URL.split('=').slice(0, -1).concat(this.state.sliderValue).join('=')
                      this.fetchMessages(targetPage, 'jump')
                    })
                  }}>
                  <View style={{ alignSelf: 'flex-end', paddingHorizontal: 8, paddingVertical: 5 }}>
                    <Text style={{color: '#009688'}}>确定</Text>
                  </View>
                </TouchableNativeFeedback>
              </View>
            )} />
        )}
      </View>
    )
  }

  isValueChanged = false

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#F5FCFF'
  },
  toolbar: {
    backgroundColor: standardColor,
    height: 56,
    elevation: 4
  },
  selectedTitle: {
    // backgroundColor: '#00ffff'
    // fontSize: 20
  },
  avatar: {
    width: 50,
    height: 50
  },
  a: {
    fontWeight: '300',
    color: idColor // make links coloured pink
  }
})
