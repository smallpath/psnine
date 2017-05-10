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
  getGameAPI
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

export default class GamePage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: false,
      isLoading: true,
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
      const data = getGameAPI(params.URL).then(data => {

        this.hasPlayer = !!data.playerInfo.psnid
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
    return (
      <View key={rowData.id} style={{
        backgroundColor: modeInfo.backgroundColor
      }}>
        <TouchableNativeFeedback
          onPress={() => {

          }}
          useForeground={true}
          delayPressIn={100}
          background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
        >
          <View pointerEvents='box-only' style={{ flex: 1, flexDirection: 'row', padding: 12 }}>
            <Image
              source={{ uri: rowData.avatar }}
              style={[styles.avatar, { width: 91 }]}
            />

            <View style={{ marginLeft: 10, flex: 1, flexDirection: 'column', alignContent: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start',justifyContent: 'space-between' }}>
                <Text
                  ellipsizeMode={'tail'}
                  style={{ flex: -1, color: modeInfo.titleTextColor, }}>
                  {rowData.title}
                </Text>
                <Text selectable={false} style={{
                  flex: -1,
                  marginLeft: 5,
                  color: idColor,
                  textAlign: 'center',
                  textAlignVertical: 'center'
                }}>{rowData.tip || rowData.platform && rowData.platform.join(' ')}</Text>
              </View>

              <View style={{ flex: 1.1, flexDirection: 'row', justifyContent: 'space-between' }}>
                {/*<Text selectable={false} style={{ flex: -1, color: idColor, textAlign: 'center', textAlignVertical: 'center' }}>{rowData.text}</Text>*/}
                <Text selectable={false} style={{
                  flex: -1,
                  color: modeInfo.standardTextColor,
                  textAlign: 'center',
                  textAlignVertical: 'center',
                  fontSize: 10
                }}>{rowData.trophyArr.join('')}</Text>
                <Text selectable={false} style={{
                  flex: -1,
                  color: modeInfo.standardTextColor,
                  textAlign: 'center',
                  textAlignVertical: 'center',
                  fontSize: 10
                }}>{rowData.alert}</Text>
                <Text selectable={false} style={{
                  flex: -1,
                  color: modeInfo.standardTextColor,
                  textAlign: 'center',
                  textAlignVertical: 'center',
                  fontSize: 10
                }}>{rowData.rare}</Text>
              </View>

            </View>

          </View>
        </TouchableNativeFeedback>
      </View>
    )
  }
  hasPlayer = false
  renderPlayer = (rowData) => {
    const { modeInfo } = this.props.screenProps
    return (
      <View pointerEvents='box-only' style={{ 
        flex: 1, 
        flexDirection: 'row', 
        padding: 12,
        backgroundColor: modeInfo.backgroundColor
        }}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: modeInfo.titleTextColor, textAlign:'center'  }}>{rowData.psnid}</Text>
          <Text style={{ color: modeInfo.standardTextColor, textAlign:'center' }}>{rowData.total}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: modeInfo.titleTextColor, textAlign:'center' }}>{rowData.first}</Text>
          <Text style={{ color: modeInfo.standardTextColor, textAlign:'center', fontSize: 12 }}>首个杯</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: modeInfo.titleTextColor, textAlign:'center' }}>{rowData.last}</Text>
          <Text style={{ color: modeInfo.standardTextColor, textAlign:'center', fontSize: 12 }}>最后杯</Text>
        </View>
        { rowData.time && (<View style={{ flex: 1 }}>
          <Text style={{ color: modeInfo.titleTextColor, textAlign:'center' }}>{rowData.time}</Text>
          <Text style={{ color: modeInfo.standardTextColor, textAlign:'center', fontSize: 12 }}>总耗时</Text>
        </View>)}
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
            <View style={{ flex: 1, alignItems:'center', justifyContent: 'center' }}  key={index}>
              <Image source={{uri:item.img}} style={{ width: 30, height: 30}}/>
              <Text style={{ color: idColor, textAlign:'left', fontSize: 12 }}>{item.text}</Text>
            </View>
        ))}
      </View>
    )
  }

  hasContent = false
  renderGameHeader = (rowData, index) => {
    const { modeInfo } = this.props.screenProps
    return (
      <View key={rowData.id || index}  style={{
        backgroundColor: modeInfo.backgroundColor,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: modeInfo.brighterLevelOne,
        padding: 2
      }}>
        <TouchableNativeFeedback
          onPress={() => {

          }}
          useForeground={true}
          delayPressIn={100}
          background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
        >
          <View pointerEvents='box-only' style={{ flex: 1, flexDirection: 'row', padding: 12 }}>
            <Image
              source={{ uri: rowData.avatar }}
              style={[styles.avatar, { width: 91 }]}
            />

            <View style={{ marginLeft: 10, flex: 1, flexDirection: 'column', alignContent: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start',justifyContent: 'space-between' }}>
                <Text
                  ellipsizeMode={'tail'}
                  style={{ flex: -1, color: modeInfo.titleTextColor, }}>
                  {rowData.title}
                </Text>
              </View>

              <View style={{ flex: 1.1, flexDirection: 'row', justifyContent: 'space-between' }}>
                {/*<Text selectable={false} style={{ flex: -1, color: idColor, textAlign: 'center', textAlignVertical: 'center' }}>{rowData.text}</Text>*/}
                <Text selectable={false} style={{
                  flex: -1,
                  color: modeInfo.standardTextColor,
                  textAlign: 'center',
                  textAlignVertical: 'center',
                  fontSize: 10
                }}>{rowData.trophyArr.join('')}</Text>
              </View>
            </View>
          </View>
        </TouchableNativeFeedback>
      </View>
    )
  }

  renderTrophy = (rowData, index) => {
    const { modeInfo } = this.props.screenProps
    return (
      <TouchableNativeFeedback onPress={
        () => {}
      }>
        <View key={rowData.id || index}  style={{
          backgroundColor: modeInfo.backgroundColor,
          flexDirection: 'row',
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: modeInfo.brighterLevelOne,
          padding: 2
        }}>
          <View pointerEvents='box-only' style={{ flex: -1, flexDirection: 'row', padding: 12 }}>
            <Image
              source={{ uri: rowData.avatar }}
              style={[styles.avatar, { width: 54, height: 54 }]}
            />
          </View>
          <View style={{ justifyContent: 'space-around', flex: 3 }}>
            <Text
              ellipsizeMode={'tail'}
              style={{ flex: -1, color: modeInfo.titleTextColor, }}>
              {rowData.title}
              { rowData.translate && <Text style={{ color: modeInfo.standardTextColor, marginLeft: 2  }}>{' '+ rowData.translate}</Text> }
              { rowData.tip && <Text style={{ color: modeInfo.standardColor ,fontSize: 12, marginLeft: 2 }}>{rowData.tip}</Text> }
            </Text>
            <Text
              ellipsizeMode={'tail'}
              style={{ flex: -1, color: modeInfo.titleTextColor, }}>
              {rowData.translateText || rowData.text}
            </Text>
          </View>
          { rowData.time &&(
              <View style={{ flex: 1, justifyContent: 'center', padding: 2 }}>
                <Text selectable={false} style={{
                  flex: -1,
                  color: modeInfo.standardTextColor,
                  textAlign: 'center',
                  textAlignVertical: 'center',
                  fontSize: 10
                }}>{rowData.time}</Text>
              </View>
            )
          }
          <View style={{ flex: 1, justifyContent: 'center', padding: 2 }}>
            <Text selectable={false}             
              style={{ 
                flex: -1,             
                textAlign: 'center',
                textAlignVertical: 'center',
                color: modeInfo.titleTextColor, }}>{rowData.rare}</Text>
            <Text
              ellipsizeMode={'tail'} 
              style={{
                flex: -1,
                color: modeInfo.standardTextColor,
                textAlign: 'center',
                textAlignVertical: 'center',
                fontSize: 10
              }}>{rowData.rare ? '珍惜度' : ''}</Text>
          </View>
        </View>
      </TouchableNativeFeedback>
    )
  }

  renderOneProfile = (rowData, index) => {
    const { modeInfo } = this.props.screenProps
    return (
      <View key={index} style={{ backgroundColor: modeInfo.backgroundColor }}>
        { index !== 0 && <Text style={{textAlign:'left', color: modeInfo.standardTextColor, padding: 5, paddingLeft: 10, paddingBottom: 0,fontSize: 15}}>第{index}个DLC</Text>}
        <View>
          { this.renderGameHeader(rowData.banner, index) }
          { rowData.list.map((item , index) => this.renderTrophy(item ,index)) }
        </View>
      </View>
    )
  }

  renderAllProfiles = (rowData, index) => {
    const { modeInfo } = this.props.screenProps
    return (
      <View key={index}>
        {
          rowData.map((item , index) => this.renderOneProfile(item, index))
        }
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
      data.push(source.gameInfo)
      renderFuncArr.push(this.renderHeader)
    }
    if (shouldPushData && this.hasPlayer) {
      data.push(source.playerInfo)
      renderFuncArr.push(this.renderPlayer)
    }
    if (shouldPushData) {
      data.push(source.toolbarInfo)
      renderFuncArr.push(this.renderToolbar)
      data.push(source.trophyArr)
      renderFuncArr.push(this.renderAllProfiles)
    }

    this.viewBottomIndex = Math.max(data.length - 1, 0)
    const title = params.rowData.id ? `No.${params.rowData.id}` : (params.title || params.rowData.title)
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
          title={title}
          titleColor={modeInfo.isNightMode ? '#000' : '#fff'}
          style={[styles.toolbar, { backgroundColor: modeInfo.standardColor }]}
          actions={toolbarActions}
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
