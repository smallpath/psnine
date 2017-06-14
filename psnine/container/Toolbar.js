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

let communityActions = [
  { title: '新建', iconName: 'md-create', value: '', show: 'always' },
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
  { title: '新建', iconName: 'md-create', value: '', show: 'always' },
  searchAction,
];

let gameActions = [
  searchAction,
];

let rankActions = [
  { title: '新建', iconName: 'md-create', value: '', show: 'always' },
  searchAction,
];

let battleActions = [
  { title: '新建', iconName: 'md-create', value: '', show: 'always' },
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
  { title: '新建', iconName: 'md-create', value: '', show: 'always' },
  searchAction
]

let toolbarActions = [communityActions, qaActions, geneActions, gameActions, battleActions, rankActions, circleActions, storeActions, tradeActions]

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
          if (prevRoute.index !== nextRoute.index && action.type === 'Navigation/NAVIGATE' && !['DrawerOpen', 'DrawerClose'].includes(nextRoute.routes[nextRoute.index].routeName)) {
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
            /*setTimeout(() => {*/
              /*console.log('navigate', nextRoute.index)*/
              this.props.dispatch(changeSegmentIndex(nextRoute.index))
            /*}, 100)*/
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


  componentWillReceiveProps(nextProps) {
    this.props.app = nextProps.app;
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
    if (segmentedIndex === 0) {
      if (index !== 0 && index !== 1) {
        let type = toolbarActions[segmentedIndex][index].value;
        dispatch(changeCommunityType(type));
      } else {
        index === 1 && this._onSearchClicked()
        index === 0 && this.props.navigation.navigate('NewTopic', {})
      }
    } else if (segmentedIndex === 1) {
      index === 0 && this.props.navigation.navigate('NewQa', {})
    } else if (segmentedIndex === 2) {
      if (index !== 0) {
        let type = toolbarActions[segmentedIndex][index].value;
        dispatch(changeGeneType(type));
      } else {
        this._onSearchClicked()
      }
    } else if (segmentedIndex === 6) {  
      if (index !== 0) {
        let type = toolbarActions[segmentedIndex][index].value;
        dispatch(changeCircleType(type));
      } else {
        this._onSearchClicked()
      }
    } else if (segmentedIndex === 4) {
      this.props.navigation.navigate('NewBattle', {})
    } else if (segmentedIndex === 8) {
      index === 0 && this.props.navigation.navigate('NewTrade', {})
      index === 1 && this._onSearchClicked()
    } else {
      this._onSearchClicked()
    }
  }

  setMarginTop = (value, isFlatten, isGetMarginTop) => {
    // console.log(value, this.state.marginTop._offset)
    if (typeof isGetMarginTop === 'boolean' && isGetMarginTop) {
      return releasedMarginTop
    }
    if (isFlatten) {
      this.state.marginTop.flattenOffset();
      releasedMarginTop = this.state.marginTop._value;
      return;
    }
    this.state.marginTop.setValue(value)
  }

  parallelFadeOut = (toValue) => {
    let spring = Animated.spring;
    let timing = Animated.timing;
    Animated.parallel(['opacity', 'rotation', 'scale'].map(property => {
      if (property == 'rotation' || property == 'scale') {
        return spring(this.state[property], {
          toValue: toValue,
          easing: Easing.elastic(2),
        });
      } else if (property == 'opacity') {
        return timing(this.state[property], {
          toValue: toValue,
          delay: 200,
          duration: 0,
        });
      }
    })).start();
  }

  parallelFadeIn = (toValue) => {
    let spring = Animated.spring;
    let timing = Animated.timing;
    Animated.parallel(['opacity', 'rotation', 'scale'].map(property => {
      if (property == 'rotation' || property == 'scale') {
        return spring(this.state[property], {
          toValue: toValue,
          easing: Easing.elastic(2),
        });
      } else if (property == 'opacity') {
        return timing(this.state[property], {
          toValue: toValue,
          duration: 0,
        });
      }
    })).start();
  }

  switchTo = (fromIndex, toIndex) => {
    if (indexWithFloatButton.includes(fromIndex) && indexWithoutFloatButton.includes(toIndex)) {

      this.parallelFadeOut(0);

    } else if (indexWithoutFloatButton.includes(fromIndex) && indexWithFloatButton.indexOf(toIndex)) {

      this.parallelFadeIn(1);

    } else if (indexWithoutFloatButton.includes(fromIndex) && indexWithoutFloatButton.indexOf(toIndex)) {

    } else if (indexWithFloatButton.includes(fromIndex) && indexWithFloatButton.indexOf(toIndex)) {

      let value = this.state.rotation._value;
      if (fromIndex < toIndex)
        targetValue = value - 1 / 4;
      else
        targetValue = value + 1 / 4;
      Animated.timing(this.state.rotation, {
        toValue: targetValue,
        easing: Easing.elastic(2),
      }).start();

    }

  }

  scrollTo = (fromIndex, toIndex, value) => {
    if (isMounted == false) {
      isMounted = true;
      return;
    }

    if (indexWithFloatButton.includes(fromIndex) && indexWithoutFloatButton.includes(toIndex)) {

      if (fromIndex < toIndex) {

        this.state.opacity.setValue(1 - value);
        this.state.rotation.setValue(1 - value);
        this.state.scale.setValue(1 - value);
      } else {

        this.state.opacity.setValue(value);
        this.state.rotation.setValue(1 - value);
        this.state.scale.setValue(value);
      }

    } else if (indexWithoutFloatButton.includes(fromIndex) && indexWithFloatButton.includes(toIndex)) {

      if (fromIndex < toIndex) {

        this.state.opacity.setValue(value);
        this.state.rotation.setValue(1 - value);
        this.state.scale.setValue(value);

      } else {

        this.state.opacity.setValue(1 - value);
        this.state.rotation.setValue(1 - value);
        this.state.scale.setValue(1 - value);

      }

    } else if (indexWithoutFloatButton.includes(fromIndex) && indexWithoutFloatButton.includes(toIndex)) {

    } else if (indexWithFloatButton.includes(fromIndex) && indexWithFloatButton.includes(toIndex)) {
      this.state.rotation.setValue((1 - value) / 4);
    }

  }

  _animateToolbar = (value, cb) => {
    const ratationPreValue = this.state.rotation._value

    const rotationValue = value === 0 ? ratationPreValue - 3 / 8 : ratationPreValue + 3 / 8
    const scaleAnimation = Animated.timing(this.state.rotation, { toValue: rotationValue, ...config })
    const moveAnimation = Animated.timing(this.state.openVal, { toValue: value, ...config })
    const target = [
      moveAnimation
    ]
    if (value !== 0 || value !== 1) target.unshift(scaleAnimation)
    const type = value === 1 ? 'sequence' : 'parallel'
    Animated[type](target).start(() => typeof cb === 'function' && cb())
  }

  _pressToolbarNew = index => {
    const { navigation } = this.props;
    const { segmentedIndex } = this.props.app;

    switch (segmentedIndex) {
      case 0:
        this.pressNew(() => {
          this.setState({
            modalVisible: true
          })
        });
        break;
      case 1:
        break;
      case 2:
        break;
      case 3:
        this.pressNew(() => {
          this.setState({
            modalVisible: true
          })
        });
        break;
      case 4:
        this.pressNew(() => {
          this.setState({
            modalVisible: true
          })
        });
        break;
    }
  }

  pressNew = (cb) => {

    const { segmentedIndex } = this.props.app;

    if (indexWithoutFloatButton.includes(segmentedIndex)) {
      return;
    }

    // TODO: forbid press the toolbar while new topic is showing
    // const { navigator: _navigator } = this.props;

    // let routes = _navigator.getCurrentRoutes();

    // let shouldForbidPressNew = routes.some(value => {
    //   return typeof value.shouldForbidPressNew != 'undefined' && value.shouldForbidPressNew == true;
    // });

    // if (shouldForbidPressNew == true) {
    //   return;
    // }

    if (this.state.openVal._value === 0) {
      this.removeListener = BackHandler.addEventListener('hardwareBackPress', () => {
        let value = this.state.innerMarginTop._value;
        if (Math.abs(value) >= 50) {
          Animated.timing(this.state.innerMarginTop, { toValue: 0, ...config }).start();
        } else {
          this.removeListener && this.removeListener.remove();
          this._animateToolbar(0)
        }
        return true;
      });
      this._animateToolbar(1, cb)
    } else {
      this.removeListener && this.removeListener.remove();
      this._animateToolbar(0, cb)
    }
  }

  closeMask = () => {
    this.removeListener && this.removeListener.remove();
    this._animateToolbar(0)
  }

  renderModal = () => {
    if (this.state.modalVisible === false) return
    const { app: appReducer, switchModeOnRoot, modeInfo } = this.props;
    const { segmentedIndex } = this.props.app;
    const { openVal } = this.state
    const tipHeight = toolbarHeight * 0.8
    let config = { tension: 30, friction: 7 };
    const onClose = () => {
      this.setState({
        modalVisible: false
      })
    }
    const onRequestClose = () => {
      let value = this.state.topicMarginTop._value;
      if (Math.abs(value) >= 50) {
        Animated.spring(this.state.topicMarginTop, { toValue: 0, ...config }).start();
        return true;
      } else {
        Keyboard.dismiss()
        Animated.spring(this.state.modalOpenVal, { toValue: 0, ...config }).start(({ finished }) => {
          this.setState({
            modalVisible: false
          }, () => {
            this.state.modalOpenVal.setValue(1)
          })
        });
      }
    }
    let CIRCLE_SIZE = 56;
    const topicPanResponder = PanResponder.create({

      onStartShouldSetPanResponderCapture: (e, gesture) => {
        return e.nativeEvent.pageX <= 56 ? false : true;
      },
      onPanResponderGrant: (e, gesture) => {
        const target = gesture.y0 <= 56 ? 0 : ACTUAL_SCREEN_HEIGHT - 56
        this.state.topicMarginTop.setOffset(target);
      },
      onPanResponderMove: Animated.event([
        null,
        {
          dy: this.state.topicMarginTop
        }
      ]),

      onPanResponderRelease: (e, gesture) => {

      },
      onPanResponderTerminationRequest: (evt, gesture) => {
        return false;
      },
      onPanResponderTerminate: (evt, gesture) => {

      },
      onShouldBlockNativeResponder: (evt, gesture) => {
        return true;
      },
      onPanResponderReject: (evt, gesture) => {
        return false;
      },
      onPanResponderEnd: (evt, gesture) => {
        let dy = gesture.dy;
        let vy = gesture.vy;

        this.state.topicMarginTop.flattenOffset();

        let duration = 50;

        if (vy < 0) {

          if (Math.abs(dy) <= CIRCLE_SIZE) {

            Animated.spring(this.state.topicMarginTop, {
              toValue: ACTUAL_SCREEN_HEIGHT - CIRCLE_SIZE,
              duration,
              easing: Easing.linear,
            }).start();

          } else {

            Animated.spring(this.state.topicMarginTop, {
              toValue: 0,
              duration,
              easing: Easing.linear,
            }).start();

          }

        } else {

          if (Math.abs(dy) <= CIRCLE_SIZE) {

            Animated.spring(this.state.topicMarginTop, {
              toValue: 0,
              duration,
              easing: Easing.linear,
            }).start();

          } else {

            Animated.spring(this.state.topicMarginTop, {
              toValue: ACTUAL_SCREEN_HEIGHT - CIRCLE_SIZE,
              duration,
              easing: Easing.linear,
            }).start();
          }

        }

      },

    });
    const componentDidMountCallback = () => {
      let config = { tension: 30, friction: 7 };
      this.state.modalOpenVal.setValue(0)
      this.state.topicMarginTop.setValue(0)
      Animated.spring(this.state.modalOpenVal, { toValue: 1, ...config }).start();
    }
    return (
      <Modal
        animationType={'fade'}
        transparent={true}
        visible={true}
        onRequestClose={onRequestClose}
      >
        <NewTopic
          openVal={this.state.modalOpenVal}
          innerMarginTop={this.state.topicMarginTop}
          componentDidMountCallback={componentDidMountCallback}
          topicPanResponder={topicPanResponder}
          onRequestClose={onRequestClose}
          modeInfo={modeInfo} />
      </Modal>
    )
  }

  render() {
    const { app: appReducer, switchModeOnRoot, modeInfo } = this.props;
    const { segmentedIndex } = this.props.app;
    const { openVal } = this.state
    const tipHeight = toolbarHeight * 0.8

    const toolbarList = []
    const iconNameArr = ["ios-add", "ios-exit-outline"]
    for (let i = 0; i < iconNameArr.length; i++) {
      toolbarList.push(
        this.renderToolbarItem({
          iconName: iconNameArr[i],
          openVal: openVal,
          tipHeight: tipHeight
        }, i, iconNameArr.length)
      )
    }
    // console.log(appReducer.segmentedIndex, toolbarActions[appReducer.segmentedIndex].length)
    return (
      <Animated.View
        style={[styles.container, {
          marginTop: this.state.marginTop,
          backgroundColor: modeInfo.backgroundColor
        }]}
      >
        {this.renderModal()}
        <Icon.ToolbarAndroid
          navIconName="md-menu"
          title={title}
          style={[styles.toolbar, { backgroundColor: modeInfo.standardColor, elevation: this.state.tabMode === 'tab' ? 0 : 4 }]}
          titleColor={modeInfo.isNightMode ? '#000' : '#fff'}
          overflowIconName="md-more"
          iconColor={modeInfo.isNightMode ? '#000' : '#fff'}
          actions={toolbarActions[appReducer.segmentedIndex]}
          onActionSelected={this.onActionSelected}
          onIconClicked={this.props._callDrawer()}
        />
        {this.state.tabMode === 'tab' ? this._renderTabView() : this._renderDrawerView()}
        {/*<TouchableWithoutFeedback onPress={this.closeMask}>
          <Animated.View
            ref={mask => this.mask = mask}
            collapsable={false}
            style={{
              opacity: openVal.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1]
              }),
              width: openVal.interpolate({ inputRange: [0, 1], outputRange: [0, SCREEN_WIDTH] }),
              height: openVal.interpolate({ inputRange: [0, 1], outputRange: [0, SCREEN_HEIGHT] }),
              position: 'absolute',
              zIndex: 1
            }} />
        </TouchableWithoutFeedback>*/}
        {/*{toolbarList}*/}
        {/*<Animated.View
          ref={float => this.float = float}
          collapsable={false}
          style={{
            width: 56,
            height: 56,
            borderRadius: 30,
            backgroundColor: accentColor,
            position: 'absolute',
            bottom: this.props.tipBarMarginBottom.interpolate({
              inputRange: [0, 1],
              outputRange: [16, 16 + tipHeight]
            }),
            right: 16,
            elevation: 6,
            zIndex: 1,
            opacity: this.state.opacity,
            transform: [{
              scale: this.state.scale,
            }, {
              rotateZ: this.state.rotation.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg']
              }),
            }]
          }}>
          <TouchableNativeFeedback
            onPress={this.pressNew}
            background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
            onPressIn={() => {
              this.float.setNativeProps({
                style: {
                  elevation: 12,
                }
              });
            }}
            onPressOut={() => {
              this.float.setNativeProps({
                style: {
                  elevation: 6,
                }
              });
            }}
            style={{
              width: 56,
              height: 56,
              borderRadius: 30,
              flex: 1,
              zIndex: 1,
              backgroundColor: accentColor,
            }}>
            <View style={{ borderRadius: 30, width: 56, height: 56, flex: -1, justifyContent: 'center', alignItems: 'center', }}>
              <Icon name="ios-add" size={40} color='#fff' />
            </View>
          </TouchableNativeFeedback>
        </Animated.View>*/}
      </Animated.View>
    )
  }


  renderToolbarItem = (props, index, maxLength) => (
    <Animated.View
      ref={float => this[`float${index}`] = float}
      collapsable={false}
      key={index}
      style={{
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: accentColor,
        position: 'absolute',
        bottom: Animated.add(
          props.openVal.interpolate({ inputRange: [0, 1], outputRange: [24, 56 + 10 + 16 * 2 + index * 50] }),
          this.props.tipBarMarginBottom.interpolate({
            inputRange: [0, 1],
            outputRange: [0, props.tipHeight]
          })
        ),
        right: 24,
        elevation: props.openVal.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, 0, 1]
        }),
        zIndex: 1,
        opacity: Animated.multiply(props.openVal.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [0, 1, 1]
        }), this.state.opacity)
      }}>

      <TouchableNativeFeedback
        onPress={() => this._pressToolbarNew(maxLength - index - 1)}
        background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
        onPressIn={() => {
          this[`float${index}`].setNativeProps({
            style: {
              elevation: 12,
            }
          });
        }}
        onPressOut={() => {
          this[`float${index}`].setNativeProps({
            style: {
              elevation: 6,
            }
          });
        }}
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          flex: 1,
          zIndex: 1,
          backgroundColor: accentColor,
        }}>
        <View style={{ borderRadius: 20, width: 40, height: 40, justifyContent: 'center', alignItems: 'center', }}>
          <Icon name={props.iconName} size={25} color='#fff' />
        </View>
      </TouchableNativeFeedback>
    </Animated.View>
  )
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

