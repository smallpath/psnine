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
import { bindActionCreators } from 'redux';
import {
  getTopicList,
  changeTopicListRefreshing,
  changeTopicListLoadingMore,
  changePageNumberToDefault,
  changePageNumberIncreasing,
} from '../actions/mainScreen.js';

import NavigatorDrawer from '../components/NavigatorDrawer';
import SegmentedView from '../components/SegmentedView';
import Topic from './Topic';

import { getTopicURL } from '../dao/dao';
import moment from '../utils/moment';

const ds = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2,
});

class Gene extends Component {
    constructor(props){
        super(props);
    }

  _renderSeparator(sectionID: number, rowID: number, adjacentRowHighlighted: bool) {
    return (
      <View
        key={`${sectionID}-${rowID}`}
        style={{ height: adjacentRowHighlighted ? 4 : 1, backgroundColor: adjacentRowHighlighted ? '#3B5998' : '#CCCCCC', }}
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
          <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', padding: 10 }}>
            <Image
              source={{ uri: uri }}
              style={styles.avatar}
              />

            <View style={{ marginLeft: 10, flex: 1, flexDirection: 'column', margin: 0 }}>
              <Text
                ellipsizeMode={'head'}
                numberOfLines={3}
                style={{ color: 'black', }}>
                {rowData.title}
              </Text>

              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end', paddingTop: 5, }}>
                <Text style={{ flex: 1, flexDirection: 'row' }}>{rowData.psnid}</Text>
                <Text style={{ flex: 1, flexDirection: 'row' }}>{fromNow}</Text>
                <Text style={{ flex: 1, flexDirection: 'row' }}>{rowData.views}浏览</Text>
              </View>

            </View>

          </View>
        </TouchableElement>
      </View>
    )
  }

  componentWillReceiveProps(nextProps) {
    // Object.keys(nextProps.mainScreen).forEach((item,index)=>{
    //   if(item!='topics') 
    //     console.log('153-->',item,nextProps.mainScreen[item])

    // });
    this.props.mainScreen = nextProps.mainScreen;
  }

  componentDidMount = () => {
    this._onRefresh();
  }


  _onRefresh = () => {
    const { mainScreen: reducer, dispatch } = this.props;

    if (reducer.isLoadingMore || reducer.isRefreshing)
      return;

    dispatch(getTopicList(1));
  }

  _loadMoreData = () => {
    const { mainScreen: reducer, dispatch } = this.props;
    let page = reducer.topicPage + 1;
    dispatch(getTopicList(page));
  }

  _onEndReached = () => {
    const { mainScreen: reducer } = this.props;

    if (reducer.isLoadingMore || reducer.isRefreshing)
      return;

    InteractionManager.runAfterInteractions(() => {
      this._loadMoreData();
    });

  }

  render(){
    const { mainScreen: reducer } = this.props;
    return (
        <ListView
          refreshControl={
            <RefreshControl
              refreshing={reducer.isRefreshing || reducer.isLoadingMore }
              onRefresh={this._onRefresh}
              />
          }
          pageSize = {32}
          removeClippedSubviews={false}
          enableEmptySections={true}
          onEndReached={this._onEndReached}
          onEndReachedThreshold={10}
          dataSource={ ds.cloneWithRows(reducer.topics) }
          renderRow={this._renderRow}
          renderSeparator={this._renderSeparator}
          />
    )
  }

}

const styles = StyleSheet.create({
  selectedTitle: {
    //backgroundColor: '#00ffff'
    //fontSize: 20
  },
  avatar: {
    width: 50,
    height: 50,
  }
});

export default Gene;