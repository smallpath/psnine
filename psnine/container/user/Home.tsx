import React, { Component } from 'react'
import {
  AppRegistry,
  StyleSheet,
  ToastAndroid,
  Text,
  View,
  Image,
  Dimensions,
  TouchableNativeFeedback,
  InteractionManager,
  ActivityIndicator,
  StatusBar,
  Animated,
  Easing,
  FlatList,
  PanResponder,
  Modal,
  Keyboard,
  ScrollView,
  BackHandler,
  ToolbarAndroid
} from 'react-native'

import { sync, updown, fav, upBase, block } from '../../dao/sync'

import { connect } from 'react-redux'
import Ionicons from 'react-native-vector-icons/Ionicons'
import {
  standardColor,
  nodeColor,
  idColor,
  accentColor,
  levelColor,
  rankColor,
  trophyColor1,
  trophyColor2,
  trophyColor3,
  trophyColor4,
  trophyColor5
} from '../../constant/colorConfig'

import { getHomeAPI } from '../../dao'

import CreateUserTab from './UserTab'

let screen = Dimensions.get('window')
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = screen

let toolbarActions = []
let title = 'TOPIC'
let WEBVIEW_REF = `WEBVIEW_REF`

let toolbarHeight = 56
let releasedMarginTop = 0

let ACTUAL_SCREEN_HEIGHT = SCREEN_HEIGHT - StatusBar.currentHeight + 1

let CIRCLE_SIZE = 56
let config = { tension: 30, friction: 7, ease: Easing.in(Easing.ease(1, 0, 1, 1)), duration: 200 }

const iconMapper = {
  '游戏同步': 'md-sync',
  '关注': 'md-star-half',
  '感谢': 'md-thumbs-up',
  '等级同步': 'md-sync',
  '屏蔽': 'md-sync'
}

const limit = 360 // - toolbarHeight

import {
  ExtraDimensionsAndroid,
  AppBarLayoutAndroid,
  CoordinatorLayoutAndroid,
  CollapsingToolbarLayoutAndroid,
  NestedScrollViewAndroid,
  LayoutParamsAndroid
} from 'mao-rn-android-kit'

import ImageBackground from '../../component/ImageBackground'

export default class Home extends Component {

  constructor(props) {
    super(props)
    this.state = {
      data: false,
      isLoading: true,
      toolbar: [],
      afterEachHooks: [],
      mainContent: false,
      rotation: new Animated.Value(1),
      scale: new Animated.Value(1),
      opacity: new Animated.Value(1),
      openVal: new Animated.Value(0),
      modalVisible: false,
      modalOpenVal: new Animated.Value(0),
      marginTop: new Animated.Value(0),
      onActionSelected: this._onActionSelected,
      icons: false,
      leftIcon: false,
      rightIcon: false,
      middleIcon: false,
      _scrollHeight: this.props.screenProps.modeInfo.height - StatusBar.currentHeight - 56 + 1
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.screenProps.modeInfo.width !== nextProps.screenProps.modeInfo.width) {
      const { params } = this.props.navigation.state
      this.props.navigation.goBack()
      // this.props.navigation.navigate('Home', params)
    }
  }

  componentWillUnmount = () => {
    this.removeListener && this.removeListener.remove()
    if (this.timeout) clearTimeout(this.timeout)
  }

  componentWillMount = () => {
    this.preFetch()
  }

  preFetch = async () => {
    const { params } = this.props.navigation.state
    await this.setState({
      isLoading: true
    })
    const targetColor = this.props.screenProps.modeInfo.isNightMode ? '#000' : '#fff'

    const result = await Promise.all([
      Ionicons.getImageSource('md-arrow-back', 24, targetColor),
      Ionicons.getImageSource('md-sync', 24, targetColor),
      Ionicons.getImageSource('md-more', 24, targetColor)
    ])
    await this.setState({
      leftIcon: result[0],
      middleIcon: result[1],
      rightIcon: result[2]
    })

    InteractionManager.runAfterInteractions(() => {

      const data = getHomeAPI(params.URL).then(data => {

        this.hasGameTable = data.gameTable.length !== 0
        // console.log(profileToolbar)
        this.setState({
          data,
          isLoading: false
        }, () => this._coordinatorLayout.setScrollingViewBehavior(this._scrollView))
      })
    })
  }

  handleImageOnclick = (url) => this.props.navigation.navigate('ImageViewer', {
    images: [
      { url }
    ]
  })

  renderHeader = (rowData) => {
    const { modeInfo } = this.props.screenProps
    const { psnButtonInfo } = this.state.data
    const { marginTop } = this.state
    const { nightModeInfo } = modeInfo
    const color = 'rgba(255,255,255,1)'
    const infoColor = 'rgba(255,255,255,0.8)'
    const { width: SCREEN_WIDTH } = Dimensions.get('window')
    const onPressPoint = () => {
      toast(rowData.point)
    }
    return (
      <ImageBackground
        source={{uri: rowData.backgroundImage}}
        style={{
          height: limit + toolbarHeight + 1,
          width: SCREEN_WIDTH
        }}
        blurRadis={0}
        >
        <LinearGradient
          colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0)', 'rgba(0,0,0,0.3)']}
          locations={[0, 0.2, 0.8, 1]}
          start={{x: 0.5, y: 0}} end={{x: 0.5, y: 1}}>
          <View key={rowData.id} style={{
            backgroundColor: 'transparent',
            height: 360,
            marginTop: 56
          }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', flex: -1, padding: 5, marginTop: -10  }}>
              <View style={{ justifyContent: 'center', alignItems: 'center', flex: 2, marginTop: 2  }}>
                <Text style={{ flex: -1, color: infoColor, fontSize: 15, textAlign: 'center' }}>{rowData.description}</Text>
                {
                    rowData.icons && rowData.icons.length && <View style={{flexDirection: 'row', marginVertical: 2}}>{rowData.icons.filter((item, index) => index <= 2).map((item, index) => {
                      return (
                        <Image
                          key={index}
                          borderRadius={12}
                          source={{ uri: item}}
                          style={[styles.avatar, { width: 20, height: 20, overlayColor: 'rgba(0,0,0,0.0)', backgroundColor: 'transparent'
                          }]}
                        />
                      )
                    })}</View>
                  }
              </View>
              <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1  }}>
                <Text style={{ flex: -1, color: levelColor, fontSize: 20 }} onPress={onPressPoint}>{rowData.exp.split('经验')[0]}</Text>
                <Text style={{ flex: -1, color: infoColor, fontSize: 12 }} onPress={onPressPoint}>经验{rowData.exp.split('经验')[1]}</Text>
              </View>
              <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1  }}>
                <Text style={{ flex: -1, color: rankColor, fontSize: 20 }}>{rowData.ranking || 'None'}</Text>
                <Text style={{ flex: -1, color: infoColor, fontSize: 12 }}>所在服排名</Text>
              </View>
            </View>

            <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: limit }}>
              <View style={{ justifyContent: 'center', alignItems: 'center', alignSelf: 'center', flex: 3, marginTop: -70 }}>
                <View borderRadius={75} style={{width: 150, height: 150, backgroundColor: 'transparent'}} >
                  <Image
                    borderRadius={75}
                    source={{ uri: rowData.avatar}}
                    style={[styles.avatar, { width: 150, height: 150, overlayColor: 'rgba(0,0,0,0.0)', backgroundColor: 'transparent' }]}
                  />
                </View>
              </View>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', flex: 3, elevation: 4  }}>
            </View>

            <View style={{ flex: 1, padding: 5}}>
              <View borderRadius={20} style={{ marginTop: 10, paddingHorizontal: 10, alignSelf: 'center', alignContent: 'center',  flexDirection: 'row', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)'  }}>
                <Text style={{ height: 30, textAlignVertical: 'center', textAlign: 'center' }}>
                  <Text style={{ flex: 1, color: trophyColor1, marginVertical: 2, textAlign: 'center', fontSize: 15 }}>{rowData.platinum + ' '}</Text>
                  <Text style={{ flex: 1, color: trophyColor2, marginVertical: 2, textAlign: 'center', fontSize: 15 }}>{rowData.gold + ' '}</Text>
                  <Text style={{ flex: 1, color: trophyColor3, marginVertical: 2, textAlign: 'center', fontSize: 15 }}>{rowData.silver + ' '}</Text>
                  <Text style={{ flex: 1, color: trophyColor4, marginVertical: 2, textAlign: 'center', fontSize: 15 }}>{rowData.bronze + ' '}</Text>
                  <Text style={{ flex: 1, color: infoColor, marginVertical: 2, textAlign: 'center', fontSize: 15 }}>{rowData.all + ' '}</Text>
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', flex: 1, padding: 5  }}>
              <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1  }}>
                <Text style={{ flex: 1, color: color, textAlign: 'center', fontSize: 20 }}>{rowData. allGames}</Text>
                <Text style={{ flex: 1, color: infoColor, textAlign: 'center', fontSize: 12 }}>总游戏</Text>
              </View>
              <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1  }}>
                <Text style={{ flex: 1, color: color, textAlign: 'center', fontSize: 20 }}>{rowData.perfectGames}</Text>
                <Text style={{ flex: 1, color: infoColor, textAlign: 'center', fontSize: 12 }}>完美数</Text>
              </View>
              <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1  }}>
                <Text style={{ flex: 1, color: color, textAlign: 'center', fontSize: 20 }}>{rowData.hole}</Text>
                <Text style={{ flex: 1, color: infoColor, textAlign: 'center', fontSize: 12 }}>坑数</Text>
              </View>
              <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1  }}>
                <Text style={{ flex: 1, color: color, textAlign: 'center', fontSize: 20 }}>{(rowData.ratio || '').replace('完成率', '')}</Text>
                <Text style={{ flex: 1, color: infoColor, textAlign: 'center', fontSize: 12 }}>完成率</Text>
              </View>
              <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1  }}>
                <Text style={{ flex: 1, color: color, textAlign: 'center', fontSize: 20 }}>{rowData.followed}</Text>
                <Text style={{ flex: 1, color: infoColor, textAlign: 'center', fontSize: 12 }}>被关注</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </ImageBackground>
    )
  }

  renderTabContainer = (list) => {
    const { modeInfo } = this.props.screenProps
    const { params } = this.props.navigation.state
    const { marginTop } = this.state

    return (
      <CreateUserTab screenProps={{
        modeInfo: modeInfo,
        toolbar: list,
        preFetch: this.preFetch,
        setToolbar: ({ toolbar, toolbarActions, componentDidFocus }) => {
          const obj = {
            toolbar,
            onActionSelected: toolbarActions
          }
          if (componentDidFocus) {
            const { index, handler } = componentDidFocus
            if (!this.state.afterEachHooks[index]) {
              obj.afterEachHooks = [...this.state.afterEachHooks]
              obj.afterEachHooks[index] = handler
            }
          }
          {/*this.setState(obj)*/}
        },
        profileToolbar: this.state.data.psnButtonInfo.reverse().map(item => {
          const result = { title: item.text, iconName: iconMapper[item.text], show: item.text.includes('游戏同步') ? 'always' : 'never' }
          if (!iconMapper[item.text]) delete result.iconName
          if (item.text.includes('冷却') || iconMapper[item.text]) return result
          return undefined
        }).filter(item => item),
        psnid: params.title,
        gameTable: this.state.data.gameTable,
        diaryTable: this.state.data.diaryTable,
        navigation: this.props.navigation
      }} onNavigationStateChange={(prevRoute, nextRoute, action) => {
        if (prevRoute.index !== nextRoute.index && action.type === 'Navigation/NAVIGATE') {

        }
      }}/>
    )
  }

 _onActionSelected = (index) => {
    const { params } = this.props.navigation.state
    const { preFetch } = this
    const { modeInfo } = this.props.screenProps
    const psnid = params.URL.split('/').filter(item => item.trim()).pop()
    // alert(index)
    switch (index) {
      case 4:
        // if (psnid === modeInfo.settingInfo.psnid) return toast('不可以屏蔽自己')
        block({
          type: 'psnid',
          param: psnid
        }).then(res => res.text()).then(text => {
          // console.log(text)
          // ToastAndroid.show('同步成功', ToastAndroid.SHORT);
          if (text) return toast(text)
          toast('屏蔽成功')
          preFetch && preFetch()
        }).catch(err => {
          const msg = `屏蔽失败: ${err.toString()}`
          global.toast(msg)
          // ToastAndroid.show(msg, ToastAndroid.SHORT);
        })
        return
      case 3:
        fav({
          type: 'psnid',
          param: psnid
        }).then(res => res.text()).then(text => {
          // console.log(text)
          // ToastAndroid.show('同步成功', ToastAndroid.SHORT);
          if (text) return toast(text)
          toast('关注成功')
          preFetch && preFetch()
        }).catch(err => {
          const msg = `操作失败: ${err.toString()}`
          global.toast(msg)
          // ToastAndroid.show(msg, ToastAndroid.SHORT);
        })
        return
      case 2:
        updown({
          type: 'psnid',
          param: psnid,
          updown: 'up'
        }).then(res => res.text()).then(text => {
          // ToastAndroid.show('同步成功', ToastAndroid.SHORT);
          if (text) return toast(text)
          toast('感谢成功')
          preFetch && preFetch()
        }).catch(err => {
          const msg = `操作失败: ${err.toString()}`
          global.toast(msg)
          // ToastAndroid.show(msg, ToastAndroid.SHORT);
        })
        return
      case 1:
        ToastAndroid.show('等级同步中..', ToastAndroid.SHORT)
        upBase(psnid).then(res => res.text()).then(text => {
          // console.log(text)
          if (text.includes('玩脱了')) {
            const arr = text.match(/\<title\>(.*?)\<\/title\>/)
            if (arr && arr[1]) {
              const msg = `同步失败: ${arr[1]}`
              // ToastAndroid.show(msg, ToastAndroid.SHORT);
              global.toast(msg)
              return
            }
          }
          // ToastAndroid.show('同步成功', ToastAndroid.SHORT);
          global.toast('同步成功')
          preFetch && preFetch()
        }).catch(err => {
          const msg = `同步失败: ${err.toString()}`
          global.toast(msg)
          // ToastAndroid.show(msg, ToastAndroid.SHORT);
        })
        return
      case 0:
        ToastAndroid.show('游戏同步中..', ToastAndroid.SHORT)
        sync(psnid).then(res => res.text()).then(text => {
          if (text.includes('玩脱了')) {
            const arr = text.match(/\<title\>(.*?)\<\/title\>/)
            if (arr && arr[1]) {
              const msg = `同步失败: ${arr[1]}`
              // ToastAndroid.show(msg, ToastAndroid.SHORT);
              global.toast(msg)
              return
            }
          }
          // ToastAndroid.show('同步成功', ToastAndroid.SHORT);
          global.toast('同步成功')
          preFetch && preFetch()
        }).catch(err => {
          const msg = `同步失败: ${err.toString()}`
          global.toast(msg)
          // ToastAndroid.show(msg, ToastAndroid.SHORT);
        })
        return
    }
  }

  onIconClicked = () => this.props.navigation.goBack()

  toolbar = [
    {'title': '游戏同步', 'iconName': 'md-sync', 'show': 'never'},
    {'title': '等级同步', 'iconName': 'md-sync', 'show': 'never'},
    {'title': '感谢', 'iconName': 'md-thumbs-up', 'show': 'never'},
    {'title': '关注', 'iconName': 'md-star-half', 'show': 'never'},
    {'title': '屏蔽', 'iconName': 'md-sync', 'show': 'never'}
  ]

  render() {
    const { params } = this.props.navigation.state
    console.log('Home.js rendered')
    const { modeInfo } = this.props.screenProps
    const { data: source, marginTop } = this.state
    const data = []
    const renderFuncArr = []
    const shouldPushData = !this.state.isLoading

    this.viewBottomIndex = Math.max(data.length - 1, 0)
    let { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')
    let ACTUAL_SCREEN_HEIGHT = SCREEN_HEIGHT - StatusBar.currentHeight + 1
    const profileToolbar = this.state.data.psnButtonInfo ? this.state.data.psnButtonInfo.reverse().map((item, index) => {
      const result = { title: item.text, iconName: iconMapper[item.text], show: item.text.includes('游戏同步') ? 'always' : 'never' }
      if (!iconMapper[item.text]) delete result.iconName
      if (index === 0) result.icon = this.state.middleIcon
      if (item.text.includes('冷却') || iconMapper[item.text]) return result
      return undefined
    }).filter(item => item) : []
    // console.log(JSON.stringify(profileToolbar))
    return source.playerInfo && this.state.leftIcon && !this.state.isLoading ? (
      <View style={{flex: 1}}>
        <CoordinatorLayoutAndroid
          fitsSystemWindows={false}
          ref={this._setCoordinatorLayout}>

          <AppBarLayoutAndroid
            ref={this._setAppBarLayout}
            style={styles.appbar} >
            <CollapsingToolbarLayoutAndroid
              collapsedTitleColor={modeInfo.backgroundColor}
              contentScrimColor={modeInfo.standardColor}
              expandedTitleColor={modeInfo.titleTextColor}
              statusBarScrimColor={modeInfo.standardColor}
              titleEnable={false}
              layoutParams={{
                scrollFlags: (
                  AppBarLayoutAndroid.SCROLL_FLAG_SCROLL |
                  AppBarLayoutAndroid.SCROLL_FLAG_SNAP |
                  AppBarLayoutAndroid.SCROLL_FLAG_EXIT_UNTIL_COLLAPSED
                )
              }}>
              <View
                style={{
                  flex: 1,
                  backgroundColor: modeInfo.standardColor
                }}
                layoutParams={{
                  collapseParallaxMultiplie: 0.7,
                  collapseMode: CollapsingToolbarLayoutAndroid.CollapseMode.COLLAPSE_MODE_PARALLAX
                }}>
                {source.playerInfo && this.renderHeader(source.playerInfo)}
              </View>
              <ToolbarAndroid
                navIcon={this.state.leftIcon}
                overflowIcon={this.state.rightIcon}
                title={`${params.title}`}
                titleColor={modeInfo.isNightMode ? '#000' : '#fff'}
                actions={this.toolbar}
                layoutParams={{
                  height: 56, // required
                  collapseMode: CollapsingToolbarLayoutAndroid.CollapseMode.COLLAPSE_MODE_PIN // required
                }}
                onIconClicked={this.onIconClicked}
                onActionSelected={this._onActionSelected}
              />
            </CollapsingToolbarLayoutAndroid>
          </AppBarLayoutAndroid>

          <View
            style={[styles.scrollView, { height: this.state._scrollHeight, backgroundColor: modeInfo.backgroundColor }]}
            ref={this._setScrollView}>
            {/*<NestedScrollViewAndroid>
              {this._getItems(30)}
            </NestedScrollViewAndroid>*/}
            {this.renderTabContainer(source.toolbarInfo)}
          </View>
        </CoordinatorLayoutAndroid>
      </View>
    ) : <View style={{ flex: 1, backgroundColor: modeInfo.backgroundColor }}>
      <Ionicons.ToolbarAndroid
        navIconName='md-arrow-back'
        overflowIconName='md-more'
        iconColor={modeInfo.isNightMode ? '#000' : '#fff'}
        title={params.title}
        titleColor={modeInfo.isNightMode ? '#000' : '#fff'}
        style={[styles.toolbar, { backgroundColor: this.state.isLoading ? modeInfo.standardColor : 'transparent' }]}
        actions={[]}
        key={this.state.toolbar.map(item => item.text || '').join('::')}
        onIconClicked={() => this.props.navigation.goBack()}
        onActionSelected={this.onActionSelected}
      />
      <ActivityIndicator
        animating={this.state.isLoading}
        style={{
          flex: 999,
          justifyContent: 'center',
          alignItems: 'center'
        }}
        color={modeInfo.accentColor}
        size={50}
      />
    </View>
  }

  _coordinatorLayout = null
  _appBarLayout = null
  _scrollView = null

  _setCoordinatorLayout = component => {
    this._coordinatorLayout = component
  }

  _setAppBarLayout = component => {
    this._appBarLayout = component
  }

  _setScrollView = component => {
    this._scrollView = component
  }

  componentDidMount() {

  }

  _getItems(count) {
    let items = []

    for (let i = 0; i < count; i++) {
      items.push(
        <View
          key={i}
          style={[
            styles.item,
            { backgroundColor: ITEM_COLORS[i % ITEM_COLORS.length] }
          ]}>
          <Text style={styles.itemContent}>ITEM #{i}</Text>
        </View>
      )
    }

    return items
  }
}

const ITEM_COLORS = ['#E91E63', '#673AB7', '#2196F3', '#00BCD4', '#4CAF50', '#CDDC39']

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
    fontWeight: '300',
    color: idColor // make links coloured pink
  },
  appbar: {
    backgroundColor: '#2278F6',
    height: 360 + 56
  },

  navbar: {
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    position: 'relative'
  },

  backBtn: {
    top: 0,
    left: 0,
    height: 56,
    position: 'absolute'
  },

  caption: {
    color: '#fff',
    fontSize: 20
  },

  heading: {
    height: 38,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4889F1'
  },

  headingText: {
    color: 'rgba(255, 255, 255, .6)'
  },

  scrollView: {
    backgroundColor: '#f2f2f2'
  },

  item: {
    borderRadius: 2,
    height: 200,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
    marginBottom: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },

  itemContent: {
    fontSize: 30,
    color: '#FFF'
  }
})
