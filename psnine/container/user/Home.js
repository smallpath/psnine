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
  BackHandler
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
} from '../../constants/colorConfig';

import { getHomeAPI } from '../../dao';

import CreateUserTab from './UserTab'

let screen = Dimensions.get('window');
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = screen;

let toolbarActions = [
  { title: '回复', iconName: 'md-create', show: 'always' },
  { title: '收藏', iconName: 'md-star', show: 'always' },
  { title: '感谢', iconName: 'md-thumbs-up', show: 'never' },
  { title: '分享', show: 'never' },
];
let title = "TOPIC";
let WEBVIEW_REF = `WEBVIEW_REF`;

let toolbarHeight = 56;
let releasedMarginTop = 0;

const ACTUAL_SCREEN_HEIGHT = SCREEN_HEIGHT - StatusBar.currentHeight + 1;

let CIRCLE_SIZE = 56;
let config = { tension: 30, friction: 7, ease: Easing.in(Easing.ease(1, 0, 1, 1)), duration: 200 };

const iconMapper = {
  '同步': 'md-sync',
  '关注': 'md-star-half',
  '感谢': 'md-thumbs-up'
}

const limit = SCREEN_WIDTH - toolbarHeight

export default class Home extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: false,
      isLoading: true,
      toolbar: [],
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


  componentWillUnmount = () => {
    this.removeListener && this.removeListener.remove()
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
    this.removeListener = BackHandler.addEventListener('hardwareBackPress', () => {
      if (marginTop._value === 0) {
        
        return false;
      }
      this._viewStyles.style.top = 0
      this._previousTop = 0
      Animated.timing(marginTop, { toValue: 0, ...config, duration: 200 }).start();
      return true
    })
    this.PanResponder = PanResponder.create({

      onStartShouldSetPanResponderCapture: (e, gesture) => {
        const target = e.nativeEvent.pageY - this._previousTop - 40
        if (target <= limit) {
          return true
        } else if (target <= SCREEN_WIDTH) {
          return false
        } else {
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
        if (target > limit && target <= SCREEN_WIDTH) {
          return Math.abs(gesture.dy) >= 2
        }
        return false
      },
      onPanResponderGrant: (e, gesture) => {

      },
      onPanResponderMove: (e, gesture) => {
        this._viewStyles.style.top = this._previousTop + gesture.dy
        if (this._viewStyles.style.top > 0) {
          this._viewStyles.style.top = 0
        } else if (this._viewStyles.style.top < -limit) {
          this._viewStyles.style.top = -limit
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
        this._previousTop += gesture.dy;
      },

    });
  }

  preFetch = () => {
    const { params } = this.props.navigation.state
    this.setState({
      isLoading: true
    })
    InteractionManager.runAfterInteractions(() => {
      const data = getHomeAPI(params.URL).then(data => {

        this.hasGameTable = data.gameTable.length !== 0
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
    const { nightModeInfo } = modeInfo
    const color = 'rgba(255,255,255,1)'
    const infoColor = 'rgba(255,255,255,0.8)'
    return (
      <View key={rowData.id} style={{
        backgroundColor: 'transparent',
        height: SCREEN_WIDTH - toolbarHeight
      }}>
        <View style={{ flexDirection: 'row', justifyContent:'space-around', alignItems: 'center', flex: 1, padding: 5, marginTop: -10  }}>
          <View style={{ justifyContent:'center', alignItems: 'center', flex: 2  }}>
            <Text style={{ flex: -1, color: infoColor, fontSize: 15, textAlign: 'center' }}>{rowData.description}</Text>
          </View>
          <View style={{ justifyContent:'center', alignItems: 'center', flex: 1  }}>
            <Text style={{ flex: -1, color: levelColor, fontSize: 20 }}>{rowData.exp.split('经验')[0]}</Text>
            <Text style={{ flex: -1, color: infoColor, fontSize: 12 }}>{rowData.exp.split('经验')[1]}</Text>
          </View>
          <View style={{ justifyContent:'center', alignItems: 'center', flex: 1  }}>
            <Text style={{ flex: -1, color: rankColor, fontSize: 20 }}>{rowData.ranking}</Text>
            <Text style={{ flex: -1, color: infoColor, fontSize: 12 }}>所在服排名</Text>
          </View>
        </View>

        <View style={{ position: 'absolute', top: 0, left: 0, right: 0, height: limit  }}>
          <View style={{ justifyContent:'center', alignItems: 'center', alignSelf: 'center', flex: 3, marginTop: -70 }}>
            <View borderRadius={75} style={{width: 150, height: 150, backgroundColor: '#fff'}} >
              <Image
                borderRadius={75}
                source={{ uri: rowData.avatar}}
                style={[styles.avatar, { width: 150, height: 150 }]}
              />
            </View>
          </View>
        </View>

        <View style={{ flexDirection: 'row', justifyContent:'space-around', alignItems: 'center', flex: 3, elevation: 4  }}>
        </View>


        <View style={{ flex: 1, padding: 5}}>
          <View borderRadius={20} style={{ marginTop: 10, width: SCREEN_WIDTH / 4 * 3, alignSelf: 'center', alignContent: 'center',  flexDirection: 'row', justifyContent:'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)'  }}>
            <Text style={{ height: 30, textAlignVertical: 'center',textAlign: 'center' }}>
              <Text style={{ flex: 1, color: color, marginVertical: 2, textAlign:'center', fontSize: 15 }}>{rowData.platinum + ' '}</Text>
              <Text style={{ flex: 1, color: color, marginVertical: 2, textAlign:'center', fontSize: 15 }}>{rowData.gold + ' '}</Text>
              <Text style={{ flex: 1, color: color, marginVertical: 2, textAlign:'center', fontSize: 15 }}>{rowData.silver + ' '}</Text>
              <Text style={{ flex: 1, color: color, marginVertical: 2, textAlign:'center', fontSize: 15 }}>{rowData.gold + ' '}</Text>
              <Text style={{ flex: 1, color: color, marginVertical: 2, textAlign:'center', fontSize: 15 }}>{rowData.all + ' '}</Text>
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', justifyContent:'space-around', alignItems: 'center', flex: 1, padding: 5  }}>
          <View style={{ justifyContent:'center', alignItems: 'center', flex: 1  }}>
            <Text style={{ flex: 1, color: color, textAlign:'center', fontSize: 20 }}>{rowData. allGames}</Text>
            <Text style={{ flex: 1, color: infoColor, textAlign:'center', fontSize: 12 }}>总游戏</Text>
          </View>
          <View style={{ justifyContent:'center', alignItems: 'center', flex: 1  }}>
            <Text style={{ flex: 1, color: color, textAlign:'center', fontSize: 20 }}>{rowData.perfectGames}</Text>
            <Text style={{ flex: 1, color: infoColor, textAlign:'center', fontSize: 12 }}>完美数</Text>
          </View>
          <View style={{ justifyContent:'center', alignItems: 'center', flex: 1  }}>
            <Text style={{ flex: 1, color: color, textAlign:'center', fontSize: 20 }}>{rowData.hole}</Text>
            <Text style={{ flex: 1, color: infoColor, textAlign:'center', fontSize: 12 }}>坑数</Text>
          </View>
          <View style={{ justifyContent:'center', alignItems: 'center', flex: 1  }}>
            <Text style={{ flex: 1, color: color, textAlign:'center', fontSize: 20 }}>{(rowData.ratio || '').replace('完成率', '')}</Text>
            <Text style={{ flex: 1, color: infoColor, textAlign:'center', fontSize: 12 }}>完成率</Text>
          </View>
          <View style={{ justifyContent:'center', alignItems: 'center', flex: 1  }}>
            <Text style={{ flex: 1, color: color, textAlign:'center', fontSize: 20 }}>{rowData.followed}</Text>
            <Text style={{ flex: 1, color: infoColor, textAlign:'center', fontSize: 12 }}>被关注</Text>
          </View>
        </View>
      </View>
    )
  }

  renderTabContainer = (list) => {
    const { modeInfo } = this.props.screenProps
    const { params } = this.props.navigation.state
  
    return (
      <CreateUserTab screenProps={{
        modeInfo: modeInfo,
        toolbar: list,
        setToolbar: ({ toolbar, toolbarActions }) => {
          this.setState({
            toolbar,
            onActionSelected: toolbarActions
          })
        },
        profileToolbar: this.state.data.psnButtonInfo.reverse().map(item => {
          return { title: item.text, iconName: iconMapper[item.text], show: 'always' }
        }),
        gameTable: this.state.data.gameTable,
        navigation: this.props.navigation
      }} onNavigationStateChange={null}/> 
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
          title={`${params.title}`}
          titleColor={modeInfo.isNightMode ? '#000' : '#fff'}
          style={[styles.toolbar, { backgroundColor: this.state.isLoading ? modeInfo.standardColor : 'transparent' }]}
          actions={this.state.toolbar}
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
          onActionSelected={this.state.onActionSelected}
        />
        {this.state.isLoading && (
          <ActivityIndicator
            animating={this.state.isLoading}
            style={{
              flex: 999,
              justifyContent: 'center',
              alignItems: 'center'
            }}
            color={accentColor}
            size={50}
          />
        )}
        { (!this.state.isLoading && source.playerInfo && source.playerInfo.backgroundImage) && (
          <View style={{
            position: 'absolute',
            top: -1, left: 0, right: 0, 
          }}>
            <Image
              source={{ uri: source.playerInfo.backgroundImage }}
              resizeMode={'cover'}
              resizeMethod={'resize'}
              style={{ 
                height: SCREEN_WIDTH + 1,
                top: 0, // why??
              }}
            />
          </View>
        )}
        {
          !this.state.isLoading && (<Animated.View ref={(view) => {
            this.view = view;
          }} 
          
          style={{
            overflow: 'visible',
            flex:0, 
            height: ACTUAL_SCREEN_HEIGHT + 360 - toolbarHeight + ACTUAL_SCREEN_HEIGHT    ,         
            transform: [
                {
                  translateY: this.state.marginTop.interpolate({
                    inputRange: [-360, 0, 360],
                    outputRange: [-360, 0 , 360]
                  })
                }
              ]
            }}
            {...this.PanResponder.panHandlers}
            >
            {
              this.renderHeader(source.playerInfo)
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
                height: SCREEN_WIDTH
              }}/>
            </View>
            <View style={{flex: 0, height: SCREEN_HEIGHT - toolbarHeight - StatusBar.currentHeight + 1, backgroundColor: modeInfo.backgroundColor}} contentContainerStyle={{
              height: SCREEN_HEIGHT - toolbarHeight  - StatusBar.currentHeight + 1
            }}
              key={'caonima'}
              >
              {this.renderTabContainer(source.toolbarInfo)}
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
    color: idColor, // make links coloured pink
  },
});
