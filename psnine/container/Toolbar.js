import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  Image,
  DrawerLayoutAndroid,
  ToolbarAndroid,
  ToastAndroid,
  BackHandler,
  TouchableOpacity,
  Dimensions,
  TouchableNativeFeedback,
  RefreshControl,
  InteractionManager,
  Animated,
  Easing,
  PanResponder,
  TouchableHighlight,
  TouchableWithoutFeedback,
  StatusBar,
  Modal,
  Keyboard,
  AsyncStorage
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import MyDialog from '../components/Dialog'
import nativeImageSource from 'nativeImageSource';

import { connect } from 'react-redux';

import NewTopic from './new/NewTopic';

import { changeSegmentIndex, changeCommunityType, changeGeneType, changeCircleType } from '../actions/app';
import { getRecommend } from '../actions/recommend';

import { standardColor, accentColor } from '../constants/colorConfig';

import RightDrawer from './RightDrawer'
import TabContainer from './Tab'

let screen = Dimensions.get('window');

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = screen;

const ACTUAL_SCREEN_HEIGHT = SCREEN_HEIGHT - StatusBar.currentHeight + 1;

let title = "PSNINE";
let isMounted = false;
let indexWithFloatButton = [0, 1, 3, 4];
let indexWithoutFloatButton = [2];

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
];

let qaActions = [
  { title: '新建', iconName: 'md-create', value: '', show: 'always', iconSize: 22 },
  searchAction,
];

let gameActions = [
  searchAction,
];

let rankActions = [
  { title: '新建', iconName: 'md-create', value: '', show: 'always', iconSize: 22 },
  searchAction,
];

let battleActions = [
  { title: '新建', iconName: 'md-create', value: '', show: 'always', iconSize: 22 },
];

let geneActions = [
  searchAction,
  { title: '全部', value: 'all', show: 'never' },
  { title: '图文类', value: 'photo', show: 'never' },
  { title: '音乐类', value: 'music', show: 'never' },
  { title: '影视类', value: 'movie', show: 'never' },
  { title: '视频类', value: 'video', show: 'never' },
];

let circleActions = [
  searchAction,
  { title: '全部', value: 'all', show: 'never' },
  { title: '图文类', value: 'photo', show: 'never' },
  { title: '音乐类', value: 'music', show: 'never' },
  { title: '影视类', value: 'movie', show: 'never' },
  { title: '视频类', value: 'video', show: 'never' },
]

let storeActions = [
  searchAction
]

let tradeActions = [
  { title: '新建', iconName: 'md-create', value: '', show: 'always', iconSize: 22 },
  searchAction
]

let toolbarActions = [recommendActions, communityActions, qaActions, geneActions, gameActions, battleActions, rankActions, circleActions, storeActions, tradeActions]

let titlesArr = ["社区", "问答", "游戏", "约战", "机因"];

const ds = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2,
});

let clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};


let toolbarHeight = 56;
let releasedMarginTop = 0;
let config = { tension: 30, friction: 7, ease: Easing.in(Easing.ease(1, 0, 1, 1)), duration: 200 };
const timeout = 190
const delay = 50


class Toolbar extends Component {

  constructor(props) {
    super(props);

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
      tabMode: this.props.modeInfo.settingInfo.tabMode
    }
  }

  _renderDrawerView = () => {
    return (
      <RightDrawer         
        onNavigationStateChange={(prevRoute, nextRoute, action) => {

        }} screenProps={{
        communityType: this.props.app.communityType,
        geneType: this.props.app.geneType,
        circleType: this.props.app.circleType,
        navigation: this.props.navigation,
        toolbarDispatch: this.props.dispatch,
        segmentedIndex: this.props.app.segmentedIndex,
        modeInfo: this.props.modeInfo,
        setMarginTop: this.setMarginTop,
        modalVisible: this.state.modalVisible,
        searchTitle: this.state.search
      }}/>
    )
  }
  _renderTabView = () => {
    return (
      <TabContainer
        onNavigationStateChange={(prevRoute, nextRoute, action) => {
          if (prevRoute.index !== nextRoute.index && action.type === 'Navigation/NAVIGATE') {
            this.props.dispatch(changeSegmentIndex(nextRoute.index))
          }
        }}
        screenProps={{
          communityType: this.props.app.communityType,
          geneType: this.props.app.geneType,
          circleType: this.props.app.circleType,
          navigation: this.props.navigation,
          toolbarDispatch: this.props.dispatch,
          segmentedIndex: this.props.app.segmentedIndex,
          modeInfo: this.props.modeInfo,
          setMarginTop: this.setMarginTop,
          modalVisible: this.state.modalVisible,
          searchTitle: this.state.search
        }}/>
    )
  }

  componentWillMount = () => {
    this.props.dispatch(getRecommend())
  }


  componentWillReceiveProps(nextProps) {
    this.props.app = nextProps.app;
    if (this.state.tabMode !== nextProps.modeInfo.settingInfo.tabMode) {
      this.setState({
        tabMode: nextProps.modeInfo.settingInfo.tabMode
      })
    }
  }

  _onSearch = (text) => {
    this.setState({
      search: text
    })
  }

  _onSearchClicked = () => {
    this.props.navigation.navigate('Search', {
      shouldSeeBackground: true,
      content: this.state.search,
      callback: this._onSearch
    })
  }

  onActionSelected = (index) => {
    const { segmentedIndex } = this.props.app;
    const { dispatch } = this.props;
    if (segmentedIndex === 1) {
      if (index !== 0 && index !== 1) {
        let type = toolbarActions[segmentedIndex][index].value;
        dispatch(changeCommunityType(type));
      } else {
        index === 1 && this._onSearchClicked()
        index === 0 && this.props.navigation.navigate('NewTopic', {})
      }
    } else if (segmentedIndex === 2) {
      index === 0 && this.props.navigation.navigate('NewQa', {})
      index === 1 && this._onSearchClicked()
    } else if (segmentedIndex === 3) {
      if (index !== 0) {
        let type = toolbarActions[segmentedIndex][index].value;
        dispatch(changeGeneType(type));
      } else {
        this._onSearchClicked()
      }
    } else if (segmentedIndex === 7) {  
      if (index !== 0) {
        let type = toolbarActions[segmentedIndex][index].value;
        dispatch(changeCircleType(type));
      } else {
        this._onSearchClicked()
      }
    } else if (segmentedIndex === 5) {
      this.props.navigation.navigate('NewBattle', {})
    } else if (segmentedIndex === 9) {
      index === 0 && this.props.navigation.navigate('NewTrade', {})
      index === 1 && this._onSearchClicked()
    } else {
      this._onSearchClicked()
    }
  }


  render() {
    const { app: appReducer, switchModeOnRoot, modeInfo } = this.props;
    const { segmentedIndex } = this.props.app;
    const { openVal } = this.state
    const tipHeight = toolbarHeight * 0.8

    // console.log(appReducer.segmentedIndex, toolbarActions[appReducer.segmentedIndex].length)
    return (
      <Animated.View
        style={[styles.container, {
          marginTop: this.state.marginTop,
          backgroundColor: modeInfo.backgroundColor
        }]}
      >
        <Icon.ToolbarAndroid
          navIconName="md-menu"
          title={title}
          style={[styles.toolbar, { backgroundColor: modeInfo.standardColor, elevation: this.state.tabMode === 'tab' ? 0 : 4 }]}
          titleColor={modeInfo.isNightMode ? '#000' : '#fff'}
          subtitle={this.state.search ? `当前搜索: ${this.state.search}` : ''}
          subtitleColor={modeInfo.isNightMode ? '#000' : '#fff'}
          overflowIconName="md-more"
          iconColor={modeInfo.isNightMode ? '#000' : '#fff'}
          actions={toolbarActions[appReducer.segmentedIndex]}
          onActionSelected={this.onActionSelected}
          onIconClicked={this.props._callDrawer()}
        />
        {this.state.tabMode === 'tab' ? this._renderTabView() : this._renderDrawerView()}
      </Animated.View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#F5FCFF',
  },
  toolbar: {
    backgroundColor: standardColor,
    height: toolbarHeight,
    elevation: 4,
  },
  segmentedView: {
    backgroundColor: '#F5FCFF',
  },
  selectedTitle: {
    //backgroundColor: '#00ffff'
    //fontSize: 20
  },
  avatar: {
    width: 50,
    height: 50,
  }
});

function mapStateToProps(state) {
  return {
    app: state.app,
  };
}

export default connect(
  mapStateToProps
)(Toolbar);

