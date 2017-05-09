import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
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

import HTMLView from './htmlToView';
import CommentList from './CommentList'
import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { standardColor, nodeColor, idColor, accentColor } from '../constants/colorConfig';

import {
  getHomeAPI
} from '../dao/dao'
import ImageViewer from './imageViewer'

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
      topicMarginTop: new Animated.Value(0)
    }
  }

  _onActionSelected = (index) => {
    const { params } = this.props.navigation.state
    switch (index) {
      case 0:
        return;
      case 1:
        this.preFetch()
        return
      case 2:
        return;
      case 3:
        return;
    }
  }

  componentWillMount = () => {
    this.preFetch()
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

    return (
      <View key={rowData.id} style={{
        backgroundColor: modeInfo.titleTextColor,
      }}>
        <View style={{
          position: 'absolute',
          top: 0
        }}>
          <Image
            source={{ uri: rowData.backgroundImage }}
            resizeMode={'stretch'}
            resizeMethod={'resize'}
            style={{ 
              width: SCREEN_WIDTH, 
              height: SCREEN_WIDTH / 16 * 13,
              top: -1, // why??
            }}
          />
        </View>

        <View style={{ flexDirection: 'row', justifyContent:'space-around', alignItems: 'center', flex: 1, padding: 5  }}>
          <View style={{ justifyContent:'center', alignItems: 'center', flex: 2  }}>
            <Text style={{ flex: -1, color: modeInfo.titleTextColor, }}>{rowData.psnid}</Text>
            <Text style={{ flex: -1, color: modeInfo.titleTextColor, fontSize: 12 }}>{rowData.description}</Text>
          </View>
          <View style={{ justifyContent:'center', alignItems: 'center', flex: 1  }}>
            <Text style={{ flex: -1, color: modeInfo.titleTextColor, }}>{rowData.exp.split('经验')[0]}</Text>
            <Text style={{ flex: -1, color: modeInfo.titleTextColor, fontSize: 12 }}>{rowData.exp.split('经验')[1]}</Text>
          </View>
          <View style={{ justifyContent:'center', alignItems: 'center', flex: 1  }}>
            <Text style={{ flex: -1, color: modeInfo.titleTextColor, }}>{rowData.ranking}</Text>
            <Text style={{ flex: -1, color: modeInfo.titleTextColor, fontSize: 12 }}>所在服排名</Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', justifyContent:'space-around', alignItems: 'center', flex: 3  }}>
          <View style={{ justifyContent:'center', alignItems: 'center', alignSelf: 'center', flex: 5  }}>
            <View>
              <Image
                source={{ uri: rowData.avatar}}
                style={[styles.avatar, { width: 100, height: 100 }]}
              />
            </View>
          </View>
        </View>

        <View style={{ flexDirection: 'row', justifyContent:'center', alignItems: 'center', flex: 1, padding: 5  }}>
          <Text>
            <Text style={{ flex: 1, color: modeInfo.titleTextColor, marginVertical: 2, textAlign:'center' }}>{rowData.platinum + ' '}</Text>
            <Text style={{ flex: 1, color: modeInfo.titleTextColor, marginVertical: 2, textAlign:'center' }}>{rowData.gold + ' '}</Text>
            <Text style={{ flex: 1, color: modeInfo.titleTextColor, marginVertical: 2, textAlign:'center' }}>{rowData.silver + ' '}</Text>
            <Text style={{ flex: 1, color: modeInfo.titleTextColor, marginVertical: 2, textAlign:'center' }}>{rowData.gold + ' '}</Text>
            <Text style={{ flex: 1, color: modeInfo.titleTextColor, marginVertical: 2, textAlign:'center' }}>{rowData.all + ' '}</Text>
          </Text>
        </View>

        <View style={{ flexDirection: 'row', justifyContent:'space-around', alignItems: 'center', flex: 1, padding: 5  }}>
          <View style={{ justifyContent:'center', alignItems: 'center', flex: 1  }}>
            <Text style={{ flex: 1, color: modeInfo.titleTextColor, textAlign:'center' }}>{rowData. allGames}</Text>
            <Text style={{ flex: 1, color: modeInfo.titleTextColor, textAlign:'center' }}>总游戏</Text>
          </View>
          <View style={{ justifyContent:'center', alignItems: 'center', flex: 1  }}>
            <Text style={{ flex: 1, color: modeInfo.titleTextColor, textAlign:'center' }}>{rowData.perfectGames}</Text>
            <Text style={{ flex: 1, color: modeInfo.titleTextColor, textAlign:'center' }}>完美数</Text>
          </View>
          <View style={{ justifyContent:'center', alignItems: 'center', flex: 1  }}>
            <Text style={{ flex: 1, color: modeInfo.titleTextColor, textAlign:'center' }}>{rowData.hole}</Text>
            <Text style={{ flex: 1, color: modeInfo.titleTextColor, textAlign:'center' }}>坑数</Text>
          </View>
          <View style={{ justifyContent:'center', alignItems: 'center', flex: 1  }}>
            <Text style={{ flex: 1, color: modeInfo.titleTextColor, textAlign:'center' }}>{(rowData.ratio || '').replace('完成率', '')}</Text>
            <Text style={{ flex: 1, color: modeInfo.titleTextColor, textAlign:'center' }}>完成率</Text>
          </View>
          <View style={{ justifyContent:'center', alignItems: 'center', flex: 1  }}>
            <Text style={{ flex: -1, color: modeInfo.titleTextColor, }}>{rowData.followed}</Text>
            <Text style={{ flex: -1, color: modeInfo.titleTextColor, }}>被关注</Text>
          </View>
        </View>
      </View>
    )
  }

  renderToolbar = (list) => {
    const { modeInfo } = this.props.screenProps
    return (
          <View pointerEvents='box-only'style={{ 
            flex: 1, 
            flexDirection: 'row',
            alignItems: 'flex-start',
            flexWrap:'wrap',
            padding: 12,
            backgroundColor: modeInfo.backgroundColor
            }}>
          {list.map((item, index) => (
            <TouchableNativeFeedback key={index} onPress={() => item.url}>
              <View pointerEvents={'box-only'} style={{ flex: 1, alignItems:'center', justifyContent: 'center' }}  key={index}>
                <Text style={{ color: idColor, textAlign:'left', fontSize: 12 }}>{item.text}</Text>
              </View>
            </TouchableNativeFeedback>
        ))}
      </View>
    )
  }

  hasGameTable = false
  renderGameItem = (rowData, index) => {
    const { modeInfo } = this.props.screenProps
    return (
      <TouchableNativeFeedback key={rowData.id || index}   onPress={() => {
          this.props.navigation.navigate('GamePage', {
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

  renderProfile = (rowData, index) => {
    const { modeInfo } = this.props.screenProps
    return (
      <View key={index} style={{ backgroundColor: modeInfo.backgroundColor }}>
        <View>
          { rowData.map((item , index) => this.renderGameItem(item ,index)) }
        </View>
      </View>
    )
  }

  render() {
    const { params } = this.props.navigation.state
    // console.log('GamePage.js rendered');
    const { modeInfo } = this.props.screenProps
    const { data: source } = this.state
    const data = []
    const renderFuncArr = []
    const shouldPushData = !this.state.isLoading
    if (shouldPushData) {
      data.push(source.playerInfo)
      renderFuncArr.push(this.renderHeader)
    }
    if (shouldPushData) {
      data.push(source.toolbarInfo)
      renderFuncArr.push(this.renderToolbar)
    }
    if (shouldPushData && this.hasGameTable) {
      data.push(source.gameTable)
      renderFuncArr.push(this.renderProfile)
    }

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
            this.props.navigation.goBack()
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
        {!this.state.isLoading && <FlatList style={{
          flex: -1,
          backgroundColor: modeInfo.standardColor
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
