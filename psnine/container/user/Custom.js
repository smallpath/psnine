import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  Image,
  TouchableNativeFeedback,
  RefreshControl,
  InteractionManager,
  SectionList,
  Animated,
  Alert,
  Button
} from 'react-native';

import { connect } from 'react-redux';
import { standardColor, nodeColor, idColor, accentColor } from '../../constants/colorConfig';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getCustomAPI } from '../../dao';
import { postSetting } from '../../dao/post';
import CircleItem from '../shared/CircleItem'
import MyDialog from '../../components/Dialog'
import HTMLView from '../../components/HtmlToView';
const AnimatedSectionList = Animated.createAnimatedComponent(SectionList);

let toolbarHeight = 56;
let releasedMarginTop = 0;

let toolbarActions = []

import PhotoItem from '../shared/PhotoItem'

const renderSectionHeader = ({ section }) => {
  // console.log(section)
  return (
    <View style={{
      backgroundColor: section.modeInfo.backgroundColor,
      flex: -1,
      padding: 7,
      elevation: 2,
    }}>
      <Text numberOfLines={1}
        style={{ fontSize: 20, color: idColor, textAlign: 'left', lineHeight: 25, marginLeft: 2, marginTop: 2 }}
      >{section.key}</Text>
    </View>
  );
}

export default class Custom extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      data: {
        joinedList : [],
        ownedList : []
      }
    }
  }

  componentWillMount = () => {
    this.fetch()
  }

  fetch = (type = '') => {
    const { modeInfo } = this.props.screenProps
    const { ITEM_HEIGHT } = this
    const { navigation } = this.props
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

  ITEM_HEIGHT = 78 + 7


  renderVIP = ({ item: rowData, index}) => {
    const { modeInfo } = this.props.screenProps
    const { ITEM_HEIGHT } = this
    const { navigation } = this.props
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

          }} style={{
            flex: 1
          }}/>
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
          style={{
            flex: 1
          }}/>
      </View>
    )
  }

  renderShow = ({ item: rowData, index}) => {
    const { modeInfo } = this.props.screenProps
    const { ITEM_HEIGHT } = this
    const { navigation } = this.props
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
          }} style={{
            flex: 1
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
          }} style={{
            flex: 1
          }}/>
      </View>
    )
  }

  renderBG = ({ item: rowData, index}) => {
    const { modeInfo } = this.props.screenProps
    const { ITEM_HEIGHT } = this
    const { navigation } = this.props

    const items = rowData.items.map((rowData, index) => <PhotoItem key={index} {...{
      modeInfo,
      navigation,
      rowData,
      width: 80,
      ITEM_HEIGHT: 90,
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
    }).then(text => {
      this.fetch()
      // console.log(text)
    }).catch(err => console.log(err))
  }

  render() {
    const { modeInfo } = this.props.screenProps
    const { data } = this.state;

    let keys = Object.keys(data);

    const sections = data.sections ? data.sections.map((item, index) => ({
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
        }
      })(),
      renderItem: [
        this.renderBG,
        this.renderShow,
        this.renderVIP
      ][index]
    })) : []
    if (!this.state.data.isVIP) {
      sections.length = 1
    }

    let NUM_SECTIONS = sections.length

    // console.log(sections)

    return (
      <View
        style={{ flex: 1, backgroundColor: modeInfo.backgroundColor }}
        onStartShouldSetResponder={() => false}
        onMoveShouldSetResponder={() => false}
      >
        <Ionicons.ToolbarAndroid
          navIconName="md-arrow-back"
          overflowIconName="md-more"
          iconColor={modeInfo.isNightMode ? '#000' : '#fff'}
          title={'个性设定'}
          style={{ backgroundColor: modeInfo.standardColor, height: 56, elevation: 4 }}
          titleColor={modeInfo.isNightMode ? '#000' : '#fff'}
          actions={toolbarActions}
          onIconClicked={this.onNavClicked}
          onActionSelected={this.onActionSelected}
        />
        <AnimatedSectionList
          enableVirtualization={false}
          ref={flatlist => this.flatlist = flatlist}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isLoading}
              onRefresh={this._onRefresh}
              colors={[modeInfo.accentColor]}
              progressBackgroundColor={modeInfo.backgroundColor}
              ref={ref => this.refreshControl = ref}
            />
          }
          disableVirtualization={true}
          keyExtractor={(item, index) => `${item.id || item.href}${index}`}
          renderSectionHeader={renderSectionHeader}
          stickySectionHeadersEnabled
          sections={sections}
          style={styles.list}
        />
      </View>
    )
  }

}

const styles = StyleSheet.create({
  avatar: {
    width: 50,
    height: 50,
  }
});
