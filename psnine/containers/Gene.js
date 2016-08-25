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

import {
  getGeneList,
} from '../actions/gene.js';

import NavigatorDrawer from '../components/NavigatorDrawer';
import SegmentedView from '../components/SegmentedView';
import Topic from './Topic';

import { getGeneURL } from '../dao/dao';
import moment from '../utils/moment';

const ds = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2,
});

class Gene extends Component {
  constructor(props) {
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
    const URL = getGeneURL(rowData.id);
    if (navigator) {
      navigator.push({
        component: Topic,
        params: {
          URL,
          title: rowData.content,
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

    let imageArr = [];
    let type = rowData.type;

    if(rowData.photo != '' && type == 'photo'){
      let arr = rowData.photo.split(',');
      imageArr = arr.map(value=>'http://ww4.sinaimg.cn/thumb150/'+value+'.jpg');
    }else if(rowData.plus.img != '' && type == 'video'){
      imageArr = [rowData.plus.img];
    }else if(rowData.plus.cover != '' && type == 'music'){
      imageArr = [rowData.plus.cover];
    }

    let imageItems = [];
    imageArr.forEach((value,index)=>imageItems.push(<Image key={rowData.id+''+index} source={{ uri: value }} style={styles.geneImage}/>));

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
                {rowData.content}
              </Text>
              <View style={{flex:1, flexDirection: 'row'}}>
                {imageItems}
              </View>
              <View style={{ flex: 1, flexDirection: 'row',  alignItems: 'flex-end', paddingTop: 5, }}>
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
    this.props.gene = nextProps.gene;
  }

  componentDidMount = () => {
    const { gene: geneReducer } = this.props;
    if (geneReducer.genePage == 0)
      this._onRefresh();
  }


  _onRefresh = () => {
    const { app: appReducer, dispatch } = this.props;

    if (appReducer.isLoadingMore || appReducer.isRefreshing)
      return;

    dispatch(getGeneList(1));
  }

  _loadMoreData = () => {
    const { gene: geneReducer, dispatch } = this.props;
    let page = geneReducer.genePage + 1;
    dispatch(getGeneList(page));
  }

  _onEndReached = () => {
    const { app: appReducer } = this.props;

    if (appReducer.isLoadingMore || appReducer.isRefreshing)
      return;

    InteractionManager.runAfterInteractions(() => {
      this._loadMoreData();
    });

  }

  render() {
    const { gene: geneReducer, app: appReducer } = this.props;
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
        dataSource={ ds.cloneWithRows(geneReducer.genes) }
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
  },
  geneImage: {
    margin: 3,
    width: 120,
    height: 120,
  }
});

export default Gene;