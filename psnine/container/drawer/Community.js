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
  ProgressBarAndroid,
  Animated,
  Alert
} from 'react-native';

import { connect } from 'react-redux';
import { getTopicList } from '../../actions/community.js';
import { standardColor, nodeColor, idColor } from '../../constants/colorConfig';

import { getTopicURL } from '../../dao';

import { changeScrollType } from '../../actions/app';

import TopicItem from '../shared/CommunityItem'
import FooterProgress from '../shared/FooterProgress'

let toolbarHeight = 56;
let releasedMarginTop = 0;
let prevPosition = -1;

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

class Community extends Component {
  static navigationOptions = {
    tabBarLabel: '社区',
    drawerLabel: '社区'
  };

  constructor(props) {
    super(props);
    this.state = {
      isRefreshing: false,
      isLoadingMore: false,
    }
  }

  shouldOnRefreshForSearch = false

  componentWillReceiveProps = (nextProps) => {
    let shouldCall = nextProps.segmentedIndex === 0
    let empty = () => {}
    let cb = empty
    if (this.props.screenProps.communityType != nextProps.screenProps.communityType) {
      cb = () => this._onRefresh(nextProps.screenProps.communityType);
    } else if (this.props.screenProps.modeInfo.themeName != nextProps.screenProps.modeInfo.themeName) {
      cb = () => {}
    } else if (this.props.screenProps.searchTitle !== nextProps.screenProps.searchTitle) {
      if (shouldCall) {
        cb = () => this._onRefresh(
          this.props.screenProps.communityType, 
          nextProps.screenProps.searchTitle
        )
      } else {
        cb = () => this.shouldOnRefreshForSearch = true
        shouldCall = true
      }
    } else {
      if (this.shouldOnRefreshForSearch === true && shouldCall) {
        // this.shouldOnRefreshForSearch = false
        cb = () => this._onRefresh(
          this.props.screenProps.communityType, 
          nextProps.screenProps.searchTitle
        )
      } else {
        cb = () => {
          this.setState({
            isRefreshing: false,
            isLoadingMore: false
          })
        }
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
    if (nextProps.segmentedIndex !== 0) return false
    if (this.props.segmentedIndex !== 0) {
      if (this.shouldOnRefreshForSearch === true) {
        this.shouldOnRefreshForSearch = false
        return true
      }
      if (nextProps.screenProps.searchTitle === this.props.screenProps.searchTitle) return false
    }
    return true
  }

  componentWillMount = () => {
    const { community: communityReducer } = this.props;
    const { communityType, searchTitle } = this.props.screenProps
    if (communityReducer.topicPage == 0) {
      this._onRefresh(
        communityType, 
        searchTitle
      )
    }
  }

  _onRefresh = (type = '', searchTitle) => {
    const { community: communityReducer, dispatch } = this.props;
    const { communityType } = this.props.screenProps

    this.setState({
      isRefreshing: true
    })

    dispatch(getTopicList(1, {
        type,
        title: typeof searchTitle !== 'undefined' ? searchTitle : this.props.screenProps.searchTitle
      })
    );
  }

  _loadMoreData = () => {
    const { community: communityReducer, dispatch } = this.props;
    const { communityType, searchTitle } = this.props.screenProps

    let page = communityReducer.topicPage + 1;
    dispatch(getTopicList(page, {
        type: communityType,
        title: searchTitle
      })
    );
  }

  _onEndReached = () => {
    if (this.state.isRefreshing || this.state.isLoadingMore) return

    this.setState({
      isLoadingMore: true
    })
    this._loadMoreData();
  }

  ITEM_HEIGHT = 78 + 7

  _renderItem = ({ item: rowData, index }) => {
    const { modeInfo, navigation } = this.props.screenProps
    const { ITEM_HEIGHT } = this
    return <TopicItem {...{
      navigation,
      rowData,
      modeInfo,
      ITEM_HEIGHT
    }} />
  }

  render() {
    const { community: reducer } = this.props;
    const { modeInfo } = this.props.screenProps
    log('Community.js rendered');

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
        data={reducer.topics}
        keyExtractor={(item, index) => `${item.id}::${item.views}::${item.count}`}
        renderItem={this._renderItem}
        onEndReached={this._onEndReached}
        onEndReachedThreshold={0.5}
        extraData={modeInfo}
        windowSize={21}
        updateCellsBatchingPeriod={1}
        initialNumToRender={42}
        maxToRenderPerBatch={8}
        disableVirtualization={false}
        contentContainerStyle={styles.list}
        getItemLayout={(data, index) => (
          {length: this.ITEM_HEIGHT, offset: this.ITEM_HEIGHT * index, index}
        )}
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
  }
});

function mapStateToProps(state, ownProps) {
  return {
    community: state.community,
    segmentedIndex: state.app.segmentedIndex
  };
}

export default connect(
  mapStateToProps
)(Community);
