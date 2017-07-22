import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  Image,
  Picker,
  Dimensions,
  TouchableNativeFeedback,
  RefreshControl,
  InteractionManager,
  Modal,
  Slider,
  ActivityIndicator,
  FlatList,
  Button
} from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');




import { connect } from 'react-redux';
import { standardColor, nodeColor, idColor } from '../../constant/colorConfig';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { getUserBoardCommentAPI } from '../../dao';
import ComplexComment from '../../component/ComplexComment'

const ds = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1.href !== row2.href,
});

let toolbarActions = [
  { title: '回复', iconName: 'md-create', iconSize: 22, show: 'always' },
];

class UserBoard extends Component {
  static navigationOptions = {
     tabBarLabel: '留言板'
  }
  constructor(props) {
    super(props);
    this.state = {
      data: false,
      commentList: [],
      isLoading: true,
      modalVisible: false,
      sliderValue: 1
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
        return;
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

  componentWillMount = async () => {
    const { screenProps } = this.props
    const name = '留言板'
    let params = {}
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
    this.preFetch();
  }

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
                    handler: componentDidFocus
                  }
                })
              })
            }
            componentDidFocus()
          });
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
    const { URL } = this
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
          ref={flatlist => this.flatlist = flatlist}
          data={this.state.commentList}
          keyExtractor={(item, index) => item.id || index}
          renderItem={({ item, index }) => {
            return this.renderComment(item, index)
          }}
          extraData={this.state}
          windowSize={999}
          renderScrollComponent={props => <NestedScrollView {...props}/>}
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
              alignItems: 'center'
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
                });
              }}
              onPressOut={() => {
                this.float.setNativeProps({
                  style: {
                    elevation: 6
                  }
                });
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


export default UserBoard;
