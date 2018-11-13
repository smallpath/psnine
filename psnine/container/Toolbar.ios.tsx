import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Animated,
  TouchableWithoutFeedback,
  StatusBar,
  ViewPagerAndroid,
  Platform
} from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'

import { connect } from 'react-redux'

import { changeSegmentIndex, changeCommunityType, changeGeneType } from '../redux/action/app'
import { getRecommend } from '../redux/action/recommend'

import { standardColor } from '../constant/colorConfig'

import Tab, { routes } from './Tab'
// import RightDrawer from './RightDrawer'

let title = 'PSNINE'

const searchAction = { title: '搜索', iconName: 'md-search', value: '', show: 'always' }

let recommendActions = [
  searchAction
]

let communityActions = [
  { title: '新建', iconName: 'md-create', value: '', show: 'always', iconSize: 22 },
  searchAction,
  { title: '全部', value: '', show: 'never' },
  { title: '新闻', value: 'news', show: 'never' },
  { title: '攻略', value: 'guide', show: 'never' },
  { title: '测评', value: 'review', show: 'never' },
  { title: '心得', value: 'exp', show: 'never' },
  { title: 'Plus', value: 'plus', show: 'never' },
  { title: '开箱', value: 'openbox', show: 'never' },
  { title: '游列', value: 'gamelist', show: 'never' },
  { title: '活动', value: 'event', show: 'never' }
]

let qaActions = [
  { title: '新建', iconName: 'md-create', value: '', show: 'always', iconSize: 22 },
  searchAction
]

let gameActions = [
  searchAction
]

let rankActions = [
  searchAction
]

let battleActions = [
  { title: '新建', iconName: 'md-create', value: '', show: 'always', iconSize: 22 }
]

let geneActions = [
  { title: '新建', iconName: 'md-create', value: '', show: 'always', iconSize: 22 },
  searchAction,
  { title: '综合排序', value: 'obdate', show: 'never' },
  { title: '最新', value: 'date', show: 'never' }
]

let storeActions = [
  searchAction
]

let tradeActions = [
  { title: '新建', iconName: 'md-create', value: '', show: 'always', iconSize: 22 },
  searchAction
]

let discountActions = [
  searchAction
]

let toolbarActions = [
  recommendActions,
  communityActions,
  qaActions,
  geneActions,
  gameActions,
  discountActions,
  battleActions,
  rankActions,
  /*circleActions,*/
  storeActions,
  tradeActions
]

let toolbarHeight = Platform.OS === 'ios' ? 64 : 56

class Toolbar extends Component<any, any> {

  constructor(props) {
    super(props)

    this.state = {
      search: '',
      rotation: new Animated.Value(1),
      scale: new Animated.Value(1),
      opacity: new Animated.Value(1),
      marginTop: new Animated.Value(0),
      openVal: new Animated.Value(0),
      innerMarginTop: new Animated.Value(0),
      modalVisible: false,
      modalOpenVal: new Animated.Value(0),
      topicMarginTop: new Animated.Value(0),
      tabMode: this.props.modeInfo.settingInfo.tabMode,
      _scrollHeight: this.props.modeInfo.height - (StatusBar.currentHeight || 0) - 38 + 1
      // _scrollHeight:
    }
  }

  searchMapper = Object.keys(routes).reduce((prev, curr) => (prev[curr] = '', prev), {})
  afterEachHooks = []

  componentWillMount() {
    this.props.dispatch(getRecommend())
  }

  componentWillReceiveProps(nextProps) {
    if (this.state.tabMode !== nextProps.modeInfo.settingInfo.tabMode) {
      this.setState({
        tabMode: nextProps.modeInfo.settingInfo.tabMode
      })
    } else if (this.props.modeInfo.width !== nextProps.modeInfo.width) {
      this.setState({
        _scrollHeight: nextProps.modeInfo.height - (StatusBar.currentHeight || 0) - 38 + 1
      })
    }
  }

  _onSearch = (text) => {
    this.setState({
      search: text
    })
    const currentIndex = this.props.app.segmentedIndex
    const callback = this.afterEachHooks[currentIndex]
    typeof callback === 'function' && callback(text)
    const currentRouteName = Object.keys(routes)[currentIndex]
    this.searchMapper[currentRouteName] = text
  }

  _onSearchClicked = () => {
    this.props.navigation.navigate('Search', {
      shouldSeeBackground: true,
      content: this.state.search,
      callback: this._onSearch
    })
  }

  onActionSelected = (index) => {
    const { segmentedIndex, communityType } = this.props.app
    // console.log(segmentedIndex)
    const { dispatch } = this.props
    if (segmentedIndex === 1) {
      if (index !== 0 && index !== 1) {
        let type = toolbarActions[segmentedIndex][index].value
        dispatch(changeCommunityType(type))
      } else {
        index === 1 && this._onSearchClicked()
        const obj: any = {}
        if (communityType) {
          obj.URL = `https://psnine.com/node/${communityType}/add`
        }
        index === 0 && this.props.navigation.navigate('NewTopic', obj)
      }
    } else if (segmentedIndex === 2) {
      index === 0 && this.props.navigation.navigate('NewQa', {})
      index === 1 && this._onSearchClicked()
    } else if (segmentedIndex === 3) {
      if (index !== 0 && index !== 1) {
        let type = toolbarActions[segmentedIndex][index].value
        dispatch(changeGeneType(type))
      } else {
        index === 1 && this._onSearchClicked()
        index === 0 && this.props.navigation.navigate('NewGene', {})
      }
    } else if (segmentedIndex === 6) {
      this.props.navigation.navigate('NewBattle', {})
    } else if (segmentedIndex === 9) {
      index === 0 && this.props.navigation.navigate('NewTrade', {})
      index === 1 && this._onSearchClicked()
    } else {
      this._onSearchClicked()
    }
  }

  _renderDrawerView = () => {
    return (
      <Tab
        onNavigationStateChange={(prevRoute, nextRoute, action) => {
          if (prevRoute.index !== nextRoute.index && action.type === 'Navigation/NAVIGATE') {
            /*setTimeout(() => {*/
              this.props.dispatch(changeSegmentIndex(nextRoute.index))
            /*}, 100)*/
          }
        }} screenProps={{
        communityType: this.props.app.communityType,
        geneType: this.props.app.geneType,
        circleType: this.props.app.circleType,
        navigation: this.props.navigation,
        toolbarDispatch: this.props.dispatch,
        segmentedIndex: this.props.app.segmentedIndex,
        modeInfo: this.props.modeInfo,
        setMarginTop: null,
        modalVisible: this.state.modalVisible,
        searchTitle: this.state.search,
        registerAfterEach: componentDidFocus => {
          if (componentDidFocus) {
            const { index, handler } = componentDidFocus
            this.afterEachHooks = [...this.afterEachHooks]
            this.afterEachHooks[index] = handler
          }
        }
      }}/>
    )
  }

  render() {
    const { app: appReducer, modeInfo, drawerWidth, position } = this.props
    // alert(appReducer.segmentedIndex)
    return (
      <View style={{ flex: 1 }}>
        {/* <global.ToolbarIOS modeInfo={modeInfo}
          actions={toolbarActions[appReducer.segmentedIndex]}
          onActionSelected={this.onActionSelected}
          onIconClicked={this.props._callDrawer()}
        /> */}
        <View style={styles.toolbar}>
          <Icon.ToolbarAndroid
            navIconName='md-menu'
            style={[styles.toolbar, { backgroundColor: modeInfo.standardColor, elevation: 0 }]}
            overflowIconName='md-more'
            iconColor={modeInfo.isNightMode ? '#000' : '#fff'}
            actions={toolbarActions[appReducer.segmentedIndex]}
            key={appReducer.segmentedIndex}
            onActionSelected={this.onActionSelected}
            onIconClicked={this.props._callDrawer()}
          >
            <TouchableWithoutFeedback>
              <View style={{ height: 56, flex: 1, flexDirection: 'column', justifyContent: 'center' }}>
                <Text style={{ fontSize: 20, fontWeight: '500', color: modeInfo.isNightMode ? '#000' : '#fff' }} onPress={() => {
                  const index = this._currentViewPagerPageIndex
                  const callback = this.afterEachHooks[index]
                  {/*log(callback, this.state.afterEachHooks, index)*/ }
                  typeof callback === 'function' && callback()
                }}>
                  {title}
                </Text>
                {this.state.search && <Text
                  onPress={() => {
                    this._onSearch('')
                  }}
                  style={{ fontSize: 15, color: modeInfo.isNightMode ? '#000' : '#fff' }}>
                  {`当前搜索: ${this.state.search}`}
                </Text> || undefined}
              </View>
            </TouchableWithoutFeedback>
          </Icon.ToolbarAndroid>
        </View>
       { this._renderDrawerView() }
      </View>
    )
  }
}

function mapStateToProps(state) {
  return {
    app: state.app
  }
}

export default connect(
  mapStateToProps
)(Toolbar)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#F5FCFF'
  },
  toolbar: {
    backgroundColor: standardColor,
    height: toolbarHeight,
    elevation: 0
  },
  segmentedView: {
    backgroundColor: '#F5FCFF'
  },
  selectedTitle: {},
  appbar: {
    backgroundColor: '#2278F6'
  },

  avatar: {
    width: 50,
    height: 50
  },
  navbar: {
    height: 56
    // alignItems: "center",
    // justifyContent: "center",
    // backgroundColor: "transparent",
    // position: 'relative'
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

  actionBar: {
    position: 'absolute',
    top: 0,
    right: 0,
    height: 56,
    flexDirection: 'column',
    flexWrap: 'nowrap',
    justifyContent: 'center',
    paddingLeft: 10
  },

  actionBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },

  menuBtn: {
    width: 34,
    paddingRight: 10
  },

  menuBtnIcon: {
    width: 16,
    height: 16,
    tintColor: 'rgba(255, 255, 255, .8)'
  },

  menu: {
    width: 150,
    backgroundColor: 'rgba(0, 0, 0, 0.8)'
  },

  tabBar: {
    height: 38,
    backgroundColor: '#4889F1'
  },

  scrollView: {
    backgroundColor: '#f2f2f2'
  },

  viewPager: {
    flex: 1,
    backgroundColor: 'transparent'
  },

  pageItem: {
    borderRadius: 2,
    height: 200,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 5,
    marginBottom: 5,
    justifyContent: 'center',
    alignItems: 'center'
  },

  pageItemContent: {
    fontSize: 30,
    color: '#FFF'
  }
})
