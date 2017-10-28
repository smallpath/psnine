import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  RefreshControl,
  InteractionManager,
  SectionList,
  Animated,
  Alert,
  Button,
  Dimensions
} from 'react-native'

import { idColor } from '../../constant/colorConfig'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { getCustomAPI } from '../../dao'
import { postSetting } from '../../dao/post'

const AnimatedSectionList = Animated.createAnimatedComponent(SectionList)

let toolbarActions = []

import PhotoItem from '../../component/PhotoItem'

const renderSectionHeader = ({ section }) => {
  return (
    <View style={{
      backgroundColor: section.modeInfo.backgroundColor,
      flex: -1,
      padding: 7,
      elevation: 2
    }}>
      <Text numberOfLines={1}
        style={{ fontSize: 20, color: idColor, textAlign: 'left', lineHeight: 25, marginLeft: 2, marginTop: 2 }}
      >{section.key}</Text>
    </View>
  )
}

export default class Custom extends Component<any, any> {

  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      data: {
        joinedList : [],
        ownedList : []
      }
    }
  }

  componentWillMount() {
    this.fetch()
  }

  fetch = () => {
    this.setState({
      isLoading: true
    })
    InteractionManager.runAfterInteractions(() => {
      getCustomAPI('http://psnine.com/my/setting').then(data => {
        this.setState({
          data,
          isLoading: false
        })
      })
    })
  }

  onNavClicked = () => {
    this.props.navigation.goBack()
  }

  ITEM_HEIGHT = 74 + 7

  renderAD = () => {
    const { modeInfo } = this.props.screenProps
    const adopen = this.state.data.form.adopen

    return (
      <View style={{ flex: 1, padding: 10 }}>
        <Button title={(adopen === '0' ? '显示' : '隐藏') + '广告'} color={adopen !== '0' ? modeInfo.standardColor : modeInfo.standardTextColor}
          onPress={() => {
            Alert.alert(
              '广告设定',
              `是否${adopen === '1' ? '显示' : '隐藏'}广告?`,
              [
                {text: '取消', style: 'cancel'},
                {text: '确定', onPress: () => this.setSetting({
                  adopen: adopen === '0' ? '1' : '0'
                })}
              ]
            )
          }}/>
      </View>
    )
  }

  renderVIP = () => {
    const { modeInfo } = this.props.screenProps
    // console.log(index, rowData)
    const bgvip = this.state.data.form.bgvip
    const avavip = this.state.data.form.avavip
    return (
      <View style={{ flex: 1, padding: 10 }}>
        <Button title={'自定义背景图'} color={bgvip !== 0 ? modeInfo.standardColor : modeInfo.standardTextColor}
          onPress={() => {
            this.props.navigation.navigate('UserPhoto', {
              URL: 'http://psnine.com/my/photo?page=1',
              afterAlert: ({ url }) => {
                this.setSetting({
                  bgvip: url.split('/').pop().split('.')[0]
                })
              },
              alertText: '是否将此图片设置为自定义背景图?'
            })

          }}
          />
        <Button title={'自定义头像'} color={avavip !== 0 ? modeInfo.standardColor : modeInfo.standardTextColor}
          onPress={() => {
            Alert.alert(
              '个性设定',
              '请选择功能',
              [
                {text: '清除自定义头像', onPress: () => this.setSetting({
                  avavip: ''
                })},
                {text: '自定义头像', onPress: () => this.props.navigation.navigate('UserPhoto', {
                  URL: 'http://psnine.com/my/photo?page=1',
                  afterAlert: ({ url }) => {
                    this.setSetting({
                      avavip: url.split('/').pop().split('.')[0]
                    })
                  },
                  alertText: '是否将此图片设置为自定义头像?'
                })}
              ]
            )

          }}
          />
      </View>
    )
  }

  renderShow = () => {
    const { modeInfo } = this.props.screenProps
    // console.log(index, rowData)
    const home = this.state.data.form.home
    return (
      <View style={{ flex: 1, padding: 10 }}>
        <Button title={'游戏'} color={home === 'psngame' ? modeInfo.standardColor : modeInfo.standardTextColor}
          onPress={() => {
            Alert.alert(
              '个性设定',
              '是否将个人主页默认展示模块更改为游戏?',
              [
                {text: '取消', style: 'cancel'},
                {text: '确定', onPress: () => this.setSetting({
                  home: 'psngame'
                })}
              ]
            )
          }}/>
        <Button title={'日志'} color={home === 'diary' ? modeInfo.standardColor : modeInfo.standardTextColor}
          onPress={() => {
            Alert.alert(
              '个性设定',
              '是否将个人主页默认展示模块更改为日志?',
              [
                {text: '取消', style: 'cancel'},
                {text: '确定', onPress: () => this.setSetting({
                  home: 'diary'
                })}
              ]
            )
          }}/>
      </View>
    )
  }
  renderTheme = () => {
    const { modeInfo } = this.props.screenProps
    // console.log(index, rowData)
    const topicopen = this.state.data.form.topicopen
    return (
      <View style={{ flex: 1, padding: 10 }}>
        <Button title={'显示主题'} color={topicopen === '0' ? modeInfo.standardColor : modeInfo.standardTextColor}
          onPress={() => {
            Alert.alert(
              '个性设定',
              `是否在个人主页中${topicopen === '0' ? '隐藏' : '显示'}主题?`,
              [
                {text: '取消', style: 'cancel'},
                {text: '确定', onPress: () => this.setSetting({
                  topicopen: topicopen === '0' ? '1' : '0'
                })}
              ]
            )
          }}/>
      </View>
    )
  }
  renderGene = () => {
    const { modeInfo } = this.props.screenProps
    // console.log(index, rowData)
    const geneopen = this.state.data.form.geneopen
    return (
      <View style={{ flex: 1, padding: 10 }}>
        <Button title={'显示机因'} color={geneopen === '0' ? modeInfo.standardColor : modeInfo.standardTextColor}
          onPress={() => {
            Alert.alert(
              '个性设定',
              `是否在个人主页中${geneopen === '0' ? '隐藏' : '显示'}机因?`,
              [
                {text: '取消', style: 'cancel'},
                {text: '确定', onPress: () => this.setSetting({
                  geneopen: geneopen === '0' ? '1' : '0'
                })}
              ]
            )
          }}/>
      </View>
    )
  }

  renderBG = ({ item: rowData}) => {
    const { modeInfo } = this.props.screenProps
    const { navigation } = this.props
    const { width: SCREEN_WIDTH} = Dimensions.get('window')
    const items = rowData.items.map((rowData, index) => <PhotoItem key={index} {...{
      modeInfo,
      navigation,
      rowData,
      width: SCREEN_WIDTH / 4 - 10,
      ITEM_HEIGHT: SCREEN_WIDTH / 4,
      isChecked: this.state.data.form.bg === rowData.value,
      onPress: () => {
        Alert.alert(
          '个性设定',
          '是否将此图片设置为个人主页背景?',
          [
            {text: '取消', style: 'cancel'},
            {text: '确定', onPress: () => this.setSetting({
              bg: rowData.value,
              bgvip: ''
            })}
          ]
        )
      }
    }}/>)
    return (
      <View style={{ flexDirection: 'row', flexWrap: 'wrap'}}>
        {items}
      </View>
    )
  }

  setSetting = (form) => {
    const obj = Object.assign({}, this.state.data.form, form)
    return postSetting(obj).then(res => {
      // console.log(res)
      return res.text()
    }).then(() => {
      this.fetch()
      // console.log(text)
    }).catch(err => console.log(err))
  }

  render() {

    const { modeInfo } = this.props.screenProps
    const { data } = this.state
    // console.log(data, '===>')
    let sections = data.sections ? data.sections.map((item, index) => ({
      key: item,
      modeInfo,
      data: (() => {
        if (index === 0) {
          return [{ items: data.bg.items, id: 'bg' }]
        } else if (index === 1) {
          return data.isVIP ? [[{
            text: '游戏',
            value: 'psngame'
          }, {
            text: '日志',
            value: 'diary'
          }]] : []
        } else if (index === 2) {
          return [[
            {
              text: '自定义背景图'
            },
            {
              text: '自定义头像'
            }
          ]]
        } else if (index === 3) {
          return [[
            {
              text: '显示主题'
            }
          ]]
        } else if (index === 4) {
          return [[
            {
              text: '显示机因'
            }
          ]]
        } else if (index === 5) {
          return [[{
            text: '广告设定'
          }]]
        }
      })(),
      renderItem: [
        this.renderBG,
        this.renderShow,
        this.renderTheme,
        this.renderGene,
        this.renderVIP,
        this.renderAD
      ][index]
    })) : []
    if (!this.state.data.isVIP && data.sections) {
      sections = [
        sections[0],
        sections[2],
        sections[3]
      ]
    }

    // console.log(sections)

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
          title={'个性设定'}
          style={{ backgroundColor: modeInfo.standardColor, height: 56, elevation: 4 }}
          titleColor={modeInfo.isNightMode ? '#000' : '#fff'}
          actions={toolbarActions}
          onIconClicked={this.onNavClicked}
        />
        <AnimatedSectionList
          enableVirtualization={false}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isLoading}
              colors={[modeInfo.accentColor]}
              progressBackgroundColor={modeInfo.backgroundColor}
            />
          }
          disableVirtualization={true}
          keyExtractor={(item, index) => `${item.id || item.href}${index}`}
          renderSectionHeader={renderSectionHeader}
          stickySectionHeadersEnabled
          sections={sections}
        />
      </View>
    )
  }

}
