import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Dimensions,
  TouchableNativeFeedback,
  InteractionManager,
  ActivityIndicator,
  StatusBar,
  Animated,
  Easing,
  FlatList,
  Linking
} from 'react-native'

import Ionicons from 'react-native-vector-icons/Ionicons'
import { standardColor, idColor, accentColor } from '../../constant/colorConfig'
import SimpleComment from '../../component/SimpleComment'
import {
  getTradeTopicAPI as getAPI
} from '../../dao'

import {
  postReply
} from '../../dao/post'

declare var global

let screen = Dimensions.get('window')
const { height: SCREEN_HEIGHT } = screen

let toolbarActions = [
  {
    title: '回复', iconName: 'md-create', iconSize: 22, show: 'always', onPress: function () {
      const { params } = this.props.navigation.state
      if (this.isReplyShowing === true) return
      this.props.navigation.navigate('Reply', {
        type: params.type,
        id: params.rowData.id,
        callback: () => this.preFetch(),
        isOldPage: true,
        shouldSeeBackground: true
      })
      return
    }
  },
  {
    title: '刷新', iconName: 'md-refresh', show: 'never', onPress: function () {
      this.preFetch()
    }
  },
  {
    title: '在浏览器中打开', iconName: 'md-refresh', show: 'never', onPress: function () {
      const { params = {} } = this.props.navigation.state
      Linking.openURL(params.URL).catch(err => global.toast(err.toString()))
    }
  },
  {
    title: '分享', iconName: 'md-share-alt', show: 'never', onPress: function () {
      try {
        const { params } = this.props.navigation.state
        global.Share.open({
          url: params.URL,
          message: '[PSNINE] ' + this.state.data.titleInfo.title,
          title: 'PSNINE'
        }).catch((err) => { err && console.log(err) })
        url && Linking.openURL(url).catch(err => global.toast(err.toString())) || global.toast('暂无出处')
      } catch (err) { }
    }
  }
]

export default class extends Component {

  constructor(props) {
    super(props)
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

  componentWillMount = () => {
    this.preFetch()
  }

  preFetch = () => {
    const { params } = this.props.navigation.state
    this.setState({
      isLoading: true
    })
    InteractionManager.runAfterInteractions(() => {
      const data = getAPI(params.URL).then(data => {

        const html = data.contentInfo.html
        const emptyHTML = '<div></div>'
        this.hasContent = html !== emptyHTML
        this.hasComment = data.commentList.length !== 0
        this.hasReadMore = this.hasComment ? data.commentList[0].isGettingMoreComment === true ? true : false : false
        this.setState({
          data,
          mainContent: html,
          commentList: data.commentList,
          isLoading: false
        })
      })
    })
  }

  handleImageOnclick = (url) => this.props.navigation.navigate('ImageViewer', {
    images: [
      { url }
    ]
  })

  hasContent = false
  renderContent = (html) => {
    const { modeInfo } = this.props.screenProps
    return (
      <View key={'content'} style={{
        elevation: 1,
        margin: 5,
        marginTop: 0,
        backgroundColor: modeInfo.backgroundColor,
        padding: 10
      }}>
        <global.HTMLView
          value={html}
          modeInfo={modeInfo}
          shouldShowLoadingIndicator={true}
          stylesheet={styles}
          imagePaddingOffset={30}
          onImageLongPress={this.handleImageOnclick}
        />
      </View>
    )
  }

  renderTitle = (titleInfo) => {
    const { modeInfo } = this.props.screenProps

    const { params } = this.props.navigation.state
    const nodeStyle = { flex: -1, color: modeInfo.standardTextColor, textAlign: 'center', textAlignVertical: 'center' }
    const textStyle = { flex: -1, color: modeInfo.standardTextColor, textAlign: 'center', textAlignVertical: 'center' }
    const tableStyle = [textStyle, { textAlign: 'center' }]
    const tableDescStyle = [textStyle, { textAlign: 'center', color: modeInfo.titleTextColor }]
    return (
      <View key={'header'} style={{
        flex: 1,
        backgroundColor: modeInfo.backgroundColor,
        elevation: 1,
        margin: 5,
        marginBottom: 0,
        marginTop: 0
      }}>
        <TouchableNativeFeedback
          useForeground={true}

          background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
        >
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-start', padding: 5 }}>

            <View style={{ flex: 1, flexDirection: 'column', padding: 5 }}>
              <View style={{ flex: 1.1, flexDirection: 'row', justifyContent: 'space-between' }}>
                <global.HTMLView
                  value={titleInfo.title}
                  modeInfo={modeInfo}
                  stylesheet={styles}
                  shouldForceInline={true}
                  onImageLongPress={this.handleImageOnclick}
                  imagePaddingOffset={30 + 10}
                />
              </View>
              {/*<Text selectable={false} style={textStyle}>{titleInfo.warning}</Text>*/}
              <View style={{ flex: 1.1, flexDirection: 'column', justifyContent: 'space-between' }}>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                  <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
                    <Text selectable={false} style={tableDescStyle}><Text selectable={false} style={tableStyle}>分类：</Text>{titleInfo.table.slice().shift() || '暂无'}</Text>
                  </View>
                  <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
                    <Text selectable={false} style={tableDescStyle}><Text selectable={false} style={tableStyle}>类型：</Text>{titleInfo.table.slice(1).shift() || '暂无'}</Text>
                  </View>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                  <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
                    <Text selectable={false} style={tableDescStyle}><Text selectable={false} style={tableStyle}>方式：</Text>{titleInfo.table.slice(2).shift() || '暂无'}</Text>
                  </View>
                  <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
                    <Text selectable={false} style={tableDescStyle}><Text selectable={false} style={tableStyle}>地区：</Text>{titleInfo.table.slice(3).shift() || '暂无'}</Text>
                  </View>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                  <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
                    <Text selectable={false} style={tableDescStyle}><Text selectable={false} style={tableStyle}>平台：</Text>{titleInfo.table.slice(4).shift() || '暂无'}</Text>
                  </View>
                  <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
                    <Text selectable={false} style={tableDescStyle}><Text selectable={false} style={tableStyle}>版本：</Text>{titleInfo.table.slice(5).shift() || '暂无'}</Text>
                  </View>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                  <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
                    <Text selectable={false} style={tableDescStyle}><Text selectable={false} style={tableStyle}>语言：</Text>{titleInfo.table.slice(6).shift() || '暂无'}</Text>
                  </View>
                  <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
                    <Text selectable={false} style={tableDescStyle}><Text selectable={false} style={tableStyle}>QQ：</Text>{titleInfo.table.slice(7).shift() || '暂无'}</Text>
                  </View>
                </View>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                  <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }}>
                    <Text selectable={false} style={tableDescStyle}><Text selectable={false} style={tableStyle}>闲鱼：</Text>{titleInfo.table.slice(8).shift() || '暂无'}</Text>
                  </View>
                  <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-around' }} />
                </View>
              </View>
              <global.HTMLView
                value={titleInfo.content}
                modeInfo={modeInfo}
                stylesheet={styles}
                shouldForceInline={true}
                onImageLongPress={this.handleImageOnclick}
                imagePaddingOffset={30 + 10}
              />

              <View style={{ flex: 1.1, flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text selectable={false} style={{ flex: -1, color: modeInfo.accentColor, textAlign: 'center', textAlignVertical: 'center' }} onPress={
                  () => {
                    this.props.navigation.navigate('Home', {
                      title: titleInfo.psnid,
                      id: titleInfo.psnid,
                      URL: `http://psnine.com/psnid/${titleInfo.psnid}`
                    })
                  }
                }>{titleInfo.psnid}</Text>
                <Text selectable={false} style={textStyle}>{titleInfo.date}</Text>
                <Text selectable={false} style={textStyle}>{titleInfo.reply}</Text>
              </View>
            </View>

          </View>
        </TouchableNativeFeedback>
      </View>
    )
  }

  hasComment = false
  hasReadMore = false
  renderComment = (commentList) => {
    const { modeInfo } = this.props.screenProps
    const { navigation } = this.props
    const list = []
    let readMore = null
    for (const rowData of commentList) {
      if (rowData.isGettingMoreComment === false) {
        list.push(
          <SimpleComment key={rowData.id || list.length}  {...{
            navigation,
            rowData,
            modeInfo,
            onLongPress: () => {
              this.onCommentLongPress(rowData)
            },
            index: list.length
          }} />
        )
      } else {
        readMore = (
          <View key={'readmore'} style={{
            backgroundColor: modeInfo.backgroundColor,
            elevation: 1
          }}>
            <TouchableNativeFeedback
              onPress={() => {
                this._readMore(`${this.props.navigation.state.params.URL}/comment?page=1`)
              }}
              useForeground={true}

              background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
            >
              <View pointerEvents='box-only' style={{ flex: 1, flexDirection: 'row', padding: 12 }}>

                <View style={{ flex: 1, flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ flex: 2.5, color: accentColor }}>{'阅读更多评论'}</Text>

                </View>

              </View>
            </TouchableNativeFeedback>
          </View>
        )
      }
    }
    const shouldMarginTop = !this.hasContent
    return (
      <View style={{ marginTop: shouldMarginTop ? 5 : 0 }}>
        {readMore && <View style={{ elevation: 1, margin: 5, marginTop: 0, marginBottom: 5, backgroundColor: modeInfo.backgroundColor }}>{readMore}</View>}
        <View style={{ elevation: 1, margin: 5, marginTop: 0, backgroundColor: modeInfo.backgroundColor }}>
          {list}
        </View>
        {readMore && <View style={{ elevation: 1, margin: 5, marginTop: 0, marginBottom: 5, backgroundColor: modeInfo.backgroundColor }}>{readMore}</View>}
      </View>
    )
  }

  isReplyShowing = false
  onCommentLongPress = (rowData) => {
    if (this.isReplyShowing === true) return
    const { params } = this.props.navigation.state
    const cb = () => {
      this.props.navigation.navigate('Reply', {
        type: params.type,
        id: params.rowData ? params.rowData.id : (params.URL.match(/trade\/(\d+)/) || [0, -1])[1],
        at: rowData.psnid,
        callback: () => this.preFetch(),
        shouldSeeBackground: true
      })
    }
    if (this.state.openVal._value === 1) {
      this._animateToolbar(0, cb)
    } else if (this.state.openVal._value === 0) {
      cb()
    }
  }

  _readMore = (URL) => {
    this.props.navigation.navigate('CommentList', {
      URL
    })
  }

  render() {
    const { params } = this.props.navigation.state
    // console.log('CommunityTopic.js rendered');
    const { modeInfo } = this.props.screenProps
    const { data: source } = this.state
    const data = []
    const renderFuncArr = []
    const shouldPushData = !this.state.isLoading
    if (shouldPushData) {
      data.push(source.titleInfo)
      renderFuncArr.push(this.renderTitle)
    }
    if (shouldPushData && this.hasContent) {
      data.push(this.state.mainContent)
      renderFuncArr.push(this.renderContent)
    }
    if (shouldPushData && this.hasComment) {
      data.push(this.state.commentList)
      renderFuncArr.push(this.renderComment)
    }

    const targetActions = toolbarActions.slice()
    if (shouldPushData && source.titleInfo) {
      source.titleInfo.edit && targetActions.push(
        {
          title: '编辑', iconName: 'md-create', iconSize: 22, show: 'never', onPress: function () {
            const { navigation } = this.props
            navigation.navigate('NewTrade', {
              URL: source.titleInfo.edit
            })
          }
        }
      )
      source.titleInfo.dalao && targetActions.push(
        {
          title: '打捞', iconName: 'md-create', iconSize: 22, show: 'never', onPress: function () {
            const { navigation } = this.props
            // dalao()
            postReply({
              type: 'trade',
              id: source.titleInfo.dalao
            }, 'dalao').then(res => { return res.text() }).then(html => {
              if (html) return global.toast(html.replace(/<(.*?)>/igm, ''))
              return global.toast('已成功打捞')
            }).catch(err => global.toast(err.toString()))
          }
        }
      )
    }

    this.viewBottomIndex = Math.max(data.length - 1, 0)

    return (
      <View
        style={{ flex: 1, backgroundColor: modeInfo.backgroundColor }}
        onStartShouldSetResponder={() => false}
        onMoveShouldSetResponder={() => false}
      >
        <Ionicons.ToolbarAndroid
          navIconName='md-arrow-back'
          overflowIconName='md-more'
          iconColor={modeInfo.isNightMode ? '#000' : '#fff'}
          title={params.title ? params.title : `No.${params.rowData.id}`}
          titleColor={modeInfo.isNightMode ? '#000' : '#fff'}
          style={[styles.toolbar, { backgroundColor: modeInfo.standardColor }]}
          actions={targetActions}
          onIconClicked={() => {
            this.props.navigation.goBack()
          }}
          onActionSelected={(index) => targetActions[index].onPress.bind(this)()}
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
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#F5FCFF'
  },
  toolbar: {
    backgroundColor: standardColor,
    height: 56,
    elevation: 4
  },
  selectedTitle: {
    //backgroundColor: '#00ffff'
    //fontSize: 20
  },
  avatar: {
    width: 50,
    height: 50
  },
  a: {
    fontWeight: '300',
    color: idColor // make links coloured pink
  }
})
