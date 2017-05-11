import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  Image,
  TouchableNativeFeedback,
  RefreshControl,
  InteractionManager
} from 'react-native';

import { connect } from 'react-redux';
import { standardColor, nodeColor, idColor } from '../../constants/colorConfig';
import { getGeneList } from '../../actions/gene.js';

import { getGeneURL } from '../../dao';

let toolbarHeight = 56;
let releasedMarginTop = 0;

let dataSource = new ListView.DataSource({
  rowHasChanged: (row1, row2) => {
    return row1.id !== row2.id || row1.views !== row2.views || row1.count !== row2.count;
  },
});

class Gene extends Component {
  static navigationOptions = {
    drawerLabel: '基因'
  };

  constructor(props) {
    super(props);
  }

  _renderSeparator(sectionID: number, rowID: number, adjacentRowHighlighted: bool) {
    return (
      <View
        key={`${sectionID}-${rowID}`}
        style={{ height: 1, backgroundColor: 'rgba(0, 0, 0, 0.1)', marginLeft: 10, marginRight: 10 }}
      />
    );
  }

  _onRowPressed = (rowData) => {
    const { navigation } = this.props.screenProps;
    const URL = getGeneURL(rowData.id);
    navigation.navigate('CommunityTopic', {
      URL,
      title: rowData.title,
      rowData,
      type: 'gene',
      shouldBeSawBackground: true
    })
  }


  _renderRow = (rowData,
    sectionID: number | string,
    rowID: number | string,
    highlightRow: (sectionID: number, rowID: number) => void
  ) => {
    const { modeInfo } = this.props.screenProps
    let TouchableElement = TouchableNativeFeedback;

    let imageArr = rowData.thumbs;
    let type = rowData.type;

    const imageItems = imageArr.map((value, index) => (<Image key={rowData.id + '' + index} source={{ uri: value }} style={styles.geneImage} />));

    return (
      <View rowID={rowID} style={{
        marginTop: 7,
        marginLeft: 7,
        marginRight: 7,
        backgroundColor: modeInfo.backgroundColor,
        elevation: 2,
      }}>
        <TouchableElement
          onPress={() => { this._onRowPressed(rowData) }}
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
                style={{ flex: -1, color: modeInfo.titleTextColor, }}>
                {rowData.content}
              </Text>
              <View style={{ flex: -1, flexDirection: 'row', flexWrap: 'wrap', marginTop: 5, marginBottom: 5 }}>
                {imageItems}
              </View>
              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', }}>
                <Text style={{ fontSize: 12, flex: -1, color: idColor, textAlign: 'center', textAlignVertical: 'center' }} onPress={
                  () => {
                    this.props.screenProps.navigation.navigate('Home', {
                      title: rowData.psnid,
                      id: rowData.psnid,
                      URL: `http://psnine.com/psnid/${rowData.psnid}`
                    })
                  }
                }>{rowData.psnid}</Text>
                <Text style={{ fontSize: 12, flex: -1, color: modeInfo.standardTextColor, textAlign: 'center', textAlignVertical: 'center' }}>{rowData.date}</Text>
                <Text style={{ fontSize: 12, flex: -1, color: modeInfo.standardTextColor, textAlign: 'center', textAlignVertical: 'center' }}>{rowData.count}</Text>
                <Text style={{ fontSize: 12, flex: -1, color: modeInfo.standardTextColor, textAlign: 'center', textAlignVertical: 'center' }}>{rowData.circle}</Text>
              </View>

            </View>

          </View>
        </TouchableElement>
      </View>
    )
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.screenProps.geneType != nextProps.screenProps.geneType) {
      this.props.screenProps.geneType = nextProps.screenProps.geneType;
      this._onRefresh(nextProps.screenProps.geneType);
    } else if (this.props.screenProps.modeInfo.isNightMode != nextProps.screenProps.modeInfo.isNightMode) {
      this.props.screenProps.modeInfo = nextProps.screenProps.modeInfo;
    }
  }

  componentDidUpdate = () => {
    const { gene: geneReducer } = this.props;

    if (geneReducer.genePage == 1) {
      this._scrollToTop();
    } else {
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
    this.listView.scrollTo({ y: 0, animated: true });
  }

  _loadMoreData = () => {
    const { gene: geneReducer, dispatch } = this.props;
    const { geneType } = this.props.screenProps
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
    const { modeInfo } = this.props.screenProps
    dataSource = dataSource.cloneWithRows(geneReducer.genes);
    return (
      <ListView
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={this._onRefresh}
            colors={[standardColor]}
            ref={ref => this.refreshControl = ref}
            progressBackgroundColor={modeInfo.backgroundColor}
          />
        }
        key={modeInfo.isNightMode}
        style={{ backgroundColor: modeInfo.backgroundColor }}
        ref={listView => this.listView = listView}
        pageSize={32}
        removeClippedSubviews={false}
        enableEmptySections={true}
        onEndReached={this._onEndReached}
        onEndReachedThreshold={10}
        dataSource={dataSource}
        renderRow={this._renderRow}
        onLayout={event => {
          this.listViewHeight = event.nativeEvent.layout.height
        }}
        onContentSizeChange={() => {
          if (geneReducer.genePage == 1)
            return;

          this.listView.scrollTo({ y: this.currentHeight + 60 - this.listViewHeight, animated: true })
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
    height: 100
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