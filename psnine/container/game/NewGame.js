import React, { Component } from 'react';
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
  Linking
} from 'react-native';

import { sync } from '../../dao/sync'
import MyDialog from '../../components/Dialog'
import HTMLView from '../../components/HtmlToView';
import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
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
} from '../../constants/colorConfig';

import { getGameNewTopicAPI } from '../../dao';

import CreateNewGameTab from './NewGameTab'

let screen = Dimensions.get('window');
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = screen;

let toolbarActions = [
  {
    title: '官网', show: 'never'
  }
];
let title = "TOPIC";
let WEBVIEW_REF = `WEBVIEW_REF`;

let toolbarHeight = 56;
let releasedMarginTop = 0;

let ACTUAL_SCREEN_HEIGHT = SCREEN_HEIGHT - StatusBar.currentHeight + 1;

let CIRCLE_SIZE = 56;
let config = { tension: 30, friction: 7, ease: Easing.in(Easing.ease(1, 0, 1, 1)), duration: 200 };

const iconMapper = {
  '游戏同步': 'md-sync',
  '关注': 'md-star-half',
  '感谢': 'md-thumbs-up',
  '等级同步': 'md-sync',
  '屏蔽': 'md-sync'
}

const limit = 160 // - toolbarHeight

export default class Home extends Component {

  constructor(props) {
    super(props);
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
      onActionSelected: this._onActionSelected
    }
  }

  onActionSelected = (index) => {
    const { data: source } = this.state
    if (source && source.titleInfo && source.titleInfo.content && source.titleInfo.content.length) {
      const item = source.titleInfo.content.filter(item => item.includes('href')).pop()
      if (item) {
        let match = item.match(/\'(.*?)\'/)
        if (!match) match = item.match(/\"(.*?)\"/)
        if (match && match[1]) Linking.openURL(match[1]).catch(err => toast(err.toString()))
      } else {
        toast('官方网站尚未收录')
      }
    } else {
      toast('官方网站尚未收录')
    }
  }

  componentWillUnmount = () => {
    this.removeListener && this.removeListener.remove()
    if (this.timeout) clearTimeout(this.timeout)
  }


  componentWillMount = () => {
    this.preFetch()
    this._previousTop = 0
    const { openVal, marginTop } = this.state
    this._viewStyles= {
      style: {
        top: this._previousTop
      }
    }
    // this.removeListener = BackHandler.addEventListener('hardwareBackPress', () => {
    //   if (marginTop._value === 0) {
        
    //     return false;
    //   }
    //   this._viewStyles.style.top = 0
    //   this._previousTop = 0
    //   Animated.timing(marginTop, { toValue: 0, ...config, duration: 200 }).start();
    //   return true
    // })
    this.PanResponder = PanResponder.create({

      onStartShouldSetPanResponderCapture: (e, gesture) => {
        const target = e.nativeEvent.pageY - this._previousTop - 40
        // console.log(e.nativeEvent, gesture)
        if (target <= limit) {
          // console.log('===>1', target, limit)
          return true
        } else if (target <= limit + toolbarHeight) {
          // console.log('===>2')
          return false
        } else {
          // console.log('===>3')
          this._viewStyles.style.top = -limit
          this._previousTop = -limit
          this._viewStyles.style.top
          Animated.timing(marginTop, {
            toValue: this._previousTop,
            ...config
          }).start()
          return false
        }
      },
      onMoveShouldSetPanResponderCapture: (e, gesture) => {
        const target = e.nativeEvent.pageY - this._previousTop - 40
        if (target > limit && target <= limit + toolbarHeight) {
          // console.log('===>4', target)
          return Math.abs(gesture.dy) >= 2
        }
        // console.log('===>5')
        return false
      },
      onPanResponderGrant: (e, gesture) => {

      },
      onPanResponderMove: (e, gesture) => {
        this._viewStyles.style.top = this._previousTop + gesture.dy
        if (this._viewStyles.style.top > 0) {
          this._viewStyles.style.top = 0
          // this._previousTop = 0
        } else if (this._viewStyles.style.top < -limit) {
          this._viewStyles.style.top = -limit
          // this._previousTop = -limit
        }
        marginTop.setValue(this._viewStyles.style.top)
      },

      onPanResponderRelease: (e, gesture) => {

      },
      onPanResponderTerminationRequest: (evt, gesture) => {
        return false;
      },
      onPanResponderTerminate: (evt, gesture) => {

      },
      onPanResponderReject: (evt, gesture) => {
        return false;
      },
      onPanResponderEnd: (evt, gesture) => {
        this._previousLeft += gesture.dx;
        // console.log(gesture.dy, this._previousTop, '==>', gesture.dy + this._previousTop)
        this._previousTop += gesture.dy;
        if (this._previousTop > 0) this._previousTop = 0
        if (this._previousTop < -limit) this._previousTop = -limit
      },

    });
  }

  preFetch = () => {
    const { params } = this.props.navigation.state
    this.setState({
      isLoading: true
    })
    InteractionManager.runAfterInteractions(() => {
      const data = getGameNewTopicAPI(params.URL).then(data => {

        this.setState({
          data,
          isLoading: false
        })
      })
    });
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
    return (
      <View style={{
        backgroundColor: 'transparent',
        height: limit,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10
      }}>
        <View style={{ justifyContent:'center', alignItems: 'center', flex: -1, marginLeft: 20, marginBottom: 15  }}>
          <Image
            source={{ uri: rowData.avatar}}
            style={[styles.avatar, { width: 120, height: 120,overlayColor: 'rgba(0,0,0,0.0)',backgroundColor: 'transparent' }]}
          />
        </View>

        <View style={{ justifyContent:'center', alignItems: 'flex-start', 
            marginBottom: 15,
            maxWidth: SCREEN_WIDTH - 120,
            overflow: 'scroll',
            flexWrap: 'nowrap', padding: 10, paddingTop: 0, paddingLeft: 30 }}>
          {rowData.content.map((item, index) => {
            return item.includes('href') ? (
              undefined
              /*<HTMLView
                value={item}
                key={index}
                modeInfo={modeInfo}
                stylesheet={styles}
                imagePaddingOffset={120 + 10}
                shouldForceInline={true}
              />*/
            ) : <Text key={index} style={{ fontSize: index === 0 ? 18 : 12}}>{item}</Text>
          })}

        </View>

      </View>
    )
  }

  // shouldComponentUpdate (nextProps, nextState) {
  //   console.log(Object.keys(nextProps), Object.keys(nextState))
  //   return true
  // }

  renderTabContainer = (list) => {
    const { modeInfo } = this.props.screenProps
    const { params } = this.props.navigation.state
    const { marginTop } = this.state
    // console.log(this.state.data.psnButtonInfo)
    // console.log(this.state.data)
    return (
      <CreateNewGameTab screenProps={{
        modeInfo: modeInfo,
        preFetch: this.preFetch,
        psnid: params.title,
        baseUrl: params.URL.replace(/\?.*?$/, ''),
        list: this.state.data.list,
        gameTable: this.state.data.gameTable,
        navigation: this.props.navigation
      }} onNavigationStateChange={(prevRoute, nextRoute, action) => {
        if (prevRoute.index !== nextRoute.index && action.type === 'Navigation/NAVIGATE') {
          if (marginTop._value !== -limit) {
            this._viewStyles.style.top = -limit
            this._previousTop = -limit
            this._viewStyles.style.top
            Animated.timing(marginTop, {
              toValue: this._previousTop,
              ...config
            }).start()
          }
        }
      }}/> 
    )
  }

  render() {
    const { params } = this.props.navigation.state
    // console.log('GamePage.js rendered');
    const { modeInfo } = this.props.screenProps
    const { data: source, marginTop } = this.state
    const data = []
    const renderFuncArr = []
    const shouldPushData = !this.state.isLoading 

    this.viewBottomIndex = Math.max(data.length - 1, 0)
    let { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')
    let ACTUAL_SCREEN_HEIGHT = SCREEN_HEIGHT - StatusBar.currentHeight + 1;
    const actions = toolbarActions.slice()
    if (source && source.titleInfo && source.titleInfo.content && source.titleInfo.content.length) {
      const has = source.titleInfo.content.some(item => item.includes('href'))
      if (!has) {
        actions.pop()
      }
    }
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
          title={`${source.titleInfo ? source.titleInfo.title : '加载中...' }`}
          titleColor={modeInfo.isNightMode ? '#000' : '#fff'}
          style={[styles.toolbar, { backgroundColor: this.state.isLoading ? modeInfo.standardColor : 'transparent' }]}
          actions={actions}
          key={this.state.toolbar.map(item => item.text || '').join('::')}
          onIconClicked={() => {
            if (marginTop._value === 0) {
              this.props.navigation.goBack()
              return
            }
            this._viewStyles.style.top = 0
            this._previousTop = 0
            Animated.timing(marginTop, { toValue: 0, ...config, duration: 200 }).start();
          }}
          onActionSelected={this.onActionSelected}
        />
        {this.state.isLoading && (
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
        )}
        { (!this.state.isLoading && source.titleInfo && source.titleInfo.backgroundImage) && (
          <Animated.View style={{
            position: 'absolute',
            top: -1, left: 0, right: 0,
            transform: [
              {
                translateY: this.state.marginTop.interpolate({
                  inputRange: [-1000, 0, 1000],
                  outputRange: [-500, 0 , 500]
                })
              }
            ]
          }}>
            <Image
              source={{ uri: source.titleInfo.backgroundImage }}
              resizeMode={'cover'}
              resizeMethod={'resize'}
              blurRadius={10}
              style={{ 
                height: limit + toolbarHeight + 1,
                top: 0, // why??
              }}
            />
          </Animated.View>
        )}
        {
          !this.state.isLoading && (<Animated.View ref={(view) => {
            this.view = view;
          }} 
          
          style={{
            overflow: 'visible',
            flex:0, 
            height: ACTUAL_SCREEN_HEIGHT + limit - toolbarHeight + ACTUAL_SCREEN_HEIGHT    ,         
            transform: [
                {
                  translateY: this.state.marginTop.interpolate({
                    inputRange: [-1000, 0, 1000],
                    outputRange: [-1000, 0 , 1000]
                  })
                }
              ]
            }}
            {...this.PanResponder.panHandlers}
            >
            {
              this.renderHeader(source.titleInfo)
            }
            <View style={{
              position: 'absolute',
              right: 0,
              left: 0
            }}>
              <Animated.View style={{
                backgroundColor: this.state.marginTop.interpolate({
                  inputRange: [-limit, -limit/2, 0, limit],
                  outputRange: [modeInfo.standardColor, 'rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0)', modeInfo.standardColor],
                }),
                flex: 1,
                height: limit
              }}/>
            </View>
            <View style={{flex: 0, height: SCREEN_HEIGHT - toolbarHeight - StatusBar.currentHeight + 1, backgroundColor: modeInfo.backgroundColor}} contentContainerStyle={{
              height: SCREEN_HEIGHT - toolbarHeight  - StatusBar.currentHeight + 1
            }}
              >
              {this.renderTabContainer()}
            </View>
            </Animated.View>
          )
        }
      </View>
    );
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
    height: 56,
    elevation: 4,
  },
  selectedTitle: {
    //backgroundColor: '#00ffff'
    //fontSize: 20
  },
  avatar: {
    width: 50,
    height: 50,
  },
  a: {
    fontWeight: '300',
    color: idColor, // make links coloured pink,
    fontSize: 12
  }
});
