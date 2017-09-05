import React, { Component } from 'react'
import {
  View,
  TouchableNativeFeedback,
  InteractionManager,
  ActivityIndicator,
  FlatList
} from 'react-native'

import Ionicons from 'react-native-vector-icons/Ionicons'
import { getUserBoardCommentAPI } from '../../dao'
import ComplexComment from '../../component/ComplexComment'

let toolbarActions = [
  { title: '回复', iconName: 'md-create', iconSize: 22, show: 'always' }
]

declare var global

class UserBoard extends Component<any, any> {
  static navigationOptions = {
     tabBarLabel: '留言板'
  }
  constructor(props) {
    super(props)
    this.state = {
      data: false,
      commentList: [],
      isLoading: true,
      modalVisible: false,
      sliderValue: 1,
      scrollEnabled: true
    }
  }

  onActionSelected = (index) => {
    const { psnid } = this.props.screenProps

    switch (index) {
      case 0:
        if (this.isReplyShowing === true) return
        const cb = () => {
          this.isReplyShowing = true
          this.props.screenProps.navigation.navigate('Reply', {
            type: 'psnid',
            id: psnid,
            callback: () => {
              this.preFetch()
              this.isReplyShowing = false
            },
            shouldSeeBackground: true
          })
        }
        cb()
        return
      case 1:
        this.preFetch()
        return
    }
  }

  handleImageOnclick = (url) => this.props.screenProps.navigation.navigate('ImageViewer', {
    images: [
      { url }
    ]
  })

  async componentWillMount() {
    const { screenProps } = this.props
    const name = '留言板'
    let params: any = {}
    screenProps.toolbar.forEach(({ text, url}) => {
      if (text === name) {
        params.text = text
        params.URL = url
      }
    })
    if (!params.URL) {
      params = { ...screenProps.toolbar[3] }
    }
    this.URL = params.URL
    this.preFetch()
  }

  URL = ''
  preFetch = () => {
    this.setState({
      isLoading: true
    }, () => {
      InteractionManager.runAfterInteractions(() => {
        getUserBoardCommentAPI(this.URL).then(data => {
          // console.log(data)
          // data.commentList.unshift({ id: 'new' })
          this.setState({
            data,
            commentList: data.commentList,
            isLoading: false
          }, () => {
            const componentDidFocus = () => {
              InteractionManager.runAfterInteractions(() => {
                this.props.screenProps.setToolbar({
                  toolbar: toolbarActions,
                  toolbarActions: this.onActionSelected,
                  componentDidFocus: {
                    index: 3,
                    handler: componentDidFocus,
                    afterSnap: (scrollEnabled) => {
                      const refs = this.flatlist && this.flatlist._listRef && this.flatlist._listRef.getScrollableNode()
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
              })
            }
            componentDidFocus()
          })
        })
      })
    })
  }

  hasComment = false
  renderComment = (rowData, index) => {
    const { modeInfo, navigation } = this.props.screenProps
    // console.log(rowData)
    return (
      <ComplexComment key={rowData.id || index} {...{
        navigation,
        rowData,
        modeInfo,
        onLongPress: () => {},
        preFetch: this.preFetch,
        index
      }} />
    )
  }

  onPress = () => {
    const { psnid } = this.props.screenProps
    this.props.screenProps.navigation.navigate('Reply', {
      type: 'psnid',
      id: psnid,
      callback: () => {
        this.preFetch()
        this.isReplyShowing = false
      },
      shouldSeeBackground: true
    })
  }

  isReplyShowing = false

  render() {
    const { modeInfo } = this.props.screenProps
    // console.log('Message.js rendered');

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
          data={this.state.commentList}
          scrollEnabled={this.state.scrollEnabled}
          keyExtractor={(item, index) => item.id || index}
          renderItem={({ item, index }) => {
            return this.renderComment(item, index)
          }}
          extraData={this.state}
          ref={(list) => this.flatlist = list}
          windowSize={999}
          renderScrollComponent={props => <global.NestedScrollView {...props}/>}
          disableVirtualization={true}
          viewabilityConfig={{
            minimumViewTime: 3000,
            viewAreaCoveragePercentThreshold: 100,
            waitForInteraction: true
          }}
        >
        </FlatList>
        }
        {
          !this.state.isLoading && <View style={{
              position: 'absolute',
              right: 16,
              bottom: 16,
              width: 56,
              height: 56,
              borderRadius: 28,
              justifyContent: 'center',
              alignItems: 'center',
              elevation: 6
            }} ref={float => this.float = float}>
            <TouchableNativeFeedback
              background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
              useForeground={false}
              onPress={this.onPress}
              onPressIn={() => {
                this.float.setNativeProps({
                  style: {
                    elevation: 12
                  }
                })
              }}
              onPressOut={() => {
                this.float.setNativeProps({
                  style: {
                    elevation: 6
                  }
                })
              }}>
              <View pointerEvents='box-only' style={{
                backgroundColor: modeInfo.accentColor,
                borderRadius: 28, width: 56, height: 56, flex: -1, justifyContent: 'center', alignItems: 'center'
              }}>
                <Ionicons name='md-create' size={22} color={modeInfo.backgroundColor}/>
              </View>
            </TouchableNativeFeedback>
          </View>
        }
      </View>
    )
  }

  float: any = false

}

export default UserBoard
