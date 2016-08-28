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

import {
  getTopicList,
} from '../actions/community.js';

import Topic from './Topic';

import { getTopicURL } from '../dao/dao';
import moment from '../utils/moment';

const ds = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2,
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
        component: Topic,
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
      <View rowID={ rowID }>
        <TouchableElement  onPress={() => this._onRowPressed(rowData) }>
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'flex-start', padding: 10 }}>
            <Image
              source={{ uri: uri }}
              style={styles.avatar}
              />

            <View style={{ marginLeft: 10, flex: 1, flexDirection: 'column', margin: 0 }}>
              <Text
                ellipsizeMode={'tail'}
                numberOfLines={3}
                style={{ color: 'black', }}>
                {rowData.title}
              </Text>

              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', paddingTop: 5, }}>
                <Text style={{ flex: 1.5 }}>{rowData.psnid}</Text>
                <Text style={{ flex: 1 }}>{fromNow}</Text>
                <Text style={{ flex: 1 }}>{rowData.views}浏览</Text>
              </View>

            </View>

          </View>
        </TouchableElement>
      </View>
    )
  }

  componentWillReceiveProps(nextProps) {
    this.props.app = nextProps.app;
    if(this.props.app.segmentedIndex == this.props.segmentedIndex){
      this.props.community = nextProps.community;
    }
  }

  componentDidMount = () => {
    const { community: communityReducer } = this.props;
    if (communityReducer.topicPage == 0)
      this._onRefresh();
  }

  _onRefresh = () => {
    const { app: appReducer, dispatch } = this.props;

    if (appReducer.isLoadingMore || appReducer.isRefreshing)
      return;

    dispatch(getTopicList(1));
  }

  _loadMoreData = () => {
    const { community: communityReducer, dispatch } = this.props;
    let page = communityReducer.topicPage + 1;
    dispatch(getTopicList(page));
  }

  _onEndReached = () => {
    const { app: appReducer } = this.props;

    if (appReducer.isLoadingMore || appReducer.isRefreshing)
      return;

      this._loadMoreData();

  }

  // shouldComponentUpdate(nextProps,nextStates){
  //   if(nextProps.app.segmentedIndex==this.props.segmentedIndex){
  //     return true;
  //   }
  //   return false;
  // }

  render(){
    const { community: communityReducer, app: appReducer } = this.props;
    console.log(appReducer);
    console.log('Community.js rendered');
    return (
        <ListView
          refreshControl={
            <RefreshControl
              refreshing={appReducer.isRefreshing || appReducer.isLoadingMore }
              onRefresh={this._onRefresh}
              />
          }
          pageSize = {32}
          removeClippedSubviews={false}
          enableEmptySections={true}
          onEndReached={this._onEndReached}
          onEndReachedThreshold={10}
          dataSource={ ds.cloneWithRows(communityReducer.topics) }
          renderRow={this._renderRow}
          renderSeparator={this._renderSeparator}
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
      app: {
        isLoadingMore: state.app.isLoadingMore,
        isRefreshing: state.app.isRefreshing,
      },
      community: state.community,
    };
}

export default connect(
  mapStateToProps
)(Community);
