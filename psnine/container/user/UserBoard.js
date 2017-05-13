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
  FlatList
} from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

import MyDialog from '../../components/Dialog'

import HTMLView from '../../components/HtmlToView';
import { connect } from 'react-redux';
import { standardColor, nodeColor, idColor } from '../../constants/colorConfig';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { getUserBoardCommentAPI } from '../../dao';

const ds = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1.href !== row2.href,
});

let toolbarActions = [
  { title: '回复', iconName: 'md-create', show: 'always' },
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
    const params = {}
    screenProps.toolbar.forEach(({ text, url}) => {
      if (text === name) {
        params.text = text
        params.URL = url
      }
    })
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
                    index: 2,
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

  renderSonComment = (list, parentRowData) => {
    const { modeInfo } = this.props.screenProps
    const result = list.map((rowData, index) => {
      return (
        <View key={rowData.id || index} style={{
            backgroundColor: modeInfo.brighterLevelOne,
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderTopWidth: StyleSheet.hairlineWidth,
            borderBottomColor: modeInfo.backgroundColor,
            borderTopColor: modeInfo.backgroundColor,
            padding: 5,
        }}>
          <Text
            useForeground={true}
            delayPressIn={100}
            onPress={() => {
              this.onCommentLongPress(parentRowData, rowData.psnid)
            }}
            background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
          >
            <HTMLView
              value={rowData.text}
              modeInfo={modeInfo}
              stylesheet={styles}
              onImageLongPress={this.handleImageOnclick}
              imagePaddingOffset={30 + 75 + 10}
              shouldForceInline={true}
            />

          </Text>
        </View>
      )
    })
    return result
  }

  hasComment = false
  renderComment = (rowData, index) => {
    const { modeInfo } = this.props.screenProps
    return (
      <View key={rowData.id} style={{
        backgroundColor: modeInfo.backgroundColor,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: modeInfo.brighterLevelOne
      }}>
        <TouchableNativeFeedback
          onLongPress={() => {
            this.onCommentLongPress(rowData)
          }}
          useForeground={true}
          delayPressIn={100}
          background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
        >
          <View style={{ flex: 1, flexDirection: 'row', padding: 12 }}>
            <Image
              source={{ uri: rowData.avatar }}
              style={styles.avatar}
            />

            <View style={{ marginLeft: 10, flex: 1, flexDirection: 'column' }}>
              <HTMLView
                value={rowData.text}
                modeInfo={modeInfo}
                stylesheet={styles}
                onImageLongPress={this.handleImageOnclick}
                imagePaddingOffset={30 + 75 + 10}
                shouldForceInline={true}
              />

              <View style={{ flex: 1.1, flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text selectable={false} style={{ flex: -1, color: idColor, textAlign: 'center', textAlignVertical: 'center' }} onPress={
                  () => {
                    this.props.navigation.navigate('Home', {
                      title: rowData.psnid,
                      id: rowData.psnid,
                      URL: `http://psnine.com/psnid/${rowData.psnid}`
                    })
                  }
                }>{rowData.psnid}</Text>
                <Text selectable={false} style={{ flex: -1, color: modeInfo.standardTextColor, textAlign: 'center', textAlignVertical: 'center' }}>{rowData.date}</Text>
              </View>

              { rowData.commentList.length !== 0 && (<View style={{ backgroundColor: modeInfo.brighterLevelOne}}>
                {this.renderSonComment(rowData.commentList, rowData)}
              </View>)}
            </View>

          </View>
        </TouchableNativeFeedback>
      </View>
    )
  }


  isReplyShowing = false

  onCommentLongPress = (rowData, name = '') => {
    if (this.isReplyShowing === true) return
    const { params } = this.props.navigation.state
    const cb = () => {
      this.isReplyShowing = true
      this.props.screenProps.navigation.navigate('Reply', {
        type: 'comson',
        id: rowData.id.replace('comment-', ''),
        at: name ? name : rowData.psnid,
        callback: () => {
          fetch(`http://psnine.com/get/comson?id=${rowData.id.replace('comment-', '')}`).then(() => {
            this.isReplyShowing = false
            this.preFetch()
          })
        },
        shouldSeeBackground: true
      })
    }
    cb()
  }

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
