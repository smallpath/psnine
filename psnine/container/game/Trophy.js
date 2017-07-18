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
  Keyboard,
  Linking,
  TextInput,
  Button
} from 'react-native';

import HTMLView from '../../components/HtmlToView';
import MyDialog from '../../components/Dialog';
import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { standardColor, nodeColor, idColor, accentColor } from '../../constants/colorConfig';
import ComplexComment from '../shared/ComplexComment'

import {
  getTrophyAPI
} from '../../dao'

import {
  translate
} from '../../dao/post'

let screen = Dimensions.get('window');
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = screen;

let toolbarActions = [
  { title: '回复', iconName: 'md-create', show: 'always', iconSize: 22 },
  { title: '刷新', iconName: 'md-refresh', show: 'always' },
];
let title = "TOPIC";
let WEBVIEW_REF = `WEBVIEW_REF`;

let toolbarHeight = 56;
let releasedMarginTop = 0;

const ACTUAL_SCREEN_HEIGHT = SCREEN_HEIGHT - StatusBar.currentHeight + 1;

let CIRCLE_SIZE = 56;
let config = { tension: 30, friction: 7, ease: Easing.in(Easing.ease(1, 0, 1, 1)), duration: 200 };

class CommunityTopic extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: false,
      isLoading: true,
      mainContent: false,
      title: '',
      content: '',
      rotation: new Animated.Value(1),
      scale: new Animated.Value(1),
      opacity: new Animated.Value(1),
      openVal: new Animated.Value(0),
      modalVisible: false,
      modalOpenVal: new Animated.Value(0),
      topicMarginTop: new Animated.Value(0)
    }
  }

  _refreshComment = () => {
    const { params } = this.props.navigation.state
    if (['community', 'gene'].includes(params.type) === false) {
      return
    }
    if (this.isReplyShowing === true) {
      this.isReplyShowing = false
    }
    if (this.state.isLoading === true) {
      return
    }
    this.setState({
      isLoading: true
    })
    getTopicCommentSnapshotAPI(params.URL).then(data => {
      this.setState({
        isLoading: false,
        commentList: data.commentList
      })
    })
  }

  _onActionSelected = (index) => {
    const { params } = this.props.navigation.state
    switch (index) {
      case 0:
        if (this.isReplyShowing === true) return
        const cb = () => {
          this.props.navigation.navigate('Reply', {
            type: params.type,
            id: params.rowData.id,
            callback: this.preFetch,
            isOldPage: this.state.data.isOldPage,
            shouldSeeBackground: true
          })
        }
        if (this.state.openVal._value === 1) {
          this._animateToolbar(0, cb)
        } else if (this.state.openVal._value === 0) {
          cb()
        }
        return;
      case 1:
        this.preFetch()
        return
    }
  }

  componentWillMount = () => {
    this.preFetch()
  }

  preFetch = () => {
    this.setState({
      isLoading: true
    })
    const { params } = this.props.navigation.state
    InteractionManager.runAfterInteractions(() => {
      const data = getTrophyAPI(params.URL).then(data => {
        this.hasComment = data.commentList.length !== 0
        this.setState({
          data,
          commentList: data.commentList,
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


  shouldComponentUpdate = (nextProp, nextState) => {
    return true
  }

  renderHeader = (rowData) => {
    const { modeInfo } = this.props.screenProps
    return (
      <View style={{
        backgroundColor: modeInfo.backgroundColor,
        elevation: 2,
        height: 74,
      }}>
        <TouchableNativeFeedback
          onPress={() => {
            if (rowData.url) {
              this.props.navigation.navigate('GamePage', {
                // URL: 'http://psnine.com/psngame/5424?psnid=Smallpath',
                URL: rowData.url,
                title: rowData.title,
                rowData,
                type: 'game'
              })
            }
          }}
          useForeground={true}
          
          background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
        >
          <View style={{ flex: 1, flexDirection: 'row', padding: 12 }}>
            <Image
              source={{ uri: rowData.avatar }}
              style={[styles.avatar, { width: 54, height: 54 }]}
            />

            <View style={{ marginLeft: 10, flex: 1, flexDirection: 'column' }}>
              <Text
                style={{ flex: 1, color: modeInfo.titleTextColor, }}>
                {rowData.title}
              </Text>

              <Text selectable={false} numberOfLines={1} style={{ flex: -1, color: modeInfo.standardTextColor}}>{rowData.text}</Text>

            </View>
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              <Text onPress={() => {
                  this.setState({
                    modalVisible: true
                  })
                }} style={{ backgroundColor: '#f2c230', color: modeInfo.reverseModeInfo.titleTextColor, padding: 5, paddingHorizontal: 8}}>翻译</Text>
            </View>
          </View>
        </TouchableNativeFeedback>
      </View>
    )
  }

  renderGame = (rowData) => {
    const { modeInfo } = this.props.screenProps
    return (
    <View style={{
        backgroundColor: modeInfo.backgroundColor,
        elevation: 1, margin: 5, marginTop: 0,
      }}>
        <TouchableNativeFeedback
          onPress={() => {

          }}
          useForeground={true}
          
          background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
        >
          <View pointerEvents='box-only' style={{ flex: 1, flexDirection: 'row', padding: 12 }}>
            <Image
              source={{ uri: rowData.avatar }}
              style={[styles.avatar, { width: 91 }]}
            />

            <View style={{ marginLeft: 10, flex: 1, flexDirection: 'column' }}>
              <Text
                ellipsizeMode={'tail'}
                numberOfLines={3}
                style={{ flex: 2.5, color: modeInfo.titleTextColor, }}>
                {rowData.title}
              </Text>

              <View style={{ flex: 1.1, flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text selectable={false} style={{ flex: -1, color: modeInfo.standardTextColor, textAlign: 'center', textAlignVertical: 'center' }}>{rowData.platform.join(' ')}</Text>
              </View>

            </View>

          </View>
        </TouchableNativeFeedback>
      </View>
    )
  }

  hasComment = false


  isReplyShowing = false
  
  renderComment = (rowData, index) => {
    const { modeInfo } = this.props.screenProps
    const { navigation } = this.props
    const { preFetch } = this
    return (<ComplexComment key={rowData.id || index} {...{
      navigation,
      modeInfo,
      onLongPress: () => {},
      preFetch,
      rowData
    }}/>)
  }


  focusNextField = (nextField) => {
    this[nextField] && this[nextField].focus();
  }

  submit = () => {
    const { params } = this.props.navigation.state
    
    const tid = (params.URL || '').split('/').pop()
    translate({
      title: this.state.title,
      detail: this.state.content,
      tid,
      cn: ''
    }).then(res => res.text()).then(html => {
      if (html.includes('玩脱了')) {
        const arr = html.match(/\<title\>(.*?)\<\/title\>/)
        if (arr && arr[1]) {
          const msg = `翻译失败: ${arr[1]}`
          global.toast(msg)
          return
        }
      }
      toast('翻译成功')
      this.setState({
        modalVisible: false
      })
      this.preFetch()
    }).catch(err => toast('翻译失败: ' + err.toString()))
  }

  viewTopIndex = 0
  viewBottomIndex = 0
  render() {
    const { params } = this.props.navigation.state

    const { modeInfo } = this.props.screenProps
    const { data: source } = this.state
    const data = []
    const renderFuncArr = []
    const shouldPushData = !this.state.isLoading
    // if (shouldPushData) {
    //   data.push(source.trophyInfo)
    //   renderFuncArr.push(this.renderHeader)
    //   data.push(source.gameInfo)
    //   renderFuncArr.push(this.renderGame)
    // }

    if (shouldPushData && this.hasComment) {

      renderFuncArr.push(this.renderComment)
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
            color={modeInfo.accentColor}
            size={50}
          />
        )}
        {!this.state.isLoading && this.renderHeader(source.trophyInfo)}
        {!this.state.isLoading && <FlatList style={{
          flex: -1,
          backgroundColor: modeInfo.standardColor
        }}
          ref={flatlist => this.flatlist = flatlist}
          data={this.state.commentList}
          keyExtractor={(item, index) => item.id || index}
          renderItem={({ item, index }) => {
            return this.renderComment(item, index)
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
        { this.state.modalVisible && (
          <MyDialog modeInfo={this.props.modeInfo}
            modalVisible={this.state.modalVisible}
            onDismiss={() => this.setState({modalVisible: false})}
            onRequestClose={() => this.setState({modalVisible: false})}
            renderContent={() => (
              <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: modeInfo.backgroundColor,
                paddingVertical: 20,
                paddingHorizontal: 20,
                position: 'absolute',
                left: 30,
                right: 30,
                elevation: 4,
                opacity: 1
              }} borderRadius={2}>
                <Text style={{color: modeInfo.standardTextColor}}>为了更好的帮助他人，奖杯翻译请严格遵循 <Text 
                  style={{color: modeInfo.accentColor}} 
                    onPress={() => this.setState({ modalVisible: false}, () => Linking.openURL('p9://psnine.com/topic/1317'))}>「翻译」使用全指南</Text></Text>
                 <View style={{ flexDirection: 'row'}}>
                  <TextInput placeholder="奖杯标题（对奖杯标题文字的翻译）"
                    autoCorrect={false}
                    multiline={false}
                    keyboardType="default"
                    returnKeyType='go'
                    returnKeyLabel='go'
                    blurOnSubmit={true}
                    numberOfLines={1}
                    ref={ref => this.title = ref}
                    onSubmitEditing={() => this.focusNextField('content')}
                    onChange={({ nativeEvent }) => { this.setState({ title: nativeEvent.text }) }}
                    value={this.state.title}
                    style={[styles.textInput, {
                      color: modeInfo.titleTextColor,
                      textAlign: 'left',
                      textAlignVertical: 'center',
                      flex: 1,
                      backgroundColor: modeInfo.brighterLevelOne,
                      marginBottom: 2
                    }]}
                    placeholderTextColor={modeInfo.standardTextColor}
                    // underlineColorAndroid={accentColor}
                    underlineColorAndroid='rgba(0,0,0,0)'
                  />
                </View>
                <View style={{flexDirection: 'row'}}>
                  <TextInput placeholder="奖杯说明（不是奖杯攻略，是对奖杯说明文字的翻译）"
                    autoCorrect={false}
                    multiline={true}
                    keyboardType="default"
                    blurOnSubmit={true}
                    numberOfLines={4}
                    ref={ref => this.content = ref}
                    onChange={({ nativeEvent }) => { this.setState({ content: nativeEvent.text }) }}
                    value={this.state.content}
                    style={[styles.textInput, {
                      color: modeInfo.titleTextColor,
                      flex: 2,
                      marginBottom: 2,
                      backgroundColor: modeInfo.brighterLevelOne
                    }]}
                    placeholderTextColor={modeInfo.standardTextColor}
                    // underlineColorAndroid={accentColor}
                    underlineColorAndroid='rgba(0,0,0,0)'
                  />
                </View> 
                <Button title='提交' onPress={() => this.submit()} color={modeInfo.standardColor}/>
              </View>
            )} />
        )}
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


export default CommunityTopic