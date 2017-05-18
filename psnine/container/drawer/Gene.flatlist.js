import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  Image,
  TouchableNativeFeedback,
  RefreshControl,
  InteractionManager,
  FlatList
} from 'react-native';

import { connect } from 'react-redux';
import { standardColor, nodeColor, idColor } from '../../constants/colorConfig';
import { getGeneList } from '../../actions/gene.js';

import { getGeneURL } from '../../dao';

let toolbarHeight = 56;
let releasedMarginTop = 0;

import TopicItem from '../shared/GeneItem'
import FooterProgress from '../shared/FooterProgress'

class Gene extends Component {
  static navigationOptions = {
    tabBarLabel: '基因',
    drawerLabel: '基因'
  };

  constructor(props) {
    super(props);
    this.state = {
      isRefreshing: true,
      isLoadingMore: false
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.screenProps.geneType != nextProps.screenProps.geneType) {
      this.props.screenProps.geneType = nextProps.screenProps.geneType;
      this._onRefresh(nextProps.screenProps.geneType);
    } else if (this.props.screenProps.modeInfo.isNightMode != nextProps.screenProps.modeInfo.isNightMode) {
      this.props.screenProps.modeInfo = nextProps.screenProps.modeInfo;
    } else if (this.props.screenProps.searchTitle !== nextProps.screenProps.searchTitle) {
      this._onRefresh(
        this.props.screenProps.geneType,
        nextProps.screenProps.searchTitle
      )
    } else {
      this.setState({
        isRefreshing: false,
        isLoadingMore: false
      })
    }
  }

  componentDidUpdate = () => {

  }

  componentDidMount = () => {
    const { gene: geneReducer } = this.props;
    if (geneReducer.genePage == 0)
      this._onRefresh();
  }


  _onRefresh = (type = '', title) => {
    const { gene: geneReducer, dispatch } = this.props;

    this.setState({
      isRefreshing: true
    })

    dispatch(getGeneList(1, {
      type,
      title: typeof title !== 'undefined' ? title : this.props.screenProps.searchTitle
    }));

  }

  _loadMoreData = () => {
    const { gene: geneReducer, dispatch } = this.props;
    const { geneType } = this.props.screenProps
    let page = geneReducer.genePage + 1;
    dispatch(getGeneList(page, {
      type: geneType,
      title: this.props.screenProps.searchTitle
    }));
  }

  _onEndReached = () => {
    const { gene: geneReducer, dispatch } = this.props;
    if (this.state.isRefreshing || this.state.isLoadingMore) return

    this.setState({
      isLoadingMore: true
    })

    this._loadMoreData();
  }

  _renderItem = ({ item: rowData, index }) => {
    const { modeInfo, navigation } = this.props.screenProps
    return <TopicItem {...{
      navigation,
      rowData,
      modeInfo
    }} />
  }

  render() {
    // console.log('Gene.js rendered');
    const { gene: geneReducer } = this.props;
    const { modeInfo } = this.props.screenProps

    return (
      <FlatList style={{
        flex: 1,
        backgroundColor: modeInfo.backgroundColor
      }}
        ref={flatlist => this.flatlist = flatlist}
        refreshControl={
          <RefreshControl
            refreshing={this.state.isRefreshing}
            onRefresh={this._onRefresh}
            colors={[modeInfo.standardColor]}
            progressBackgroundColor={modeInfo.backgroundColor}
            ref={ref => this.refreshControl = ref}
          />
        }
        ListFooterComponent={() => <FooterProgress isLoadingMore={this.state.isLoadingMore} />}
        data={geneReducer.genes}
        keyExtractor={(item, index) => `${item.id}::${item.views}::${item.count}`}
        renderItem={this._renderItem}
        onEndReached={this._onEndReached}
        onEndReachedThreshold={0.5}
        extraData={modeInfo}
        windowSize={21}
        updateCellsBatchingPeriod={1}
        initialNumToRender={42}
        maxToRenderPerBatch={8}
        disableVirtualization={true}
        contentContainerStyle={styles.list}
        viewabilityConfig={{
          minimumViewTime: 1,
          viewAreaCoveragePercentThreshold: 0,
          waitForInteractions: true
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