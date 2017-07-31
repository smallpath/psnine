import React, { Component } from 'react'
import {
  RefreshControl,
  Animated,
  FlatList
} from 'react-native'

import { connect } from 'react-redux'
import { getCircleList as getList } from '../../redux/action/circle'

import FooterProgress from '../../component/FooterProgress'

import CircleItem from '../../component/CircleItem'

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList)

declare var global

class Circle extends Component<any, any> {
  static navigationOptions = {
    tabBarLabel: '圈子',
    drawerLabel: '圈子'
  }

  constructor(props) {
    super(props)
    this.state = {
      isRefreshing: false,
      isLoadingMore: false
    }
  }

  shouldOnRefreshForSearch = false

  componentWillReceiveProps(nextProps) {
    let shouldCall = nextProps.segmentedIndex === 7
    let empty = () => {}
    let cb = empty
    if (this.props.screenProps.circleType !== nextProps.screenProps.circleType) {
      cb = () => this._onRefresh(nextProps.screenProps.circleType)
    } else if (this.props.screenProps.modeInfo.themeName !== nextProps.screenProps.modeInfo.themeName) {
      cb = () => {}
    } else if (this.props.screenProps.searchTitle !== nextProps.screenProps.searchTitle) {
      if (shouldCall) {
        cb = () => this._onRefresh(
          this.props.screenProps.circleType,
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
          this.props.screenProps.circleType,
          nextProps.screenProps.searchTitle
        )
      } else {
        cb = () => this.setState({
          isRefreshing: false,
          isLoadingMore: false
        }, () => {
          // this.props.reducer.page === 1 && this.flatlist.scrollToOffset({ offset: 0, animated: true })
        })
      }
    }
    if (shouldCall) {
      cb && cb()
    }
  }

  componentWillMount() {
    const { reducer } = this.props
    const { circleType, searchTitle } = this.props.screenProps

    if (reducer.page === 0) {
      this._onRefresh(
        circleType,
        searchTitle
      )
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.screenProps.modeInfo.themeName !== nextProps.screenProps.modeInfo.themeName) {
      return true
    }
    if (nextState.isRefreshing !== this.state.isRefreshing) {
      if (this.shouldOnRefreshForSearch === true) this.shouldOnRefreshForSearch = false
      return true
    }
    if (nextProps.segmentedIndex !== 7) return false
    if (this.props.segmentedIndex !== 7) {
      if (this.shouldOnRefreshForSearch === true) {
        this.shouldOnRefreshForSearch = false
        return true
      }
      if (nextProps.screenProps.searchTitle === this.props.screenProps.searchTitle) return false
    }
    return true
  }

  _onRefresh = (type = '', searchTitle?) => {
    const { dispatch } = this.props

    this.setState({
      isRefreshing: true
    })
    this.flatlist && this.flatlist.getNode().scrollToOffset({ offset: 0, animated: true })
    dispatch(getList(1, {
        type,
        title: typeof searchTitle !== 'undefined' ? searchTitle : this.props.screenProps.searchTitle
      })
    )
  }

  flatlist: any = false

  _loadMoreData = () => {
    const { reducer, dispatch } = this.props
    const { circleType, searchTitle } = this.props.screenProps

    let page = reducer.page + 1
    dispatch(getList(page, {
        type: circleType,
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

    const { modeInfo, navigation } = this.props.screenProps
    const { ITEM_HEIGHT } = this
    return <CircleItem {...{
      navigation,
      rowData,
      modeInfo,
      ITEM_HEIGHT
    }} />
  }

  refreshControl: any = false

  render() {
    const { reducer } = this.props
    const { modeInfo } = this.props.screenProps
    global.log('Circle.js rendered')
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
            colors={[modeInfo.accentColor]}
            progressBackgroundColor={modeInfo.backgroundColor}
            ref={ref => this.refreshControl = ref}
          />
        }
        ListFooterComponent={() => <FooterProgress isLoadingMore={this.state.isLoadingMore} modeInfo={modeInfo} modeInfo={modeInfo} />}
        data={reducer.list}
        keyExtractor={(item) => item.href}
        renderItem={this._renderItem}
        onEndReached={this._onEndReached}
        onEndReachedThreshold={0.5}
        extraData={modeInfo}
        windowSize={21}
        updateCellsBatchingPeriod={1}
        initialNumToRender={42}
        maxToRenderPerBatch={8}
        disableVirtualization={false}
        getItemLayout={(_, index) => (
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

function mapStateToProps(state) {
  return {
    reducer: state.circle,
    segmentedIndex: state.app.segmentedIndex
  }
}

export default connect(
  mapStateToProps
)(Circle)
