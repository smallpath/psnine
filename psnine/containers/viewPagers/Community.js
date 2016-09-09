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
} from 'react-native';

import { connect } from 'react-redux';
import { getTopicList } from '../../actions/community.js';
import { standardColor, nodeColor, idColor  } from '../../config/colorConfig';

import CommunityTopic from '../../components/CommunityTopic';

import { getTopicURL } from '../../dao/dao';
import moment from '../../utils/moment';

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

    let uri;
    if (rowData.profilepicture == '') {
      let path = rowData.avatar.toString().replace('\\', '');
      uri = `http://photo.d7vg.com/avatar/${path}.png@50w.png`;
    } else {
      uri = `http://photo.d7vg.com/avaself/${rowData.psnid}.png@50w.png`;
    }
    let time = parseInt(rowData.date);
    time *= 1000;
    let date = new Date(time);
    let fromNow = moment(date).fromNow();

    let TouchableElement = TouchableNativeFeedback;

    return (
      <View rowID={ rowID } style={{              
            marginTop: 7,
            backgroundColor: this.props.modeInfo.backgroundColor,
            elevation: 1,
        }}>
        <TouchableElement  
          onPress ={()=>{this._onRowPressed(rowData)}}
          delayPressIn={100}
          background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
          >
          <View style={{ flex: 1, flexDirection: 'row',  padding: 12 }}>
            <Image
              source={{ uri: uri }}
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
                <Text style={{ flex: -1, color: idColor,textAlign : 'center', textAlignVertical: 'center' }}>{rowData.psnid}</Text>
                <Text style={{ flex: -1, color: this.props.modeInfo.standardTextColor,textAlign : 'center', textAlignVertical: 'center' }}>{fromNow}</Text>
                <Text style={{ flex: -1, color: this.props.modeInfo.standardTextColor,textAlign : 'center', textAlignVertical: 'center' }}>{rowData.count}回复</Text>
                <Text style={{ flex: -1, color: this.props.modeInfo.standardTextColor,textAlign : 'center', textAlignVertical: 'center' }}>{rowData.views}浏览</Text>
              </View>

            </View>

          </View>
        </TouchableElement>
      </View>
    )
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
      community: state.community,
    };
}

export default connect(
  mapStateToProps
)(Community);
