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
  ScrollView
} from 'react-native';

import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { standardColor, nodeColor, idColor  } from '../config/colorConfig';

import { getTopicAPI } from '../dao/dao'

let toolbarActions = [
  {title: '收藏', iconName: 'md-star' ,show: 'always'},
  {title: '刷新', iconName: 'md-refresh', show: 'always'},
  {title: '感谢', iconName: 'md-thumbs-up', show: 'never'},
  {title: '分享', show: 'never' },
];
let title = "TOPIC";
let WEBVIEW_REF = `WEBVIEW_REF`;

class CommunityTopic extends Component {

  constructor(props){
    super(props);
    this.state = {
      data: false,
      isLogIn: false,
      canGoBack: false,
      icon: false
    }
  }

  _onActionSelected = (index) => {
    switch(index){
      case 0 :
        return;
      case 1 :
        return this.refs[WEBVIEW_REF].reload();
      case 2 :
        return;
      case 3 :
        return;
    }
  }

  componentWillMount = async () => {
    const data = await getTopicAPI(this.props.URL)
    this.setState({
      data
    })
  }

  renderHeader = () => {
    const { data: { titleInfo } } = this.state

    return (
      <View key={'header'} style={{              
            marginTop: 7,
            backgroundColor: this.props.modeInfo.backgroundColor,
            elevation: 1,
            flex: 1
        }}>
        <TouchableNativeFeedback  
          useForeground={true}
          delayPressIn={100}
          background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
          >
          <View pointerEvents='box-only' style={{ flex: 1, flexDirection: 'row',  padding: 12 }}>

            <View style={{ marginLeft: 10, flex: 1, flexDirection: 'column'}}>
              <Text
                ellipsizeMode={'tail'}
                numberOfLines={3}
                style={{ flex: 2.5,color: this.props.modeInfo.titleTextColor, }}>
                {titleInfo.title}
              </Text>

              <View style={{ flex: 1.1, flexDirection: 'row', justifyContent :'space-between' }}>
                <Text selectable={false} style={{ flex: -1, color: idColor,textAlign : 'center', textAlignVertical: 'center' }}>{titleInfo.psnid}</Text>
                <Text selectable={false} style={{ flex: -1, color: this.props.modeInfo.standardTextColor,textAlign : 'center', textAlignVertical: 'center' }}>{titleInfo.date}</Text>
                <Text selectable={false} style={{ flex: -1, color: this.props.modeInfo.standardTextColor,textAlign : 'center', textAlignVertical: 'center' }}>{titleInfo.reply}回复</Text>
                <Text selectable={false} style={{ flex: -1, color: this.props.modeInfo.standardTextColor,textAlign : 'center', textAlignVertical: 'center' }}>{titleInfo.node}</Text>
              </View>

            </View>

          </View>
        </TouchableNativeFeedback>
      </View>
    )
  }

  renderContent = () => {
    const { data: { contentInfo } } = this.state
    return (
      <View key={'content'} style={{              
            marginTop: 7,
            backgroundColor: this.props.modeInfo.backgroundColor,
            elevation: 1,
            padding: 7
        }}>
        <Text>
          { contentInfo.html }
        </Text>
      </View>
    )
  }

  renderComment = () => {
    const { data: { commentList } } = this.state
    const list = []
    for (const rowData of commentList) {
      if (rowData.isGettingMoreComment === false) {
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
                  source={{ uri: rowData.img }}
                  style={styles.avatar}
                  />

                <View style={{ marginLeft: 10, flex: 1, flexDirection: 'column'}}>
                  <Text
                    ellipsizeMode={'tail'}
                    numberOfLines={3}
                    style={{ flex: 2.5,color: this.props.modeInfo.titleTextColor, }}>
                    {rowData.content}
                  </Text>

                  <View style={{ flex: 1.1, flexDirection: 'row', justifyContent :'space-between' }}>
                    <Text selectable={false} style={{ flex: -1, color: idColor,textAlign : 'center', textAlignVertical: 'center' }}>{rowData.psnid}</Text>
                    <Text selectable={false} style={{ flex: -1, color: this.props.modeInfo.standardTextColor,textAlign : 'center', textAlignVertical: 'center' }}>{rowData.date}</Text>
                  </View>

                </View>

              </View>
            </TouchableNativeFeedback>
          </View>
        )
      } else {
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

                <View style={{ marginLeft: 10, flex: 1, flexDirection: 'column'}}>
                  <Text
                    ellipsizeMode={'tail'}
                    numberOfLines={3}
                    style={{ flex: 2.5,color: this.props.modeInfo.titleTextColor, }}>{'阅读更多评论'}</Text>

                </View>

              </View>
            </TouchableNativeFeedback>
          </View>
        )
      }
    }
    return (
      <View style={{flex:10, elevation: 1, margin: 5 }}>
        { list }
      </View>
    )
  }

  render() {
    // console.log('CommunityTopic.js rendered');
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
                title={this.props.title}
                style={[styles.toolbar, {backgroundColor: this.props.modeInfo.standardColor}]}
                actions={toolbarActions}
                onIconClicked={() => {
                  this.props.navigator.pop()
                }}
                onActionSelected={this._onActionSelected}
              />
              <ScrollView>
                { this.state.data && this.renderHeader() }
                { this.state.data && this.renderContent() }
                { this.state.data && this.renderComment() }
              </ScrollView>
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
  selectedTitle:{
    //backgroundColor: '#00ffff'
    //fontSize: 20
  },
  avatar: {
    width: 50,
    height: 50,
  }
});


export default CommunityTopic