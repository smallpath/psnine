import React, { Component } from 'react'
import {
  RefreshControl,
  FlatList,
  Animated
} from 'react-native'

import { connect } from 'react-redux'
import { getTopicList } from '../../redux/action/community.js'

import TopicItem from '../../component/CommunityItem'
import NewsItem from '../../component/NewsItem'
import FooterProgress from '../../component/FooterProgress'

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList)

declare var global

class Community extends Component<any, any> {
  static navigationOptions = {
    tabBarLabel: '社区',
    drawerLabel: '社区'
  }

  constructor(props) {
    super(props)
    this.state = {
      isRefreshing: false,
      isLoadingMore: false
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.communityType !== nextProps.communityType) {
      this._onRefresh(nextProps.communityType)
    } else if (this.props.screenProps.modeInfo.themeName !== nextProps.screenProps.modeInfo.themeName) {

    } else if (this.props.screenProps.searchTitle !== nextProps.screenProps.searchTitle) {

    } else {

      this.setState({
        isRefreshing: false,
        isLoadingMore: false
      }, () => {
        // this.props.community.topicPage === 1 && this.flatlist.getNode().scrollToOffset({ offset: 1, animated: true })
        // const { community: item } = this.props
        // if (item.topicPage > 1) {
        //   const max = item.topics.length / item.topicPage
        //   const target = max * (item.topicPage - 1)
        //   setTimeout(() => this.flatlist.getNode().scrollToIndex({ index: target, viewPosition: 1, viewOffset: 50, animated: true }))
        //   // console.log(this.contentOffset + 50)
        // }
      })
    }
  }

  componentWillMount() {
    const { community: communityReducer } = this.props
    const { registerAfterEach } = this.props.screenProps
    if (communityReducer.topicPage === 0) {
      // this._onRefresh(
      //   communityType,
      //   searchTitle
      // )
      this.setState({
        isRefreshing: true
      })
    }
    registerAfterEach({
      index: 1,
      handler: (
        searchTitle
      ) => {
        const { communityType } = this.props
        this._onRefresh(
          communityType,
          searchTitle
        )
      }
    })
  }

  _onRefresh: any = (type, searchTitle) => {
    const { dispatch, communityType } = this.props
    this.setState({
      isRefreshing: true
    })
    this.flatlist && this.flatlist.getNode().scrollToOffset({ offset: 0, animated: true })
    // console.log(type === '' ? communityType : type, communityType, type, '====>')
    dispatch(getTopicList(1, {
        type: typeof type === 'undefined' ? communityType : type,
        title: typeof searchTitle !== 'undefined' ? searchTitle : this.props.screenProps.searchTitle
      })
    )
  }

  flatlist: any = false
  refreshControl: any = false

  _loadMoreData = () => {
    const { community: communityReducer, dispatch, communityType } = this.props
    const { searchTitle } = this.props.screenProps

    let page = communityReducer.topicPage + 1
    dispatch(getTopicList(page, {
        type: communityType,
        title: searchTitle
      })
    )
  }

  _onEndReached = () => {
    if (this.state.isRefreshing || this.state.isLoadingMore) return

    this.setState({
      isLoadingMore: true
    })
    this._loadMoreData()
  }

  ITEM_HEIGHT = 74 + 7

  _renderItem = ({ item: rowData }) => {
    const { modeInfo, navigation, toolbarDispatch } = this.props.screenProps
    const { ITEM_HEIGHT } = this
    // console.log(rowData)
    if (rowData.newsType) {
      return <NewsItem {...{
        navigation,
        rowData,
        modeInfo,
        toolbarDispatch
      }} />
    }
    return <TopicItem {...{
      navigation,
      rowData,
      modeInfo,
      ITEM_HEIGHT,
      toolbarDispatch
    }} />
  }

  render() {
    const { community: reducer, communityType } = this.props
    const { modeInfo } = this.props.screenProps
    global.log('Community.js rendered')
    // console.log('Community.js rendered');
    return (
      <AnimatedFlatList style={{
        flex: 1,
        backgroundColor: modeInfo.background
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
        keyExtractor={(item) => `${item.id}::${item.views}::${item.count}::${item.avatar}`}
        renderItem={this._renderItem}
        onEndReached={this._onEndReached}
        onEndReachedThreshold={0.5}
        extraData={modeInfo}
        windowSize={21}
        updateCellsBatchingPeriod={1}
        initialNumToRender={42}
        maxToRenderPerBatch={8}
        disableVirtualization={false}
        key={modeInfo.themeName + communityType}
        renderScrollComponent={props => <global.NestedScrollView {...props} showsVerticalScrollIndicator={true}/>}
        numColumns={modeInfo.numColumns}
        getItemLayout={communityType !== 'news' ? (_, index) => (
          {length: this.ITEM_HEIGHT, offset: this.ITEM_HEIGHT * index, index}
        ) : null}
        viewabilityConfig={{
          minimumViewTime: 1,
          viewAreaCoveragePercentThreshold: 0,
          waitForInteractions: true
        }}
      />
    )
  }

}

function mapStateToProps(state) {
  // console.log(state.app.communityType, 'mapStateToProps')
  return {
    community: state.community,
    communityType: state.app.communityType
  }
}

export default connect(
  mapStateToProps
)(Community)
