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
  Animated
} from 'react-native';

import { connect } from 'react-redux';
import { getTopicList } from '../../actions/community.js';
import { standardColor, nodeColor, idColor } from '../../constants/colorConfig';

import { getTopicURL } from '../../dao';

import { changeScrollType } from '../../actions/app';

import CommunityTopicItem from '../shared/CommunityTopicItem'

let toolbarHeight = 56;
let releasedMarginTop = 0;
let prevPosition = -1;

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

class progress extends Component {
  shouldComponentUpdate = () => false
  render() {
    return (
      <View style={{flexDirection:'row', flex: 1, height: 15, alignItems: 'flex-end'}}>
        <ProgressBarAndroid style={{flex:1,
          height: 15,
          transform: [
            {
              rotateZ: '180deg'
            }
          ]
        }}  styleAttr="Horizontal"/>
        <ProgressBarAndroid style={{flex:1,height: 15,}} styleAttr="Horizontal" />
      </View>
    )
  }
}

class Community extends Component {
  static navigationOptions = {
    tabBarLabel: '社区'
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    }
  }

  componentWillReceiveProps = (nextProps) => {
    if (this.props.screenProps.communityType != nextProps.screenProps.communityType) {
      this.props.screenProps.communityType = nextProps.screenProps.communityType;
      this._onRefresh(nextProps.screenProps.communityType);
    } else if (this.props.screenProps.modeInfo.isNightMode != nextProps.screenProps.modeInfo.isNightMode) {
      this.props.screenProps.modeInfo = nextProps.screenProps.modeInfo;
    } else if (this.props.screenProps.searchTitle !== nextProps.screenProps.searchTitle) {
      this._onRefresh(
        this.props.screenProps.communityType, 
        nextProps.screenProps.searchTitle
      )
    } else {
      // this.refreshControl && this.refreshControl._nativeRef.setNativeProps({
      //   refreshing: false,
      // });
      // this.isLoading = false
      this.setState({
        isLoading: false
      })
      this.isReceiving = true
    }
    this.flatlist.getNode().recordInteraction()
  }

  isReceiving = false
  componentDidMount = () => {
    const { community: communityReducer } = this.props;
    const { communityType, searchTitle } = this.props.screenProps
    if (communityReducer.topicPage == 0) {
      this._onRefresh(
        communityType, 
        searchTitle
      )
    }
  }

  _onRefresh = (type = '', searchTitle = '') => {
    const { community: communityReducer, dispatch } = this.props;
    const { communityType } = this.props.screenProps

    this.refreshControl._nativeRef.setNativeProps({
      refreshing: true,
    });

    dispatch(getTopicList(1, {
        type,
        title: typeof searchTitle !== 'undefined' ? searchTitle : this.props.screenProps.searchTitle
      })
    );
  }

  _scrollToTop = () => {
    this.listView.scrollTo({ y: 0, animated: true });
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
    if (this.state.isLoading === true) return

    // this.setState({
    //   isLoading: true
    // }, () => {
      this._loadMoreData();
    // })
  }

  isLoading = true
  ITEM_HEIGHT = 78 + 7

  _renderItem = ({ item: rowData, index }) => {
    const { modeInfo, navigation } = this.props.screenProps
    const { ITEM_HEIGHT } = this
    return <CommunityTopicItem {...{
      navigation,
      rowData,
      modeInfo,
      ITEM_HEIGHT
    }} />
  }

  render() {
    const { community: reducer } = this.props;
    const { modeInfo } = this.props.screenProps
    // console.log('Community.js rendered');

    return (
      <AnimatedFlatList style={{
        flex: 1,
        backgroundColor: modeInfo.backgroundColor
      }}
        ref={flatlist => this.flatlist = flatlist}
        refreshControl={
          <RefreshControl
            refreshing={this.state.isLoading}
            onRefresh={this._onRefresh}
            colors={[modeInfo.standardColor]}
            progressBackgroundColor={modeInfo.backgroundColor}
            ref={ref => this.refreshControl = ref}
          />
        }
        ListFooterComponent={progress}
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

function mapStateToProps(state) {
  return {
    community: state.community
  };
}

export default connect(
  mapStateToProps
)(Community);
