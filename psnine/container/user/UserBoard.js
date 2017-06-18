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
import ComplexComment from '../shared/ComplexComment'

const ds = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1.href !== row2.href,
});

let toolbarActions = [
  { title: '回复', iconName: 'md-create', iconSize: 22, show: 'always' },
];

class UserBoard extends Component {
  static navigationOptions = {
     tabBarLabel: '评论'
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
    const name = '评论'
    let params = {}
    screenProps.toolbar.forEach(({ text, url}) => {
      if (text === name) {
        params.text = text
        params.URL = url
      }
    })
    if (!params.URL) {
      params = { ...screenProps.toolbar[2] }
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

  hasComment = false
  renderComment = (rowData, index) => {
    const { modeInfo, navigation } = this.props.screenProps
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
