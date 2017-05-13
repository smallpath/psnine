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
    const { profileToolbar: toolbar } = this.props.screenProps
    if (!toolbar) return
    if (!toolbar.length) return
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

  handleImageOnclick = (url) => this.props.navigation.navigate('ImageViewer', {
    images: [
      { url }
    ]
  })


  hasGameTable = false
  renderGameItem = (rowData, index) => {
    const { modeInfo } = this.props.screenProps
    return (
      <TouchableNativeFeedback key={rowData.id || index}   onPress={() => {
          this.props.screenProps.navigation.navigate('GamePage', {
            URL: rowData.href,
            title: rowData.title,
            rowData,
            type: 'game',
            shouldBeSawBackground: true
          })
        }}>
        <View pointerEvents={'box-only'} style={{
          backgroundColor: modeInfo.backgroundColor,
          flexDirection: 'row',
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: modeInfo.brighterLevelOne,
          padding: 2
        }}>

          <View style={{ flex: -1, flexDirection: 'row', padding: 12 }}>
            <Image
              source={{ uri: rowData.avatar }}
              style={[styles.avatar, { width: 91, height: 54 }]}
            />
          </View>
          <View style={{ justifyContent: 'center', flex: 3 }}>
            <View>
              <Text
                ellipsizeMode={'tail'}
                style={{ flex: -1, color: modeInfo.titleTextColor, }}>
                {rowData.title}
              </Text>
            </View>
            { rowData.platform && <View><Text style={{ color: modeInfo.standardTextColor, marginLeft: 2  }}>{rowData.platform.join(' ')}</Text></View> }
            { rowData.syncTime && (<View style={{ flex: -1, flexDirection: 'row' }}>
                <Text style={{ color: modeInfo.standardColor ,fontSize: 12, marginLeft: 2 }}>{rowData.syncTime + ' '}</Text>
                <Text selectable={false} style={{
                  flex: -1,
                  color: modeInfo.standardTextColor,
                  fontSize: 12
                }}>{ rowData.allTime ? '总耗时 ' : ''}</Text>
                <Text selectable={false} style={{
                  flex: -1,
                  fontSize: 12,
                  color: modeInfo.standardTextColor,
                }}>{rowData.allTime}</Text>
              </View>)}
          </View>
          { rowData.alert && (
            <View style={{ flex: 1, justifyContent: 'center', padding: 2 }}>
              <Text selectable={false}             
                style={{ 
                  flex: -1,             
                  textAlign: 'center',
                  textAlignVertical: 'center',
                  color: modeInfo.titleTextColor, }}>{rowData.alert}</Text>
              <Text
                ellipsizeMode={'tail'} 
                style={{
                  flex: -1,
                  color: modeInfo.standardTextColor,
                  textAlign: 'center',
                  textAlignVertical: 'center',
                  fontSize: 10
                }}>{rowData.allPercent}</Text>
            </View>
            )
          }
          <View style={{ flex: 1, justifyContent: 'center', padding: 2 }}>
            <Text selectable={false}             
              style={{ 
                flex: -1,             
                textAlign: 'center',
                textAlignVertical: 'center',
                color: modeInfo.titleTextColor, }}>{rowData.percent}</Text>
            <Text
              ellipsizeMode={'tail'} 
              style={{
                flex: -1,
                color: modeInfo.standardTextColor,
                textAlign: 'center',
                textAlignVertical: 'center',
                fontSize: 10
              }}>{rowData.trophyArr}</Text>
          </View>
        </View>
      </TouchableNativeFeedback>
    )
  }

  renderDiary = (rowData, index) => {
    const { modeInfo } = this.props.screenProps
    const shouldShowImage = rowData.thumbs.length !== 0
    const suffix = '<div>' + rowData.thumbs.map(text => `<img src="${text}">`) + '</div>'
    const content = `<div>${rowData.content}${shouldShowImage ? suffix : ''}</div>`
    return (
      <TouchableNativeFeedback key={rowData.id || index}   onPress={() => {
          this.props.screenProps.navigation.navigate('CommunityTopic', {
            URL: rowData.href,
            title: rowData.psnid,
            rowData,
            type: 'gene', // todo
          })
        }}>
        <View pointerEvents={'box-only'} style={{
          backgroundColor: modeInfo.backgroundColor,
          flexDirection: 'column',
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: modeInfo.standardTextColor,
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
              shouldForceInline={false}
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

  renderGameProfile = (rowData, index) => {
    const { modeInfo } = this.props.screenProps
    return (
      <View key={index} style={{ backgroundColor: modeInfo.backgroundColor }}>
        <View>
          { rowData.map((item , index) => this.renderGameItem(item ,index)) }
        </View>
      </View>
    )
  }

  renderDiaryProfile = (rowData, index) => {
    const { modeInfo } = this.props.screenProps
    return (
      <View key={index} style={{ backgroundColor: modeInfo.backgroundColor }}>
        <View>
          { rowData.map((item , index) => this.renderDiary(item ,index)) }
        </View>
      </View>
    )
  }

  render() {
    const { params = {} } = this.props.navigation.state
    // console.log('GamePage.js rendered');
    const { modeInfo, gameTable, diaryTable } = this.props.screenProps
    const data = []
    const renderFuncArr = []
    if (gameTable.length !== 0) {
      data.push(gameTable)
      renderFuncArr.push(this.renderGameProfile)
    } 
    if (diaryTable.length !== 0) {
      data.push(diaryTable)
      renderFuncArr.push(this.renderDiaryProfile)
    }


    this.viewBottomIndex = Math.max(data.length - 1, 0)

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
            color={accentColor}
            size={50}
          />
        )}
        {!this.state.isLoading && <FlatList style={{
          flex: -1,
          backgroundColor: modeInfo.backgroundColor
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
