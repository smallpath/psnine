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
  PanResponder,
  Animated,
  InteractionManager,
} from 'react-native';

import { connect } from 'react-redux';
import { getTopicList } from '../../actions/community.js';
import { standardColor, nodeColor, idColor  } from '../../config/colorConfig';

import CommunityTopic from '../../components/CommunityTopic';

import { getTopicURL } from '../../dao/dao';
import moment from '../../utils/moment';

import { changeScrollType } from '../../actions/app';

let toolbarHeight = 56;
let releasedMarginTop = 0;

let dataSource = new ListView.DataSource({
  rowHasChanged: (row1, row2) => {
    return row1.id !== row2.id || row1.views !== row2.views || row1.count !== row2.count;
  },
});

class Community extends Component {
    constructor(props){
        super(props);
    }

  _renderSeparator(sectionID: number, rowID: number, adjacentRowHighlighted: bool) {
    return (
      <View
        key={`${sectionID}-${rowID}`}
        style={{ height: 1,backgroundColor: 'rgba(0, 0, 0, 0.1)',marginLeft:10,marginRight:10}}
        />
    );
  }

  _onRowPressed = (rowData) => {
    const { navigator } = this.props;
    const URL = getTopicURL(rowData.id);
    if (navigator) {
      navigator.push({
        component: CommunityTopic,
        params: {
          URL,
          title: rowData.title,
          rowData
        }
      });
    }
  }


  _renderRow = (rowData,
    sectionID: number | string,
    rowID: number | string,
    highlightRow: (sectionID: number, rowID: number) => void
  ) => {

    let TouchableElement = TouchableNativeFeedback;
    return (
      <View rowID={ rowID } style={{              
            marginTop: 7,
            backgroundColor: this.props.modeInfo.backgroundColor,
            elevation: 1,
        }}>
        <TouchableElement  
          onPress ={()=>{
            this._onRowPressed(rowData)
          }}
          useForeground={true}
          delayPressIn={100}
          background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
          >
          <View accessible={false} style={{ flex: 1, flexDirection: 'row',  padding: 12 }}>
            <Image
              source={{ uri: rowData.avatar }}
              style={styles.avatar}
              />

            <View style={{ marginLeft: 10, flex: 1, flexDirection: 'column'}}>
              <Text
                ellipsizeMode={'tail'}
                numberOfLines={3}
                style={{ flex: 2.5,color: this.props.modeInfo.titleTextColor, }}>
                {rowData.title}
              </Text>

              <View style={{ flex: 1.1, flexDirection: 'row', justifyContent :'space-between' }}>
                <Text selectable={false} style={{ flex: -1, color: idColor,textAlign : 'center', textAlignVertical: 'center' }}>{rowData.psnid}</Text>
                <Text selectable={false} style={{ flex: -1, color: this.props.modeInfo.standardTextColor,textAlign : 'center', textAlignVertical: 'center' }}>{rowData.date}</Text>
                <Text selectable={false} style={{ flex: -1, color: this.props.modeInfo.standardTextColor,textAlign : 'center', textAlignVertical: 'center' }}>{rowData.count}回复</Text>
                <Text selectable={false} style={{ flex: -1, color: this.props.modeInfo.standardTextColor,textAlign : 'center', textAlignVertical: 'center' }}>{rowData.type}</Text>
              </View>

            </View>

          </View>
        </TouchableElement>
      </View>
    )
  }

componentWillMount() {
    const { dispatch } = this.props;
    const ref = this
    let currentScrolling = false;
    const setMarginTop = this.props.setMarginTop
    this.panResponder = PanResponder.create({  

        onStartShouldSetPanResponderCapture: (e, gesture) =>{ 
          return false; 
        },

        onMoveShouldSetPanResponderCapture:(e, gesture) =>{ 
          let shouldSet = Math.abs(gesture.dy) >=4;
          return shouldSet; 
        },

        onPanResponderGrant: (e, gesture) => {
          if (currentScrolling === false) {
            currentScrolling = true;
            this.refreshControl._nativeRef.setNativeProps({
              enabled: false,
            });
            this.listView.setNativeProps({
              scrollEnabled: false,
            });
          }
        },
        onPanResponderMove: (e, gesture) => {
          let dy = gesture.dy;
          let vy = gesture.vy;
          if(dy < 0){
            dy = dy + setMarginTop(null, null, true);
            if(-dy <= toolbarHeight && dy <= 0){
              setMarginTop(dy)
            } else {
              setMarginTop(-toolbarHeight)
              if (currentScrolling === true) {
                currentScrolling = false;
                this.refreshControl._nativeRef.setNativeProps({
                  enabled: true,
                });
                this.listView.setNativeProps({
                  scrollEnabled: true,
                });
              }
            }
          }else{
            dy = dy + setMarginTop(null, null, true);
            if(-dy <= toolbarHeight && dy <= 0){ 
              setMarginTop(dy)
            } else {
              setMarginTop(0)
              if (currentScrolling === true) {
                currentScrolling = false;
                // dispatch(changeScrollType(false))
                this.refreshControl._nativeRef.setNativeProps({
                  enabled: true,
                });
                this.listView.setNativeProps({
                  scrollEnabled: true,
                });
              }
            }
          }
        }, 
        onPanResponderRelease: (e, gesture) => {
          // console.log('onPanResponderRelease\n======')
          const releasedMarginTop = setMarginTop(null, null, true)
          if (releasedMarginTop === 0 || releasedMarginTop === -toolbarHeight) {
            if (currentScrolling === true) {
              currentScrolling = false;
              // dispatch(changeScrollType(false))
                this.refreshControl._nativeRef.setNativeProps({
                  enabled: true,
                });
                this.listView.setNativeProps({
                  scrollEnabled: true,
                });
            }
          }
        },
        onPanResponderTerminationRequest : (evt, gesture) => {  
          // console.log('onPanResponderTerminationRequest')
          return true;
        },
        onPanResponderTerminate: (evt, gesture) => {  
          // console.log('onPanResponderTerminate')
        },
        onShouldBlockNativeResponder: (evt, gesture) => {  
          // console.log('onShouldBlockNativeResponder')
          return false;
        },
        onPanResponderReject: (evt, gesture) => {  
          // console.log('onPanResponderReject')
          return false;
        },
        onPanResponderEnd: (evt, gesture) => {  
          // console.log('onPanResponderEnd')
          let dy = gesture.dy;
          let vy = gesture.vy;
          
          setMarginTop(null, true)

          const releasedMarginTop = setMarginTop(null, null, true)
          if (releasedMarginTop === 0 || releasedMarginTop === -toolbarHeight) {
            if (currentScrolling === true) {
              currentScrolling = false;
              // dispatch(changeScrollType(false))
                this.refreshControl._nativeRef.setNativeProps({
                  enabled: true,
                });
                this.listView.setNativeProps({
                  scrollEnabled: true,
                });
            }
          }
        },

    });
  }

  componentWillReceiveProps = (nextProps) => {
    if(this.props.communityType != nextProps.communityType){
      this.props.communityType = nextProps.communityType;
      this._onRefresh(nextProps.communityType);
    }else if(this.props.modeInfo.isNightMode != nextProps.modeInfo.isNightMode ){
      this.props.modeInfo == nextProps.modeInfo;
      dataSource = dataSource.cloneWithRows([]);
      this._onRefresh(nextProps.communityType);
    }

  }

  componentDidUpdate = () => {
    const { community: communityReducer } = this.props;

    if(communityReducer.topicPage == 1){
      this._scrollToTop()
    }else{
      this.currentHeight = this.listView.getMetrics().contentLength;
    }

    this.refreshControl._nativeRef.setNativeProps({
      refreshing: false,
    });
  }

  componentDidMount = () => {
    const { community: communityReducer } = this.props;
    if (communityReducer.topicPage == 0){
      this._onRefresh();
    }
  }
  
  _onRefresh = (type = '') => {
    const { community: communityReducer, dispatch } = this.props;

    this.refreshControl._nativeRef.setNativeProps({
      refreshing: true,
    });

    dispatch(getTopicList(1, type));
  }

  _scrollToTop = () => {
    this.listView.scrollTo({y:0, animated: true});
  }

  _loadMoreData = () => {
    const { community: communityReducer, dispatch, communityType } = this.props;

    let page = communityReducer.topicPage + 1;
    dispatch(getTopicList(page, communityType));
  }

  _onEndReached = () => {
    const { community: communityReducer } = this.props;

    this.refreshControl._nativeRef.setNativeProps({
      refreshing: true,
    });

    this._loadMoreData(this.props.type);

  }

  render(){
    const { community: communityReducer } = this.props;
    // console.log('Community.js rendered');
    dataSource = dataSource.cloneWithRows(communityReducer.topics);
    return (
        <ListView
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={this._onRefresh}
              colors={[standardColor]}
              progressBackgroundColor={this.props.modeInfo.backgroundColor}
              ref={ ref => this.refreshControl = ref}
              />
          }
          {...this.panResponder.panHandlers/*{...this.props.responder.panHandlers}*/}
          ref={listView=>this.listView=listView}
          style={{backgroundColor: this.props.modeInfo.brighterLevelOne}}
          pageSize = {32}
          initialListSize = {32}
          removeClippedSubviews={false}
          enableEmptySections={true}
          onEndReached={this._onEndReached}
          onEndReachedThreshold={10}
          dataSource={ dataSource }
          renderRow={this._renderRow}

          onLayout={event => {
            this.listViewHeight = event.nativeEvent.layout.height
          }}
          onContentSizeChange={() => {
              if (communityReducer.topicPage == 1)
                return;

              this.listView.scrollTo({y: this.currentHeight + 60 - this.listViewHeight, animated: true})
            }}
          />
    )
  }

}

const styles = StyleSheet.create({
  avatar: {
    width: 50,
    height: 50,
  }
});


function mapStateToProps(state) {
    return {
      community: state.community
    };
}

export default connect(
  mapStateToProps
)(Community);
