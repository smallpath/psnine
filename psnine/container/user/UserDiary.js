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
import { getUserDiaryAPI } from '../../dao';
import ComplexComment from '../shared/ComplexComment'
import DiaryItem from '../shared/DiaryItem'

const ds = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1.href !== row2.href,
});

let toolbarActions = [];

class UserBoard extends Component {
  static navigationOptions = {
     tabBarLabel: '日志'
  }
  constructor(props) {
    super(props);
    this.state = {
      data: false,
      diary: [],
      isLoading: true,
      modalVisible: false,
      sliderValue: 1
    }
  }

  onActionSelected = (index) => {
    
  }


  handleImageOnclick = (url) => this.props.screenProps.navigation.navigate('ImageViewer', {
    images: [
      { url }
    ]
  })

  componentWillMount = async () => {
    const { screenProps } = this.props
    const name = '日志'
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
        getUserDiaryAPI(this.URL).then(data => {
          // console.log(data)
          this.setState({
            data,
            diary: data.diary,
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

  renderDiary = (rowData, index) => {
    const { modeInfo, navigation } = this.props.screenProps
    const shouldShowImage = rowData.thumbs.length !== 0
    const suffix = '<div>' + rowData.thumbs.map(text => `<img src="${text}">`).join('') + '</div>'
    const content = `<div>${rowData.content}<br><br>${shouldShowImage ? suffix : ''}</div>`
    // console.log('here', typeof DiaryItem)
    return <DiaryItem {...{
      navigation,
      rowData,
      modeInfo,
      content
    }} />
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
          data={this.state.diary}
          keyExtractor={(item, index) => item.id || index}
          renderItem={({ item, index }) => {
            return this.renderDiary(item, index)
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
