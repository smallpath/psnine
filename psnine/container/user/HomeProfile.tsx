import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableNativeFeedback,
  ActivityIndicator,
  Animated,
  FlatList
} from 'react-native'

import UserGameItem from '../../component/UserGameItem'
import {
  standardColor,
  idColor
} from '../../constant/colorConfig'

declare var global

export default class Home extends Component<any, any> {
  static navigationOptions = {
     tabBarLabel: '主页'
  }
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      rotation: new Animated.Value(1),
      scale: new Animated.Value(1),
      opacity: new Animated.Value(1),
      openVal: new Animated.Value(0),
      modalVisible: false,
      modalOpenVal: new Animated.Value(0),
      topicMarginTop: new Animated.Value(0),
      scrollEnabled: true
    }
  }

  flatlist: any
  componentWillMount() {
    this.props.screenProps.setToolbar({
      componentDidFocus: {
        index: 0,
        handler: () => {},
        afterSnap: (scrollEnabled) => {
          const refs = this.flatlist && this.flatlist._listRef && this.flatlist._listRef._scrollRef.getScrollResponder()
          if (refs && refs.setNativeProps) {
            refs.setNativeProps({
              scrollEnabled
            })
          } else {
            this.setState({ scrollEnabled })
          }
        }
      }
    })
  }

  handleImageOnclick = (url) => this.props.navigation.navigate('ImageViewer', {
    images: [
      { url }
    ]
  })

  ITEM_HEIGHT = 83

  renderGameItem = (rowData) => {
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
              type: res.url.includes('gene') ? 'gene' : 'community' // todo
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
            <global.HTMLView
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
                flex: 2,
                textAlign: 'left',
                textAlignVertical: 'center',
                color: modeInfo.standardTextColor }}>{rowData.psnid}</Text>
            <Text
              style={{
                flex: 1,
                textAlign: 'left',
                textAlignVertical: 'center',
                color: modeInfo.standardTextColor }}>{rowData.date}</Text>
            <Text
              style={{
                flex: 1,
                textAlign: 'left',
                textAlignVertical: 'center',
                color: modeInfo.standardTextColor }}>{rowData.count}</Text>
          </View>
        </View>
      </TouchableNativeFeedback>
    )
  }

  render() {
    // console.log('GamePage.js rendered');
    const { modeInfo, gameTable, diaryTable } = this.props.screenProps
    let data = []
    let renderFunc: any = () => null
    if (gameTable.length !== 0) {
      data = gameTable
      renderFunc = this.renderGameItem
    }
    if (diaryTable.length !== 0) {
      data = diaryTable
      renderFunc = this.renderDiary
    }

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
          data={data}
          ref={(list) => this.flatlist = list}
          scrollEnabled={this.state.scrollEnabled}
          keyExtractor={(item, index) => item.href || index}
          renderItem={({ item, index }) => {
            return renderFunc(item, index)
          }}
          extraData={this.state}
          windowSize={999}
          renderScrollComponent={props => <global.NestedScrollView {...props}/>}
          key={modeInfo.themeName}
          numColumns={diaryTable.length ? 1 : modeInfo.numColumns}
          removeClippedSubviews={false}
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
    // backgroundColor: '#00ffff'
    // fontSize: 20
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