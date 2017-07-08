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
  FlatList,
  Animated
} from 'react-native';

import { connect } from 'react-redux';
import { standardColor, nodeColor, idColor } from '../../constants/colorConfig';
import { getGeneList } from '../../actions/gene.js';

import { getGeneURL } from '../../dao';

let toolbarHeight = 56;
let releasedMarginTop = 0;

import TopicItem from '../shared/GeneItem'
import FooterProgress from '../shared/FooterProgress'

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

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

  componentWillReceiveProps = (nextProps) => {
    if (this.props.screenProps.modeInfo.themeName != nextProps.screenProps.modeInfo.themeName) {

    } else if (this.props.screenProps.searchTitle !== nextProps.screenProps.searchTitle) {

    } else {
      this.setState({
        isRefreshing: false,
        isLoadingMore: false
      }, () => {
        // this.props.community.topicPage === 1 && this.flatlist.getNode().scrollToOffset({ offset: 1, animated: true })
        // if (item.topicPage > 1) {
        //   const max = item.topics.length / item.topicPage
        //   const target = max * (item.topicPage - 1)
        //   setTimeout(() => this.flatlist.getNode().scrollToIndex({ index: target, viewPosition: 1, viewOffset: 50, animated: true }))
        //   // console.log(this.contentOffset + 50)
        // }
      })
    }
  }

  componentWillMount = () => {
    const { gene: geneReducer } = this.props;
    const { registerAfterEach, searchTitle } = this.props.screenProps
    if (geneReducer.genePage == 0) {
      this._onRefresh(
        searchTitle
      )
    }
    registerAfterEach({
      index: 3,
      handler: (searchTitle) => {
        this._onRefresh(
          searchTitle
        )
      }
    })
  }


  _onRefresh = (title, type = '') => {
    const { gene: geneReducer, dispatch } = this.props;

    this.setState({
      isRefreshing: true
    })
    this.flatlist && this.flatlist.getNode().scrollToOffset({ offset: 0, animated: true })
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
      <AnimatedFlatList style={{
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
        renderScrollComponent={props => <NestedScrollView {...props}/>}
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
    gene: state.gene
  };
}

export default connect(
  mapStateToProps
)(Gene);