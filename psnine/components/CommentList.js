import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  Image,
  ToastAndroid,
  Dimensions,
  TouchableNativeFeedback,
  RefreshControl,
  InteractionManager,
  ToolbarAndroid
} from 'react-native';

import HTMLView from './htmlToView';
import { connect } from 'react-redux';
import { standardColor, nodeColor, idColor  } from '../config/colorConfig';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { getTopicCommentAPI } from '../dao/dao';
import moment from '../utils/moment';

const ds = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1.id !== row2.id,
});

let toolbarActions = [];

class CommentList extends Component {
    constructor(props){
      super(props);
      this.state = {
        list: [],
        numberPerPage: 60,
        numPages: 1,
        commentTotal: 1, 
        currentPage: 1,
        isLoading: true
      }
    }

  onNavClicked = (rowData) => {
    const { navigator } = this.props;
    if (navigator) {
      navigator.pop();
    }
  }

  _pressRow = (rowData) => {

  }


  _renderRow = (rowData,
    sectionID: number | string,
    rowID: number | string,
    highlightRow: (sectionID: number, rowID: number) => void
  ) => {

    let TouchableElement = TouchableNativeFeedback;

    return (
      <View key={ rowData.id } style={{     
          marginTop: 7,         
          backgroundColor: this.props.modeInfo.backgroundColor
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
              onLinkPress={(url) => console.log('clicked link: ', url)}
              imagePaddingOffset={30}
              />

              <View style={{ flex: 1.1, flexDirection: 'row', justifyContent :'space-between' }}>
              <Text selectable={false} style={{ flex: -1, color: this.props.modeInfo.standardTextColor ,textAlign : 'center', textAlignVertical: 'center' }}>{rowData.psnid}</Text>
              <Text selectable={false} style={{ flex: -1, color: this.props.modeInfo.standardTextColor,textAlign : 'center', textAlignVertical: 'center' }}>{rowData.date}</Text>
              </View>

          </View>

          </View>
      </TouchableNativeFeedback>
      </View>
    )
  }

  componentWillMount = async () => {
    this.fetchMessages(this.props.URL, 'jump');
  }

  fetchMessages = (url, type = 'down') => {
    this.setState({
      isLoading: true
    }, () => {
      InteractionManager.runAfterInteractions(() => {
        getTopicCommentAPI(url).then(data => {
          let thisList = []
          if (type === 'down') {
            thisList = this.state.list.concat(data.commentList)
          } else if (type === 'up') {
            thisList = this.state.list.unshift(data.commentList)
          } else if (type === 'jump') {
            thisList = data.commentList
          }
          this.setState({
            list: thisList,
            numberPerPage: data.numberPerPage,
            numPages: data.numPages,
            commentTotal: data.len, 
            currentPage: parseInt(url.match(/\?page=(\d+)/)[1]),
            isLoading: false
          });
        })
      })
    })
  }

  
  _onRefresh = () => {
    const { URL } = this.props;
    const type = this.state.currentPage === 1 ? 'jump' : 'up'
    const currentPage = this.state.currentPage
    const targetPage = Math.max(currentPage - 1, 1)

    this.fetchMessages(URL.replace('page=' + currentPage, 'page=' + targetPage), type);
  }

  _onEndReached = () => {
    const { URL } = this.props;
    const currentPage = this.state.currentPage
    const targetPage = currentPage + 1

    if (targetPage > this.state.numPages) return

    this.fetchMessages(URL.replace('page=' + currentPage, 'page=' + targetPage), 'down');

  }


  _renderHeader = () => {
    return (
      <View style={{
        flex: -1,
        elevation: 2,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        height: 40,
        paddingTop: 3,
        backgroundColor: this.props.modeInfo.backgroundColor
      }}>
        <Text style={{color: this.props.modeInfo.standardTextColor}}>当前页: {this.state.currentPage}</Text>
        <Text style={{color: this.props.modeInfo.standardTextColor}}>总页数: {this.state.numPages}</Text>
        <Text style={{color: this.props.modeInfo.standardTextColor}}>评论总数: {this.state.commentTotal}</Text>
      </View>
    )
  }

  render(){
    // console.log('Message.js rendered');
    ds = ds.cloneWithRows(this.state.list)

    return (
          <View 
            style={{flex:1,backgroundColor:this.props.modeInfo.brighterLevelOne}}
            onStartShouldSetResponder={() => false}
            onMoveShouldSetResponder={() => false}
            >
              <Ionicons.ToolbarAndroid
                navIconName="md-arrow-back"
                overflowIconName="md-more"                 
                iconColor={this.props.modeInfo.isNightMode ? '#000' : '#fff'}
                title={'所有评论'}
                style={[styles.toolbar, {backgroundColor: this.props.modeInfo.standardColor}]}
                actions={toolbarActions}
                onIconClicked={this.onNavClicked}
              />
              { this._renderHeader() }
              <ListView
                refreshControl={
                  <RefreshControl
                    refreshing={this.state.isLoading}
                    onRefresh={this._onRefresh}
                    colors={[standardColor]}
                    ref={ ref => this.refreshControl = ref}
                    progressBackgroundColor={this.props.modeInfo.backgroundColor}
                    />
                }
                pageSize = {60}
                removeClippedSubviews={false}
                enableEmptySections={true}
                dataSource={ ds }
                renderRow={this._renderRow}
                onEndReached={this._onEndReached}
                onEndReachedThreshold={10}
                onLayout={event => {
                  this.listViewHeight = event.nativeEvent.layout.height
                }}
                />
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


export default CommentList;
