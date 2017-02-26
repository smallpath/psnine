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
import { standardColor, nodeColor, idColor  } from '../../config/colorConfig';
import { getGeneList } from '../../actions/gene.js';

import GeneTopic from '../../components/GeneTopic';

import { getGeneURL } from '../../dao/dao';
import moment from '../../utils/moment';

let dataSource = new ListView.DataSource({
  rowHasChanged:  (row1, row2) => {
    return row1.id !== row2.id || row1.views !== row2.views || row1.count !== row2.count;
  },
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

    let TouchableElement = TouchableNativeFeedback;

    let imageArr = Array.from(rowData.thumbs);
    let type = rowData.type;

    imageArr.length >3 && imageArr.splice(3);

    let imageItems = [];
    imageArr.forEach((value,index)=>imageItems.push(<Image key={rowData.id+''+index} source={{ uri: value }} style={styles.geneImage}/>));

    return (
      <View rowID={ rowID } style={{              
            marginTop: 7,
            marginLeft: 7,
            marginRight: 7,
            backgroundColor: this.props.modeInfo.backgroundColor,
            elevation: 2,
        }}>
        <TouchableElement  
          onPress ={()=>{this._onRowPressed(rowData)}}
          delayPressIn={100}
          background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
          >
          <View style={{ flex: 1, flexDirection: 'row', padding: 12 }}>
            <Image
              source={{ uri: rowData.avatar }}
              style={styles.avatar}
              />

            <View style={{ marginLeft: 10, flex: 1, flexDirection: 'column', }}>
              <Text
                style={{ flex: -1,color: this.props.modeInfo.titleTextColor, }}>
                {rowData.content}
              </Text>
              <View style={{flex:-1, flexDirection: 'row', marginTop: 5, marginBottom: 5 ,}}>
                {imageItems}
              </View>
              <View style={{ flex: 1, flexDirection: 'row', justifyContent :'space-between',  }}>
                <Text style={{ fontSize: 12, flex: -1, color: idColor,textAlign : 'center', textAlignVertical: 'center' }}>{rowData.psnid}</Text>
                <Text style={{ fontSize: 12, flex: -1,color: this.props.modeInfo.standardTextColor,textAlign : 'center', textAlignVertical: 'center' }}>{rowData.date}</Text>
                <Text style={{ fontSize: 12, flex: -1,color: this.props.modeInfo.standardTextColor,textAlign : 'center', textAlignVertical: 'center' }}>{rowData.count}回复</Text>
                <Text style={{ fontSize: 12, flex: -1,color: this.props.modeInfo.standardTextColor,textAlign : 'center', textAlignVertical: 'center' }}>{rowData.circle}</Text>
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
    }else if(this.props.modeInfo.isNightMode != nextProps.modeInfo.isNightMode ){
      this.props.modeInfo == nextProps.modeInfo;
      dataSource = dataSource.cloneWithRows([]);
      this._onRefresh(nextProps.geneType);
    }
  }

  componentDidUpdate = () => {
    const { gene: geneReducer } = this.props;

    if(geneReducer.genePage == 1){
      this._scrollToTop();
    }else{
      this.currentHeight = this.listView.getMetrics().contentLength;
    }

    this.refreshControl._nativeRef.setNativeProps({
      refreshing: false,
    });
  }

  componentDidMount = () => {
    const { gene: geneReducer } = this.props;
    if (geneReducer.genePage == 0)
      this._onRefresh();
  }


  _onRefresh = (type = '') => {
    const { gene: geneReducer, dispatch } = this.props;

    this.refreshControl._nativeRef.setNativeProps({
      refreshing: true,
    });

    dispatch(getGeneList(1, type));

  }

  _scrollToTop = () => {
    this.listView.scrollTo({y:0, animated: true});
  }

  _loadMoreData = () => {
    const { gene: geneReducer, dispatch, geneType } = this.props;
    let page = geneReducer.genePage + 1;
    dispatch(getGeneList(page, geneType));
  }

  _onEndReached = () => {
    const { gene: geneReducer, dispatch } = this.props;

    this.refreshControl._nativeRef.setNativeProps({
      refreshing: true,
    });

    this._loadMoreData();

  }

  render() {
    // console.log('Gene.js rendered');
    const { gene: geneReducer } = this.props;
    dataSource = dataSource.cloneWithRows(geneReducer.genes);
    return (
      <ListView
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={this._onRefresh}
            colors={[standardColor]}
            ref={ ref => this.refreshControl = ref}
            progressBackgroundColor={this.props.modeInfo.backgroundColor}
            />
        }
        style={{backgroundColor: this.props.modeInfo.brighterLevelOne}}
        ref={listView=>this.listView=listView}
        pageSize = {32}
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
            if (geneReducer.genePage == 1)
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
  },
  geneImage: {
    margin: 3,
    width: 100,
    height: 100,
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