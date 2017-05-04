import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  Image,
  Picker,
  ToastAndroid,
  Dimensions,
  TouchableNativeFeedback,
  RefreshControl,
  InteractionManager,
  ToolbarAndroid,
  Modal,
  Slider
} from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

import MyDialog from './dialog'

import HTMLView from './htmlToView';
import { connect } from 'react-redux';
import { standardColor, nodeColor, idColor  } from '../config/colorConfig';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { getTopicCommentAPI } from '../dao/dao';
import moment from '../utils/moment';

const ds = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1.id !== row2.id,
});

let toolbarActions = [
  {title: '回复', iconName: 'md-create', show: 'always'},
  {title: '跳页', iconName: 'md-map' ,show: 'always'},
];

class CommentList extends Component {
    constructor(props){
      super(props);
      this.state = {
        list: [],
        numberPerPage: 60,
        numPages: 1,
        commentTotal: 1, 
        currentPage: 1,
        isLoading: true,
        modalVisible: false,
        sliderValue: 1
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
          const thisPage = parseInt(url.match(/\?page=(\d+)/)[1])
          let cb = () => {}
          if (type === 'down') {
            thisList = this.state.list.concat(data.commentList)
            this.pageArr.push(thisPage)
          } else if (type === 'up') {
            thisList = this.state.list.slice()
            thisList.unshift(...data.commentList)
            this.pageArr.unshift(thisPage)
          } else if (type === 'jump') {
            cb = () => this.listView.scrollTo({y:0, animated: true});
            thisList = data.commentList
            this.pageArr = [this.pageArr]
          }
          this.setState({
            list: thisList,
            numberPerPage: data.numberPerPage,
            numPages: data.numPages,
            commentTotal: data.len, 
            currentPage: thisPage,
            isLoading: false
          }, cb);
        })
      })
    })
  }

  pageArr = [1]
  _onRefresh = () => {
    const { URL } = this.props;
    const currentPage = this.state.currentPage
    let type = currentPage === 1 ? 'jump' : 'up'
    let targetPage = currentPage - 1
    if (type === 'jump') {
      targetPage = 1
    }
    if (this.pageArr.includes(targetPage)) type = 'jump'
    this.fetchMessages(URL.split('=').slice(0, -1).concat(targetPage).join('='), type);
  }

  _onEndReached = () => {
    const { URL } = this.props;
    const currentPage = this.state.currentPage
    const targetPage = currentPage + 1
    if (targetPage > this.state.numPages) return
    if (this.state.isLoading === true) return alert('caonima onEndReached')
    this.fetchMessages(URL.split('=').slice(0, -1).concat(targetPage).join('='), 'down');

  }

  onActionSelected = (index) => {
    switch(index){
      case 0 :
        return;
      case 1 :
        this.setState({
          modalVisible: true
        })
      case 2 :
        return;
      case 3 :
        return;
    }
  }

  sliderValue = 1
  render(){
    // console.log('Message.js rendered');
    ds = ds.cloneWithRows(this.state.list)

    return (
          <View 
            style={{flex:1,backgroundColor:this.props.modeInfo.backgroundColor}}
            onStartShouldSetResponder={() => false}
            onMoveShouldSetResponder={() => false}
            >
              <Ionicons.ToolbarAndroid
                navIconName="md-arrow-back"
                overflowIconName="md-more"                 
                iconColor={this.props.modeInfo.isNightMode ? '#000' : '#fff'}
                title={'所有评论'}
                style={[styles.toolbar, {backgroundColor: this.props.modeInfo.standardColor}]}
                titleColor={this.props.modeInfo.isNightMode ? '#000' : '#fff'}
                actions={toolbarActions}
                onIconClicked={this.onNavClicked}
                onActionSelected={this.onActionSelected}
              />
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
                ref={listView=>this.listView=listView}
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
                { this.state.modalVisible && (
                    <MyDialog modeInfo={this.props.modeInfo}
                      modalVisible={this.state.modalVisible}
                      onDismiss={() => { this.setState({ modalVisible:false }); this.isValueChanged = false }}
                      onRequestClose={() => { this.setState({ modalVisible:false }); this.isValueChanged = false }}
                      renderContent={() => (
                        <View style={{
                          justifyContent:'center',
                          alignItems: 'center',
                          backgroundColor: this.props.modeInfo.backgroundColor,
                          paddingVertical: 30,
                          paddingHorizontal: 40,
                          elevation: 4,
                          opacity: 1
                        }} borderRadius={2}>
                          <Text style={{alignSelf:'flex-start',fontSize: 18}}>选择页数: {
                              this.isValueChanged ? this.state.sliderValue : this.state.currentPage
                            }</Text>
                            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent:'space-between'}}>
                              <Text>{this.state.currentPage}</Text>
                              <Slider
                                maximumValue={this.state.numPages}
                                minimumValue={1}
                                maximumTrackTintColor={this.props.modeInfo.accentColor}
                                minimumTrackTintColor={this.props.modeInfo.standardTextColor}
                                thumbTintColor={this.props.modeInfo.accentColor}
                                step={1}
                                style={{
                                  paddingHorizontal: 90,
                                  height: 50
                                }}
                                value={this.state.currentPage}
                                onValueChange={(value) => {
                                  this.isValueChanged = true
                                  this.setState({
                                    sliderValue: value
                                  })
                                }}
                              />
                              <Text>{this.state.numPages}</Text>
                            </View>
                          <Text style={{alignSelf:'flex-end',color: '#009688' }}
                            onPress={() => {
                            this.setState({
                              modalVisible:false,
                              isLoading: true
                            }, () => {
                              const currentPage = this.state.currentPage
                              const targetPage = this.props.URL.split('=').slice(0, -1).concat(this.state.sliderValue).join('=')
                              this.fetchMessages(targetPage, 'jump');                                
                            })
                          }}>确定</Text>
                      </View>
                    )}/>
                )}
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
