import React, { Component } from 'react'
import {
  StyleSheet,
  RefreshControl,
  SectionList,
  Animated,
  FlatList
} from 'react-native'

import { connect } from 'react-redux'
import { getList } from '../../redux/action/trade'

import FooterProgress from '../../component/FooterProgress'
const AnimatedSectionList = Animated.createAnimatedComponent(SectionList)

let toolbarHeight = 56
let releasedMarginTop = 0

import TradeItem from '../../component/TradeItem'
const AnimatedFlatList = Animated.createAnimatedComponent(FlatList)

class Trade extends Component {
  static navigationOptions = {
    tabBarLabel: '闲游',
    drawerLabel: '闲游'
  }

  constructor(props) {
    super(props)
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
    const { reducer } = this.props
    const { searchTitle, registerAfterEach } = this.props.screenProps

    if (reducer.page === 0) {
      this._onRefresh(
        searchTitle
      )
    }
    registerAfterEach({
      index: 8,
      handler: (searchTitle) => {
        this._onRefresh(
          searchTitle
        )
      }
    })
  }

  _onRefresh = (searchTitle) => {
    const { reducer, dispatch } = this.props
    // const { circleType } = this.props.screenProps

    this.setState({
      isRefreshing: true
    })
    this.flatlist && this.flatlist.getNode().scrollToOffset({ offset: 0, animated: true })
    dispatch(getList(1, {
        title: typeof searchTitle !== 'undefined' ? searchTitle : this.props.screenProps.searchTitle
      })
    )
  }

  _loadMoreData = () => {
    const { reducer, dispatch } = this.props
    const { searchTitle } = this.props.screenProps

    let page = reducer.page + 1
    dispatch(getList(page, {
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

  _renderItem = ({ item: rowData, index }) => {
    const { modeInfo, navigation } = this.props.screenProps
    return <TradeItem {...{
      navigation,
      rowData,
      modeInfo
    }} />
  }

  render() {
    const { reducer } = this.props
    const { modeInfo } = this.props.screenProps
    log('Trade.js rendered')
    // console.log(reducer.page, reducer.list)
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
        renderScrollComponent={props => <global.NestedScrollView {...props}/>}
        disableVirtualization={false}
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
    height: 50
  }
})

function mapStateToProps(state) {
  return {
    reducer: state.trade
  }
}

export default connect(
  mapStateToProps
)(Trade)
