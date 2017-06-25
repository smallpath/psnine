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
    tabBarLabel: '机因',
    drawerLabel: '机因'
  };

  constructor(props) {
    super(props);
    this.state = {
      isRefreshing: false,
      isLoadingMore: false
    }
  }

  shouldOnRefreshForSearch = false
  componentWillReceiveProps = (nextProps) => {
    let shouldCall = nextProps.segmentedIndex === 3
    let empty = () => {}
    let cb = empty
    if (this.props.screenProps.geneType != nextProps.screenProps.geneType) {
      cb = () => this._onRefresh(nextProps.screenProps.geneType);
    } else if (this.props.screenProps.modeInfo.themeName != nextProps.screenProps.modeInfo.themeName) {
      cb = () => {}
    } else if (this.props.screenProps.searchTitle !== nextProps.screenProps.searchTitle) {
      if (shouldCall) {
        cb = () => this._onRefresh(
          this.props.screenProps.geneType, 
          nextProps.screenProps.searchTitle
        )
      } else {
        cb = () => this.shouldOnRefreshForSearch = true
        shouldCall = true
      }
    } else {
      if (this.shouldOnRefreshForSearch === true && shouldCall) {
        this.shouldOnRefreshForSearch = false
        cb = () => this._onRefresh(
          this.props.screenProps.geneType, 
          nextProps.screenProps.searchTitle
        )
      } else {
        cb = () => this.setState({
          isRefreshing: false,
          isLoadingMore: false
        }, () => {
          // this.props.gene.genePage === 1 && this.flatlist.scrollToOffset({ offset: 0, animated: true })
        })
      }
    }
    if (shouldCall) {
      cb && cb()
    }
  }


  shouldComponentUpdate = (nextProps, nextState) => {
    if (this.props.screenProps.modeInfo.themeName != nextProps.screenProps.modeInfo.themeName) {
      return true
    }
    if (nextState.isRefreshing !== this.state.isRefreshing) {
      if (this.shouldOnRefreshForSearch === true) this.shouldOnRefreshForSearch = false
      return true
    }
    if (nextProps.segmentedIndex !== 3) return false
    if (this.props.segmentedIndex !== 3) {
      if (this.shouldOnRefreshForSearch === true) {
        this.shouldOnRefreshForSearch = false
        return true
      }
      if (nextProps.screenProps.searchTitle === this.props.screenProps.searchTitle) return false
    }
    return true
  }

  componentWillMount = () => {
    const { gene: geneReducer } = this.props;
    if (geneReducer.genePage == 0)
      this._onRefresh();
  }


  _onRefresh = (type = '', title) => {
    const { gene: geneReducer, dispatch } = this.props;

    this.setState({
      isRefreshing: true
    })
    this.flatlist && this.flatlist.scrollToOffset({ offset: 0, animated: true })
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
    log('Gene.js rendered');
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
            colors={[modeInfo.accentColor]}
            progressBackgroundColor={modeInfo.backgroundColor}
            ref={ref => this.refreshControl = ref}
          />
        }
        ListFooterComponent={() => <FooterProgress isLoadingMore={this.state.isLoadingMore} modeInfo={modeInfo} />}
        data={geneReducer.genes}
        keyExtractor={(item, index) => `${item.id}::${item.views}::${item.count}`}
        renderItem={this._renderItem}
        onEndReached={this._onEndReached}
        onEndReachedThreshold={0.5}
        extraData={modeInfo}
        windowSize={21}
        updateCellsBatchingPeriod={1}
        key={modeInfo.themeName}
        numColumns={modeInfo.numColumns}
        columnWrapperStyle={{flex: 1}}
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
    segmentedIndex: state.app.segmentedIndex
  };
}

export default connect(
  mapStateToProps
)(Gene);