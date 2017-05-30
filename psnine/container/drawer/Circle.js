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
  SectionList,
  Animated,
  FlatList
} from 'react-native';

import { connect } from 'react-redux';
import { getCircleList as getList } from '../../actions/circle';
import { standardColor, nodeColor, idColor, accentColor } from '../../constants/colorConfig';

import { getBattleURL, getGamePngURL } from '../../dao';
import FooterProgress from '../shared/FooterProgress'

const AnimatedSectionList = Animated.createAnimatedComponent(SectionList);

let toolbarHeight = 56;
let releasedMarginTop = 0;

import CircleItem from '../shared/CircleItem'

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

class Circle extends Component {
  static navigationOptions = {
    tabBarLabel: '圈子',
    drawerLabel: '圈子'
  };

  constructor(props) {
    super(props);
    this.state = {
      isRefreshing: false,
      isLoadingMore: false,
    }
  }

  componentWillReceiveProps = (nextProps) => {
    console.log(this.props.screenProps.circleType, nextProps.screenProps.circleType)
    if (this.props.screenProps.circleType != nextProps.screenProps.circleType) {
      this.props.screenProps.circleType = nextProps.screenProps.circleType;
      this._onRefresh(nextProps.screenProps.circleType);
    } else if (this.props.screenProps.modeInfo.isNightMode != nextProps.screenProps.modeInfo.isNightMode) {
      this.props.screenProps.modeInfo = nextProps.screenProps.modeInfo;
    } else if (this.props.screenProps.searchTitle !== nextProps.screenProps.searchTitle) {
      this._onRefresh(
        this.props.screenProps.circleType, 
        nextProps.screenProps.searchTitle
      )
    } else {
      this.setState({
        isRefreshing: false,
        isLoadingMore: false
      }, () => {
        // const len = this.props.community.topics.length
        // const per = this.props.community.topicPage
        // const target = len / per * (per - 1)
        // if (per === 1) {
        //   setTimeout(() => {
        //     this.flatlist.getNode().scrollToIndex({
        //       animated: true,
        //       viewPosition: 0,
        //       index: 0
        //     })
        //   })
        // } else if(per > 1) {
        //   setTimeout(() => {
        //     this.flatlist.getNode().scrollToIndex({
        //       animated: true,
        //       viewPosition: 0.9,
        //       index: target - 1
        //     })
        //   })
        // }
      })
    }
  }

  componentDidMount = () => {
    const { reducer } = this.props;
    const { circleType, searchTitle } = this.props.screenProps

    if (reducer.page === 0) {
      this._onRefresh(
        circleType, 
        searchTitle
      )
    }
  }

  _onRefresh = (type = '', searchTitle = '') => {
    const { reducer, dispatch } = this.props;
    const { circleType } = this.props.screenProps

    this.setState({
      isRefreshing: true
    })

    dispatch(getList(1, {
        type,
        title: typeof searchTitle !== 'undefined' ? searchTitle : this.props.screenProps.searchTitle
      })
    );
  }

  _loadMoreData = () => {
    const { reducer, dispatch } = this.props;
    const { circleType, searchTitle } = this.props.screenProps

    let page = reducer.page + 1;
    dispatch(getList(page, {
        type: circleType,
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
    return <CircleItem {...{
      navigation,
      rowData,
      modeInfo,
      ITEM_HEIGHT
    }} />
  }

  render() {
    const { reducer } = this.props;
    const { modeInfo } = this.props.screenProps
    // console.log('Community.js rendered');
    // console.log(reducer.page, reducer.list)
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
            colors={[modeInfo.standardColor]}
            progressBackgroundColor={modeInfo.backgroundColor}
            ref={ref => this.refreshControl = ref}
          />
        }
        ListFooterComponent={() => <FooterProgress isLoadingMore={this.state.isLoadingMore} />}
        data={reducer.list}
        keyExtractor={(item, index) => item.href}
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
    reducer: state.circle,
  };
}

export default connect(
  mapStateToProps
)(Circle);
