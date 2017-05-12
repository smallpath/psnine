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
      marginTop: new Animated.Value(0)
    }
  }

  _onActionSelected = (index) => {
    const { params } = this.props.navigation.state
    switch (index) {
      case 0:
        ToastAndroid.show('同步中..', ToastAndroid.SHORT)
        const psnid = params.URL.split('/').filter(item => item.trim()).pop()
        sync(psnid).then(res => res.text()).then(text => {
          if (text.includes('玩脱了')) {
            const arr = text.match(/\<title\>(.*?)\<\/title\>/)
            if (arr && arr[1]) {
              const msg = `同步失败: ${arr[1]}`
              ToastAndroid.show(msg, ToastAndroid.SHORT);
              return
            }
          }
          ToastAndroid.show('同步成功', ToastAndroid.SHORT);
          this.preFetch()
        }).catch(err => {
          const msg = `同步失败: ${err.toString()}`
          ToastAndroid.show(msg, ToastAndroid.SHORT);
        })
        return;
      case 1:
        return
      case 2:
        return;
      case 3:
        return;
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
      if (marginTop._value !== -SCREEN_WIDTH) {
        
        return false;
      }
      this._viewStyles.style.top = 0
      this._previousTop = 0
      Animated.timing(marginTop, { toValue: 0, ...config, duration: 200 }).start();
      return true
    })
    this.PanResponder = PanResponder.create({

      onStartShouldSetPanResponderCapture: (e, gesture) => {
        console.log('onStart')
        const target = e.nativeEvent.pageY - this._previousTop - toolbarHeight * 2
        console.log(target, SCREEN_WIDTH)
        if (target <= SCREEN_WIDTH - toolbarHeight) {
          console.log('grant:', target)
          return true
        } else if (target <= SCREEN_WIDTH) {
          console.log('允许点击')
          return false
        } else {
          console.log('jump:', SCREEN_WIDTH)
          this._viewStyles.style.top = -SCREEN_WIDTH
          this._previousTop = -SCREEN_WIDTH
          // this.view.setNativeProps(this._viewStyles)
          this._viewStyles.style.top
          Animated.timing(marginTop, {
            toValue: -SCREEN_WIDTH,
            ...config
          }).start()
          return false
        }
        return target <= SCREEN_WIDTH ? true : false;
      },
      onPanResponderGrant: (e, gesture) => {
        console.log('onGrant')
        // const target = gesture.y0 <= 56 ? 0 : SCREEN_HEIGHT - 56
        // marginTop.setOffset(target);
      },
      onPanResponderMove: (e, gesture) => {
        this._viewStyles.style.top = this._previousTop + gesture.dy
        if (this._viewStyles.style.top > 0) {
          this._viewStyles.style.top = 0
        }
        marginTop.setValue(this._viewStyles.style.top)
        // console.log(-this._previousTop)
        // this.view.setNativeProps(this._viewStyles)
      },

      onPanResponderRelease: (e, gesture) => {

      },
      onPanResponderTerminationRequest: (evt, gesture) => {
        return false;
      },
      onPanResponderTerminate: (evt, gesture) => {

      },
      // onShouldBlockNativeResponder: (evt, gesture) => {
      //   return true;
      // },
      onPanResponderReject: (evt, gesture) => {
        return false;
      },
      onPanResponderEnd: (evt, gesture) => {
        // console.log('onEnd')
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
          toolbar: data.psnButtonInfo.reverse().map(item => {
            return { title: item.text, iconName: iconMapper[item.text], show: 'always' }
          }),
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
        backgroundColor: modeInfo.titleTextColor,
        height: SCREEN_WIDTH
      }}>
        <View style={{
          position: 'absolute',
          top: 0
        }}>
          <Image
            source={{ uri: rowData.backgroundImage }}
            resizeMode={'cover'}
            resizeMethod={'resize'}
            style={{ 
              width: SCREEN_WIDTH, 
              height: SCREEN_WIDTH,
              top: -1, // why??
            }}
          />
        </View>

        <View style={{ flexDirection: 'row', justifyContent:'space-around', alignItems: 'center', flex: 1, padding: 5  }}>
          <View style={{ justifyContent:'center', alignItems: 'center', flex: 2  }}>
            <Text style={{ flex: -1, color: color, fontSize: 20 }}>{rowData.psnid}</Text>
            <Text style={{ flex: -1, color: infoColor, fontSize: 12, textAlign: 'center' }}>{rowData.description}</Text>
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

        <View style={{ position: 'absolute', top: 0, left: 0, width: SCREEN_WIDTH, height: SCREEN_WIDTH  }}>
          <View style={{ justifyContent:'center', alignItems: 'center', alignSelf: 'center', flex: 5, marginTop: -51  }}>
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
          <View borderRadius={20} style={{ width: SCREEN_WIDTH / 4 * 3, alignSelf: 'center', alignContent: 'center',  flexDirection: 'row', justifyContent:'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.3)'  }}>
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

  renderToolbar = (list) => {
    const { modeInfo } = this.props.screenProps
    return (
          <View style={{ 
            height: 40,
            flexDirection: 'row',
            alignItems: 'flex-start',
            flexWrap:'wrap',
            padding: 0,
            backgroundColor: modeInfo.backgroundColor
            }}>
          {list.map((item, index) => (
            <TouchableNativeFeedback key={index} onPress={() => {
                const url = item.url
                if (item.text === '游戏') {
                  this.props.navigation.navigate('UserGame', {
                    URL: url + '?page=1'
                  })
                }
              }}>
              <View style={{ flex: 1, padding: 12, alignItems:'center', justifyContent: 'center' }}  key={index}>
                <Text style={{ color: idColor, textAlign:'left', fontSize: 12 }}>{item.text}</Text>
              </View>
            </TouchableNativeFeedback>
        ))}
      </View>
    )
  }

  renderTabContainer = (list) => {
    const { modeInfo } = this.props.screenProps
  
    const UserTab = CreateUserTab(list)
    return (
      <UserTab screenProps={{
        modeInfo: modeInfo,
        gameTable: this.state.data.gameTable
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
          style={[styles.toolbar, { backgroundColor: modeInfo.standardColor }]}
          actions={this.state.toolbar}
          onIconClicked={() => {
            if (marginTop._value !== -SCREEN_WIDTH) {
              this.props.navigation.goBack()
              return
            }
            this._viewStyles.style.top = 0
            this._previousTop = 0
            Animated.timing(marginTop, { toValue: 0, ...config, duration: 200 }).start();
          }}
          onActionSelected={this._onActionSelected}
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
            <View style={{backgroundColor: '#f00', flex: 0, height: ACTUAL_SCREEN_HEIGHT}} contentContainerStyle={{
              height: ACTUAL_SCREEN_HEIGHT
            }}
              >
              {this.renderTabContainer(source.toolbarInfo)}
            </View>
            </Animated.View>
          )
        }
        {/*{!this.state.isLoading && <FlatList style={{

          height: 300,
          backgroundColor: '#f00'//modeInfo.standardColor
        }}
          ref={flatlist => this.flatlist = flatlist}
          data={data}
          keyExtractor={(item, index) => item.id || index}
          renderItem={({ item, index }) => {
            return renderFuncArr[index](item)
          }}
          extraData={this.state}
          windowSize={999}
          disableVirtualization={true}
          viewabilityConfig={{
            minimumViewTime: 3000,
            viewAreaCoveragePercentThreshold: 100,
            waitForInteraction: true
          }}
        >
        </FlatList>
        }*/}
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
