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

import { getGeneList } from '../../actions/gene.js';

import GeneTopic from '../../components/GeneTopic';

import { getGeneURL } from '../../dao/dao';
import moment from '../../utils/moment';

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
        style={{ height: 1,backgroundColor: 'rgba(0, 0, 0, 0.1)',marginLeft:10,marginRight:10}}
        />
    );
  }

  _onRowPressed = (rowData) => {
    const { navigator } = this.props;
    const URL = getGeneURL(rowData.id);
    if (navigator) {
      navigator.push({
        component: GeneTopic,
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
    if(this.props.geneType != nextProps.geneType){
      this.props.geneType = nextProps.geneType;
      this._onRefresh(nextProps.geneType);
    }
  }

  componentDidMount = () => {
    const { gene: geneReducer } = this.props;
    if (geneReducer.genePage == 0)
      this._onRefresh();
  }


  _onRefresh = (type = '') => {
    const { gene: geneReducer, dispatch } = this.props;

    if (geneReducer.isLoadingMore || geneReducer.isRefreshing)
      return;

    dispatch(getGeneList(1, type));
  }

  _loadMoreData = () => {
    const { gene: geneReducer, dispatch, geneType } = this.props;
    let page = geneReducer.genePage + 1;
    dispatch(getGeneList(page, geneType));
  }

  _onEndReached = () => {
    const { gene: geneReducer, dispatch } = this.props;

    if (geneReducer.isLoadingMore || geneReducer.isRefreshing)
      return;

    this._loadMoreData();

  }

  render() {
    // console.log('Gene.js rendered');
    const { gene: geneReducer } = this.props;
    return (
      <ListView
        refreshControl={
          <RefreshControl
            refreshing={geneReducer.isRefreshing || geneReducer.isLoadingMore }
            onRefresh={this._onRefresh}
            colors={['#00a2ed']}
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

function mapStateToProps(state) {
    return {
      gene: state.gene,
    };
}

export default connect(
  mapStateToProps
)(Gene);