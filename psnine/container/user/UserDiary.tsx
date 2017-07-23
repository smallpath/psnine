import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  ListView,
  Image,
  Picker,
  Dimensions,
  TouchableNativeFeedback,
  RefreshControl,
  InteractionManager,
  Modal,
  Slider,
  ActivityIndicator,
  FlatList,
  Button,
  Alert
} from 'react-native'

import { standardColor, nodeColor, idColor } from '../../constant/colorConfig'

import Ionicons from 'react-native-vector-icons/Ionicons'
import { getUserDiaryAPI } from '../../dao'
import { createDiary } from '../../dao/post'
import DiaryItem from '../../component/DiaryItem'

let toolbarActions = []

class UserBoard extends Component {
  static navigationOptions = {
     tabBarLabel: '日志'
  }
  constructor(props) {
    super(props)
    this.state = {
      data: false,
      diary: [],
      isLoading: true,
      modalVisible: false,
      sliderValue: 1
    }
  }

  onActionSelected = (index) => {
    if (index === 0) {
      return this.props.screenProps.navigation.navigate('WebView', {
        URL: 'http://psnine.com/set/diary'
      })
    }
  }

  handleImageOnclick = (url) => this.props.screenProps.navigation.navigate('ImageViewer', {
    images: [
      { url }
    ]
  })

  componentWillMount = async () => {
    const { screenProps } = this.props
    const name = '日志'
    let params = {}
    screenProps.toolbar.forEach(({ text, url}) => {
      if (text === name) {
        params.text = text
        params.URL = url
      }
    })
    if (!params.URL) {
      params = {
        text: '日志',
        URL: screenProps.toolbar[0].url + '/diary'
      }
    }
    this.URL = params.URL
    this.preFetch()
  }

  preFetch = () => {
    this.setState({
      isLoading: true
    }, () => {
      InteractionManager.runAfterInteractions(() => {
        getUserDiaryAPI(this.URL).then(data => {
          // console.log(data)
          this.setState({
            data,
            diary: data.diary,
            isLoading: false
          }, () => {
            const targetToolbar = toolbarActions.slice()
            const { modeInfo, psnid } = this.props.screenProps
            const { URL } = this
            // console.log('Message.js rendered');
            const isOwner = modeInfo.settingInfo.psnid.toLowerCase() === psnid.toLowerCase()
            if (isOwner) {
              targetToolbar.push({
                iconName: 'md-create', title: '创建日志', iconSize: 22, show: 'always'
              })
            }
            const componentDidFocus = () => {
              InteractionManager.runAfterInteractions(() => {
                this.props.screenProps.setToolbar({
                  toolbar: targetToolbar,
                  toolbarActions: this.onActionSelected,
                  componentDidFocus: {
                    index: 2,
                    handler: componentDidFocus
                  }
                })
              })
            }
            componentDidFocus()
          })
        })
      })
    })
  }

  renderDiary = (rowData, index) => {
    const { modeInfo, navigation } = this.props.screenProps
    const shouldShowImage = rowData.thumbs.length !== 0
    const suffix = '<div>' + rowData.thumbs.map(text => `<img src="${text}">`).join('') + '</div>'
    const content = `<div>${rowData.content}<br><br>${shouldShowImage ? suffix : ''}</div>`
    // console.log('here', rowData)
    return <DiaryItem {...{
      navigation,
      rowData,
      modeInfo,
      content
    }} />
  }

  isReplyShowing = false

  render() {
    const { modeInfo, psnid } = this.props.screenProps
    const { URL } = this
    const isUser = URL.split('/').slice(0, -1).pop().toLowerCase() === modeInfo.settingInfo.psnid.toLowerCase()
    // console.log('Message.js rendered');
    return (
      <View
        style={{ flex: 1, backgroundColor: modeInfo.backgroundColor }}
        onStartShouldSetResponder={() => false}
        onMoveShouldSetResponder={() => false}
      >
        <FlatList style={{
          flex: -1,
          backgroundColor: modeInfo.backgroundColor
        }}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isLoading}
              onRefresh={this.preFetch}
              colors={[modeInfo.accentColor]}
              progressBackgroundColor={modeInfo.backgroundColor}
              ref={ref => this.refreshControl = ref}
            />
          }
          ref={flatlist => this.flatlist = flatlist}
          data={this.state.diary}
          keyExtractor={(item, index) => item.id || index}
          renderItem={({ item, index }) => {
            return this.renderDiary(item, index)
          }}
          extraData={this.state}
          windowSize={999}
          renderScrollComponent={props => <NestedScrollView {...props}/>}
          disableVirtualization={true}
          viewabilityConfig={{
            minimumViewTime: 3000,
            viewAreaCoveragePercentThreshold: 100,
            waitForInteraction: true
          }}
        >
        </FlatList>
        {
          isUser && <View style={{
              position: 'absolute',
              right: 16,
              bottom: 16,
              width: 56,
              height: 56,
              borderRadius: 28,
              justifyContent: 'center',
              alignItems: 'center',
              elevation: 6
            }} ref={float => this.float = float}>
            <TouchableNativeFeedback
              background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
              useForeground={false}
              onPress={this.addDiary}
              onPressIn={() => {
                this.float.setNativeProps({
                  style: {
                    elevation: 12
                  }
                })
              }}
              onPressOut={() => {
                this.float.setNativeProps({
                  style: {
                    elevation: 6
                  }
                })
              }}>
              <View pointerEvents='box-only' style={{
                backgroundColor: modeInfo.accentColor,
                borderRadius: 28, width: 56, height: 56, flex: -1, justifyContent: 'center', alignItems: 'center'
              }}>
                <Ionicons name='md-create' size={22} color={modeInfo.backgroundColor}/>
              </View>
            </TouchableNativeFeedback>
          </View>
        }
      </View>
    )
  }

  addDiary = () => {
    const { navigation } = this.props.screenProps
    const callback = ({ isTopic, id }) => {
      createDiary({
        tbl: isTopic ? 'topic' : 'gene',
        param: id,
        adddiary: ''
      }).then(res => res.text()).then(html => {
        if (html.includes('玩脱了')) {
          const arr = html.match(/\<title\>(.*?)\<\/title\>/)
          if (arr && arr[1]) {
            const msg = `创建日志失败: ${arr[1]}`
            global.toast(msg)
            return
          }
        }
        toast('创建日志成功, 请稍后刷新')
      })
    }
    Alert.alert(
      '请选择种类',
      '如果列表中无任何主题或机因, 请先确定已在个性设定中将主题和机因设置为显示',
      [
        {
          text: '机因', onPress: () => {
            navigation.navigate('UserCreateDiary', {
              isTopic: false,
              URL: this.URL.split('/').slice(0, -1).concat('gene').join('/') + '?page=1',
              callback
            })
          }
        }, {
          text: '主题', onPress: () => {
            navigation.navigate('UserCreateDiary', {
              isTopic: true,
              URL: this.URL.split('/').slice(0, -1).concat('topic').join('/') + '?page=1',
              callback
            })
          }
        }
      ]
    )
  }

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
    //backgroundColor: '#00ffff'
    //fontSize: 20
  },
  avatar: {
    width: 50,
    height: 50
  },
  a: {
    color: idColor // make links coloured pink
  }
})

export default UserBoard
