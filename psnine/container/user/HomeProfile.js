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
  Keyboard
} from 'react-native';

import { sync, updown, fav, upBase, block } from '../../dao/sync'
import MyDialog from '../../components/Dialog'
import HTMLView from '../../components/HtmlToView';
import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import UserGameItem from '../shared/UserGameItem';
import {
  standardColor, 
  nodeColor, 
  idColor,
  accentColor,
  levelColor,
  rankColor,
} from '../../constants/colorConfig';

import { getHomeAPI } from '../../dao';

let screen = Dimensions.get('window');
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = screen;

let toolbarActions = [];
let title = "TOPIC";
let WEBVIEW_REF = `WEBVIEW_REF`;

let toolbarHeight = 56;
let releasedMarginTop = 0;

const ACTUAL_SCREEN_HEIGHT = SCREEN_HEIGHT - StatusBar.currentHeight + 1;

let CIRCLE_SIZE = 56;
let config = { tension: 30, friction: 7, ease: Easing.in(Easing.ease(1, 0, 1, 1)), duration: 200 };

const iconMapper = {
  '游戏同步': 'md-sync',
  '关注': 'md-star-half',
  '感谢': 'md-thumbs-up',
  '等级同步': 'md-sync'
}

export default class Home extends Component {
  static navigationOptions = {
     tabBarLabel: '主页'
  }
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      rotation: new Animated.Value(1),
      scale: new Animated.Value(1),
      opacity: new Animated.Value(1),
      openVal: new Animated.Value(0),
      modalVisible: false,
      modalOpenVal: new Animated.Value(0),
      topicMarginTop: new Animated.Value(0)
    }
  }

  componentWillMount = () => {
    let { profileToolbar: toolbar, psnid = '' } = this.props.screenProps
    if (!toolbar) return
    if (!toolbar.length) return
    const { modeInfo } = this.props.screenProps
    if (modeInfo.settingInfo.psnid.toLowerCase() === psnid.toLowerCase()) {
      toolbar = toolbar.slice(0, -1)
    }
    // console.log(modeInfo.settingInfo.psnid, psnid)
    const componentDidFocus = () => {
      InteractionManager.runAfterInteractions(() => {
        this.props.screenProps.setToolbar({
          toolbar: toolbar,
          toolbarActions: this._onActionSelected,
          componentDidFocus: {
            index: 0,
            handler: componentDidFocus
          }
        })
      })
    }
    componentDidFocus()
  }

  _onActionSelected = (index) => {
    const { params } = this.props.screenProps.navigation.state
    const { preFetch } = this.props.screenProps
    const psnid = params.URL.split('/').filter(item => item.trim()).pop()
    // alert(index)
    switch (index) {
      case 4:
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
        return;
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
        return;
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
        return;
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
        return;
    }
  }

  handleImageOnclick = (url) => this.props.navigation.navigate('ImageViewer', {
    images: [
      { url }
    ]
  })


  ITEM_HEIGHT = 83

  renderGameItem = (rowData, index) => {
    const { modeInfo, navigation } = this.props.screenProps
    const { ITEM_HEIGHT } = this
    return <UserGameItem {...{
      navigation,
      rowData,
      modeInfo,
      ITEM_HEIGHT
    }} />
  }


  hasGameTable = false

  renderDiary = (rowData, index) => {
    const { modeInfo } = this.props.screenProps
    const shouldShowImage = rowData.thumbs.length !== 0
    const suffix = '<div>' + rowData.thumbs.map(text => `<img src="${text}">`).join('') + '</div>'
    const content = `<div>${rowData.content}<br><br>${shouldShowImage ? suffix : ''}</div>`

    return (
      <TouchableNativeFeedback key={rowData.id || index}   onPress={() => {
        fetch(rowData.href).then(res => {
          if (res.url && typeof res.url === 'string') {
            this.props.screenProps.navigation.navigate('CommunityTopic', {
              URL: res.url,
              title: rowData.psnid,
              rowData: {
                id: res.url.split('/').pop()
              },
              type: res.url.includes('gene') ? 'gene' : 'community', // todo
            })
          }
        }).catch(err => global.toast(err.toString()))
          
        }}>
        <View pointerEvents={'box-only'} style={{
          backgroundColor: modeInfo.backgroundColor,
          flexDirection: 'column',
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: modeInfo.brighterLevelOne,
          padding: 10
        }}>

          <View style={{ flex: -1, flexDirection: 'row', padding: 5 }}>
            <HTMLView
              value={content}
              modeInfo={Object.assign({}, modeInfo, {
                standardTextColor: modeInfo.titleTextColor
              })}
              stylesheet={styles}
              onImageLongPress={this.handleImageOnclick}
              imagePaddingOffset={30 + 10}
              shouldForceInline={true}
            />
          </View>
          <View style={{ 
            flex: 1, 
            justifyContent: 'space-around', 
            flexDirection: 'row',
            alignItems: 'flex-start',
            padding: 2,
            paddingLeft: 12
          }}>
            <Text        
              style={{ 
                flex: 1,             
                textAlign: 'left',
                textAlignVertical: 'center',
                color: modeInfo.standardTextColor, }}>{rowData.psnid}</Text>
            <Text             
              style={{ 
                flex: 1,             
                textAlign: 'left',
                textAlignVertical: 'center',
                color: modeInfo.standardTextColor, }}>{rowData.date + ' '}{rowData.count}</Text>
          </View>
        </View>
      </TouchableNativeFeedback>
    )
  }

  render() {
    const { params = {} } = this.props.navigation.state
    // console.log('GamePage.js rendered');
    const { modeInfo, gameTable, diaryTable } = this.props.screenProps
    let data = []
    let renderFunc = () => null
    if (gameTable.length !== 0) {
      data = gameTable
      renderFunc = this.renderGameItem
    } 
    if (diaryTable.length !== 0) {
      data = diaryTable 
      renderFunc = this.renderDiary
    }


    this.viewBottomIndex = Math.max(data.length - 1, 0)
    // console.log(modeInfo.themeName)
    return (
      <View
        style={{ flex: 1, backgroundColor: modeInfo.backgroundColor }}
        onStartShouldSetResponder={() => false}
        onMoveShouldSetResponder={() => false}
      >
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
        {!this.state.isLoading && <FlatList style={{
          flex: -1,
          backgroundColor: modeInfo.backgroundColor
        }}
          ref={flatlist => this.flatlist = flatlist}
          data={data}
          keyExtractor={(item, index) => item.href || index}
          renderItem={({ item, index }) => {
            return renderFunc(item, index)
          }}
          extraData={this.state}
          windowSize={999}
          key={modeInfo.themeName}
          numColumns={diaryTable.length ? 1 : modeInfo.numColumns}
          disableVirtualization={true}
          viewabilityConfig={{
            minimumViewTime: 3000,
            viewAreaCoveragePercentThreshold: 100,
            waitForInteraction: true
          }}
        >
        </FlatList>
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
