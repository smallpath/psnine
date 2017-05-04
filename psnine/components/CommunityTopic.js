import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  Image,
  DrawerLayoutAndroid,
  ToolbarAndroid,
  ToastAndroid,
  BackAndroid,
  TouchableOpacity,
  Dimensions,
  TouchableNativeFeedback,
  RefreshControl,
  WebView,
  KeyboardAvoidingView,
  TouchableHighlight,
  InteractionManager,
  ActivityIndicator,
  StatusBar,
  TouchableWithoutFeedback,
  Animated,
  Easing,
  FlatList,
  ScrollView
} from 'react-native';

import HTMLView from './htmlToView';
import CommentList from './CommentList'
import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { standardColor, nodeColor, idColor, accentColor  } from '../config/colorConfig';

import { getTopicAPI, getTopicContentAPI, getTopiCommentSnapshotAPI } from '../dao/dao'
import ImageViewer from './imageViewer'
import Reply from './new/Reply'

let screen = Dimensions.get('window');
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = screen;

let toolbarActions = [
  {title: '回复', iconName: 'md-create', show: 'always'},
  {title: '收藏', iconName: 'md-star' ,show: 'always'},
  {title: '感谢', iconName: 'md-thumbs-up', show: 'never'},
  {title: '分享', show: 'never' },
];
let title = "TOPIC";
let WEBVIEW_REF = `WEBVIEW_REF`;

let toolbarHeight = 56;
let releasedMarginTop = 0;
let config = {tension: 30, friction: 7, ease: Easing.in(Easing.ease(1,0,1,1)), duration: 200};
const timeout = 190
const delay = 50

class CommunityTopic extends Component {

  constructor(props){
    super(props);
    this.state = {
      data: false,
      isLoading: true,
      mainContent: false,
      rotation: new Animated.Value(1),
      scale: new Animated.Value(1),
      opacity: new Animated.Value(1),
      openVal: new Animated.Value(0)
    }
  }

  _refreshComment = () => {
    if (this.state.isLoading === true) {
      return
    }
    this.setState({
      isLoading: true
    })
    getTopiCommentSnapshotAPI(this.props.URL).then(data => {
      this.setState({
        isLoading: false,
        commentList: data.commentList
      })
    })
  }

  _onActionSelected = (index) => {
    switch(index){
      case 0 :
        this._animateToolbar(0, () => {
          this.props.navigator.push({
            component: Reply,
            withoutAnimation: true,
            shouldForbidPressNew: true,
            params: {
              type: this.props.type,
              id: this.props.rowData.id,
              callback: this._refreshComment
            }
          })
        }, true)
        return;
      case 1 :
        this._refreshComment()
        return
      case 2 :
        return;
      case 3 :
        return;
    }
  }

  componentWillMount = () => {
    InteractionManager.runAfterInteractions(() => {
      const data =  getTopicAPI(this.props.URL).then(data => {

        const content = data.contentInfo.html
        const html = this.props.type !== 'gene' ? content : content.replace('<div>', '<div align="center">')
        const emptyHTML = this.props.type !== 'gene' ? '<div></div>' : '<div align="center"></div>'
        this.hasContent = html !== emptyHTML
        this.hasGameTable = data.contentInfo.gameTable.length !== 0
        this.hasComment = data.commentList.length !== 0
        this.hasReadMore = this.hasComment ? data.commentList[0].isGettingMoreComment === true ? true : false : false
        this.hasPage = data.contentInfo.page.length !== 0
        this.setState({
          data,
          mainContent: html,
          commentList: data.commentList,
          isLoading: false
        })
      })
    });
  }

  handleImageOnclick = (url) => this.props.navigator.push({
    component: ImageViewer,
    params: {
      images: [
        { url }
      ]
    }
  })

  renderHeader = (titleInfo) => {
    const nodeStyle = { flex: -1, color: this.props.modeInfo.standardTextColor,textAlign : 'center', textAlignVertical: 'center' }
    const textStyle = { flex: -1, color: this.props.modeInfo.standardTextColor,textAlign : 'center', textAlignVertical: 'center' }
    const isNotGene = this.props.type !== 'gene'
    const shouldRenderAvatar = isNotGene && !!(this.props.rowData && this.props.rowData.avatar)
    return (
      <View key={'header'} style={{
            flex: 1,              
            backgroundColor: this.props.modeInfo.backgroundColor,
            elevation: 1,
            margin: 5,
            marginBottom: 0,
            marginTop: 0
        }}>
        <TouchableNativeFeedback  
          useForeground={true}
          delayPressIn={100}
          background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
          >
          <View style={{ flex: 1, flexDirection: 'row', justifyContent:'center', alignItems: 'center' ,padding: 5 }}>
            { shouldRenderAvatar && <Image
              source={{ uri: this.props.rowData.avatar.replace('@50w.png', '@75w.png') }}
              style={{ width: 75, height: 75}}
              />
            }

            <View style={{ flex: 1, flexDirection: 'column', padding: 5}}>
              <HTMLView
                value={titleInfo.title}
                modeInfo={ this.props.modeInfo }
                stylesheet={styles}
                onLinkPress={this.handleImageOnclick}
                imagePaddingOffset={shouldRenderAvatar ? 30 + 75 + 10 : 30}
              />

              <View style={{ flex: 1.1, flexDirection: 'row', justifyContent :'space-between' }}>
                <Text selectable={false} style={{ flex: -1, color: idColor,textAlign : 'center', textAlignVertical: 'center' }}>{titleInfo.psnid}</Text>
                <Text selectable={false} style={textStyle}>{titleInfo.date}</Text>
                <Text selectable={false} style={textStyle}>{titleInfo.reply}</Text>
              </View>
            </View>

          </View>
        </TouchableNativeFeedback>
      </View>
    )
  }

  hasContent = false
  renderContent = (html) => {
    return (
      <View key={'content'} style={{             
            elevation: 1,
            margin: 5,
            marginTop: 0,
            backgroundColor: this.props.modeInfo.backgroundColor,
            padding: 10
        }}>
        <HTMLView
          value={html}
          modeInfo={ this.props.modeInfo }
          shouldShowLoadingIndicator={true}
          stylesheet={styles}
          imagePaddingOffset={30}
          onLinkPress={this.handleImageOnclick}
        />
      </View>
    )
  }

  hasGameTable = false
  renderGameTable = (gameTable) => {
    const list = []
    for (const rowData of gameTable) {
      list.push(
        <View key={ rowData.id } style={{              
              backgroundColor: this.props.modeInfo.backgroundColor
          }}>
          <TouchableNativeFeedback
            onPress ={()=>{

            }}
            useForeground={true}
            delayPressIn={100}
            background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
            >
            <View pointerEvents='box-only' style={{ flex: 1, flexDirection: 'row',  padding: 12 }}>
              <Image
                source={{ uri: rowData.avatar }}
                style={[styles.avatar, { width: 91 }]}
                />                

              <View style={{ marginLeft: 10, flex: 1, flexDirection: 'column'}}>
                <Text
                  ellipsizeMode={'tail'}
                  numberOfLines={3}
                  style={{ flex: 2.5,color: this.props.modeInfo.titleTextColor, }}>
                  {rowData.title}
                </Text>

                <View style={{ flex: 1.1, flexDirection: 'row', justifyContent :'space-between' }}>
                  <Text selectable={false} style={{ flex: -1, color: idColor,textAlign : 'center', textAlignVertical: 'center' }}>{rowData.platform}</Text>
                  <Text selectable={false} style={{ flex: -1, color: this.props.modeInfo.standardTextColor,textAlign : 'center', textAlignVertical: 'center' }}>{rowData.region}</Text>
                  <Text selectable={false} style={{ flex: -1, color: this.props.modeInfo.standardTextColor,textAlign : 'center', textAlignVertical: 'center' }}>{
                    rowData.platium + rowData.gold + rowData.selver + rowData.bronze
                  }</Text>
                </View>

              </View>

            </View>
          </TouchableNativeFeedback>
        </View>
      )
    }
    return (
      <View style={{elevation: 1, margin: 5, marginTop: 0, backgroundColor:this.props.modeInfo.backgroundColor }}>
        { list }
      </View>
    )
  }

  hasComment = false
  hasReadMore = false
  renderComment = (commentList) => {
    const list = []
    let readMore = null
    for (const rowData of commentList) {
      if (rowData.isGettingMoreComment === false) {
        list.push(
          <View key={ rowData.id } style={{              
                backgroundColor: this.props.modeInfo.backgroundColor,
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderBottomColor: this.props.modeInfo.brighterLevelOne
            }}>
            <TouchableNativeFeedback  
              onPress ={()=>{
                
              }}
              useForeground={true}
              delayPressIn={100}
              background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
              >
              <View style={{ flex: 1, flexDirection: 'row',  padding: 12 }}>
                <Image
                  source={{ uri: rowData.img }}
                  style={styles.avatar}
                  />

                <View style={{ marginLeft: 10, flex: 1, flexDirection: 'column'}}>
                  <HTMLView
                    value={rowData.content}
                    modeInfo={ this.props.modeInfo }
                    stylesheet={styles}
                    onLinkPress={this.handleImageOnclick}
                    imagePaddingOffset={30 + 75 + 10}
                  />

                  <View style={{ flex: 1.1, flexDirection: 'row', justifyContent :'space-between' }}>
                    <Text selectable={false} style={{ flex: -1, color: idColor ,textAlign : 'center', textAlignVertical: 'center' }}>{rowData.psnid}</Text>
                    <Text selectable={false} style={{ flex: -1, color: this.props.modeInfo.standardTextColor,textAlign : 'center', textAlignVertical: 'center' }}>{rowData.date}</Text>
                  </View>

                </View>

              </View>
            </TouchableNativeFeedback>
          </View>
        )
      } else {
        readMore = (
          <View key={ 'readmore' } style={{              
                backgroundColor: this.props.modeInfo.backgroundColor,
                elevation: 1
            }}>
            <TouchableNativeFeedback  
              onPress ={()=>{
                this._readMore(`${this.props.URL}/comment?page=1`)
              }}
              useForeground={true}
              delayPressIn={100}
              background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
              >
              <View pointerEvents='box-only' style={{ flex: 1, flexDirection: 'row',  padding: 12 }}>

                <View style={{ flex: 1, flexDirection: 'column', justifyContent:'center', alignItems: 'center'}}>
                  <Text style={{ flex: 2.5,color: accentColor}}>{'阅读更多评论'}</Text>

                </View>

              </View>
            </TouchableNativeFeedback>
          </View>
        )
      }
    }
    const shouldMarginTop = !this.hasContent && !this.hasGameTable && !this.hasPage
    return (
      <View style={{ marginTop: shouldMarginTop ? 5 : 0 }}>
        { readMore &&<View style={{elevation: 1, margin: 5, marginTop: 0, marginBottom: 5, backgroundColor:this.props.modeInfo.backgroundColor }}>{ readMore }</View> } 
        <View style={{elevation: 1, margin: 5, marginTop: 0, backgroundColor:this.props.modeInfo.backgroundColor }}>
          { list }
        </View>
        { readMore &&<View style={{elevation: 1, margin: 5, marginTop: 0, marginBottom: 5, backgroundColor:this.props.modeInfo.backgroundColor }}>{ readMore }</View> }
      </View>
    )
  }

  _readMore = (URL) => {
    this.props.navigator.push({
      component: CommentList,
      params: {
        URL
      }
    })
  }

  hasPage = false
  renderPage = (page) => {
    const list = [] 
    for (const item of page) {
      const thisJSX = (
        <TouchableNativeFeedback key={item.url} onPress={() => {
            if (this.state.isLoading === true) {
              return
            }
            this.setState({
              isLoading: true
            })
            getTopicContentAPI(item.url).then(data => {
              this.setState({
                mainContent: data.contentInfo.html,
                isLoading: false
              })
            })
          }}>
          <View style={{flex: -1, padding: 2}}>
            <Text style={{color: idColor}}>{item.text}</Text>
          </View>
        </TouchableNativeFeedback>
      )
      list.push(thisJSX)
    }
    return (
      <View style={{elevation: 1,margin: 5, marginTop: 0, marginBottom: 0, backgroundColor:this.props.modeInfo.backgroundColor}}>
        <View style={{
            elevation: 2,
            margin: 5,
            backgroundColor:this.props.modeInfo.backgroundColor,
            padding: 5
          }}>
          { list }
        </View>
      </View>
    )
  }
  viewTopIndex = 0
  viewBottomIndex = 0
  render() {
    // console.log('CommunityTopic.js rendered');
    const { data: source } = this.state 
    const data = []
    const renderFuncArr = []
    const shouldPushData = !this.state.isLoading
    if (shouldPushData) {
      data.push(source.titleInfo)
      renderFuncArr.push(this.renderHeader)
    }
    if (shouldPushData && this.hasPage) {
      data.push(source.contentInfo.page)
      renderFuncArr.push(this.renderPage)
    }
    if (shouldPushData && this.hasContent) {
      data.push(this.state.mainContent)
      renderFuncArr.push(this.renderContent)
    }
    if (shouldPushData && this.hasGameTable) {
      data.push(source.contentInfo.gameTable)
      renderFuncArr.push(this.renderGameTable)
    }
    if (shouldPushData && this.hasComment) {
      data.push(this.state.commentList)
      renderFuncArr.push(this.renderComment)

    }

    this.viewBottomIndex = Math.max(data.length - 1, 0)

    return ( 
          <View 
            style={{flex:1, backgroundColor: this.props.modeInfo.backgroundColor}}
            onStartShouldSetResponder={() => false}
            onMoveShouldSetResponder={() => false}
            >
              <Ionicons.ToolbarAndroid
                navIconName="md-arrow-back"
                overflowIconName="md-more"                 
                iconColor={this.props.modeInfo.isNightMode ? '#000' : '#fff'}
                title={`No.${this.props.rowData.id}`}
                titleColor={this.props.modeInfo.isNightMode ? '#000' : '#fff'}
                style={[styles.toolbar, {backgroundColor: this.props.modeInfo.standardColor}]}
                actions={toolbarActions}
                onIconClicked={() => {
                  this.props.navigator.pop()
                }}
                onActionSelected={this._onActionSelected}
              />
              { this.state.isLoading && (
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
              { this.props.type === 'community' && !this.state.isLoading && this.renderToolbar() }
              { !this.state.isLoading && <FlatList style={{
                flex: -1,
                backgroundColor: this.props.modeInfo.standardColor
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


  renderToolbarItem = (props, index, maxLength) => (
    <Animated.View 
        ref={float => this[`float${index}`] = float}
        collapsable ={false}
        key={index}
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          backgroundColor: this.props.modeInfo.accentColor,
          position:'absolute',
          bottom: props.openVal.interpolate({inputRange: [0, 1], outputRange: [24,  56 + 10 + 16 * 2 + index * 50]}),
          right: 24,
          elevation: 1,
          zIndex: 1,
          opacity: 1
      }}>
      <TouchableNativeFeedback 
        onPress={() => this.pressToolbar(maxLength - index - 1)}
        background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
        onPressIn={()=>{
          this.float1.setNativeProps({
            style :{
            elevation: 12,
          }});
        }}
        onPressOut={()=>{
          this.float1.setNativeProps({
            style :{
            elevation: 6,
          }});
        }}
        style={{
          width: 40,
          height: 40,
          borderRadius: 20,
          flex:1,
          zIndex: 1,
          backgroundColor: accentColor,
        }}>
        <View style={{borderRadius: 20,width: 40,height: 40,justifyContent: 'center',alignItems: 'center',}}>
          <Ionicons name={props.iconName} size={20} color='#fff'/>
        </View>
      </TouchableNativeFeedback>
    </Animated.View>
  )

  renderToolbar = () => {
    const { openVal } = this.state
    const tipHeight =  toolbarHeight * 0.8
    const list = []
    const iconNameArr = ["md-arrow-down", "md-arrow-up"]
    for (let i=0; i<iconNameArr.length; i++) {
      list.push(
        this.renderToolbarItem({
          iconName: iconNameArr[i],
          openVal: openVal
        }, i, iconNameArr.length)
      )
    }
    return (
      <View style={{position: 'absolute', left:0, top:0, width:SCREEN_WIDTH, height:SCREEN_HEIGHT - toolbarHeight / 2}}>
        { list }
        <Animated.View 
            ref={float=>this.float=float}
            collapsable ={false}
            style={{
              width: 56,
              height: 56,
              borderRadius: 30,
              backgroundColor: accentColor,
              position:'absolute',
              bottom: 16,
              right: 16,
              elevation: 6 ,
              zIndex: 1,
              opacity: this.state.opacity,
              transform: [{
                rotateZ: this.state.rotation.interpolate({
                  inputRange: [0, 1],
                  outputRange: ['0deg', '360deg']
                }),
              }]
          }}>
          <TouchableNativeFeedback 
            onPress={this.pressNew}
            background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
            onPressIn={()=>{
              this.float.setNativeProps({
                style :{
                elevation: 12,
              }});
            }}
            onPressOut={()=>{
              this.float.setNativeProps({
                style :{
                elevation: 6,
              }});
            }}
            style={{
              width: 56,
              height: 56,
              borderRadius: 30,
              flex:1,
              zIndex: 1,
              backgroundColor: accentColor,
            }}>
            <View style={{borderRadius: 30,width: 56,height: 56,flex:-1,justifyContent: 'center',alignItems: 'center',}}>
              <Ionicons name="ios-add" size={40} color='#fff'/>
            </View>
          </TouchableNativeFeedback>
        </Animated.View>
      </View>
      )
  }

  index = 0

  pressToolbar = index => {
    const target = index === 0 ? this.viewTopIndex : this.viewBottomIndex
    this.flatlist && this.flatlist.scrollToIndex({animated: true, viewPosition: 0, index: target})
  }

  _animateToolbar = (value, cb) => {
    const ratationPreValue = this.state.rotation._value

    const rotationValue = value === 0 ? 0 : ratationPreValue + 3/8
    const scaleAnimation = Animated.timing(this.state.rotation, {toValue: rotationValue, ...config})
    const moveAnimation = Animated.timing(this.state.openVal, {toValue: value, ...config})
    const target = [
      moveAnimation
    ]
    if (value !== 0 || value !== 1) target.unshift(scaleAnimation)

    const type = value === 1 ? 'sequence' : 'parallel'
    Animated[type](target).start()
    setTimeout(() => {
      typeof cb === 'function' && cb()
    }, 200)
  }  

  pressNew = (cb) => {
    if (this.state.openVal._value === 0) {
      this._animateToolbar(1, cb)
    } else {
      this._animateToolbar(0, cb)
    }
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
  selectedTitle:{
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