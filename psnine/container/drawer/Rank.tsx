import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  RefreshControl,
  Picker,
  FlatList,
  Animated
} from 'react-native'

import { connect } from 'react-redux'
import { getRankList } from '../../redux/action/rank.js'

import TopicItem from '../../component/RankItem'
import FooterProgress from '../../component/FooterProgress'

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList)

let toolbarHeight = 56
let releasedMarginTop = 0
let prevPosition = -1

class Rank extends Component {
  static navigationOptions = {
    tabBarLabel: '排行',
    drawerLabel: '排行'
  }

  constructor(props) {
    super(props)

    this.state = {
      server: 'hk',
      sort: 'point',
      cheat: '0',
      isRefreshing: false,
      isLoadingMore: false
    }
  }

  _renderHeader = () => {
    const { modeInfo } = this.props.screenProps
    return (
      <View style={{
        flex: -1,
        elevation: 2,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        paddingTop: 3,
        backgroundColor: modeInfo.backgroundColor
      }}>
            {/*server: 'hk',
      sort: 'point',
      cheat: '0'*/}
        <Picker style={{
          flex: 3,
          borderWidth: 1,
          color: modeInfo.standardTextColor
        }}
          prompt='选择排序'
          selectedValue={this.state.sort}
          onValueChange={this.onValueChange.bind(this, 'sort')}>
          <Picker.Item label='最后更新' value='datadate' />
          <Picker.Item label='等级排行' value='point' />
          <Picker.Item label='游戏最多' value='totalgame' />
          <Picker.Item label='完美率' value='rarity' />
          <Picker.Item label='签到最多' value='qidao' />
          <Picker.Item label='N币最多' value='nb' />
          <Picker.Item label='Z币最多' value='zb' />
        </Picker>
        <Picker style={{
          flex: 2.5,
          borderWidth: 1,
          color: modeInfo.standardTextColor
        }}
          prompt='选服'
          selectedValue={this.state.server}
          onValueChange={this.onValueChange.bind(this, 'server')}>
          <Picker.Item label='所有' value='all' />
          <Picker.Item label='国服' value='cn' />
          <Picker.Item label='港服' value='hk' />
          <Picker.Item label='日服' value='jp' />
          <Picker.Item label='台服' value='tw' />
          <Picker.Item label='美服' value='us' />
          <Picker.Item label='英服' value='gb' />
          <Picker.Item label='加服' value='ca' />
        </Picker>
        <Picker style={{
          flex: 3,
          color: modeInfo.standardTextColor
        }}
          prompt='排序'
          selectedValue={this.state.cheat}
          onValueChange={this.onValueChange.bind(this, 'cheat')}>
          <Picker.Item label='身家清白' value='0' />
          <Picker.Item label='浪子回头' value='1' />
          <Picker.Item label='无可救药' value='2' />
        </Picker>
      </View>
    )
  }

  onValueChange = (key: string, value: string) => {
    const newState = {}
    newState[key] = value
    this.setState(newState, () => {
      this._onRefresh()
    })
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
    const { rank: reducer } = this.props
    const { registerAfterEach, searchTitle } = this.props.screenProps
    if (reducer.page === 0) {
      this._onRefresh(
        searchTitle
      )
    }
    registerAfterEach({
      index: 6,
      handler: (searchTitle) => {
        this._onRefresh(
          searchTitle
        )
      }
    })
  }

  _onRefresh = (title) => {
    const { rank: reducer, dispatch } = this.props

    this.setState({
      isRefreshing: true
    })
    this.flatlist && this.flatlist.getNode().scrollToOffset({ offset: 0, animated: true })
    const { server, sort, cheat } = this.state
    dispatch(getRankList(1, {
      sort, server, cheat,
      title: typeof title !== 'undefined' ? title : this.props.screenProps.searchTitle
    }))
  }

  _loadMoreData = () => {
    const { rank: reducer, dispatch } = this.props
    const { server, sort, cheat } = this.state
    let page = reducer.page + 1
    dispatch(getRankList(page, {
      sort, server, cheat,
      title: this.props.screenProps.searchTitle
    }))
  }

  _onEndReached = () => {
    const { rank: reducer } = this.props

    if (reducer.page === reducer.totalPage) return
    if (this.state.isRefreshing || this.state.isLoadingMore) return

    this.setState({
      isLoadingMore: true
    })
    this._loadMoreData()
  }

  ITEM_HEIGHT = 93 + 7

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
    const { rank: reducer } = this.props
    const { modeInfo } = this.props.screenProps
    log('Rank.js rerendered')
    return (
      <View style={{ backgroundColor: modeInfo.background, flex: 1 }}>
        {this._renderHeader()}
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
          data={reducer.ranks}
          keyExtractor={(item, index) => `${item.psnid}::${item.rank}`}
          renderItem={this._renderItem}
          onEndReached={this._onEndReached}
          onEndReachedThreshold={0.5}
          renderScrollComponent={props => <NestedScrollView {...props}/>}
          extraData={modeInfo}
          windowSize={21}
          updateCellsBatchingPeriod={1}
          initialNumToRender={42}
          maxToRenderPerBatch={8}
          numColumns={modeInfo.numColumns}
          key={modeInfo.themeName}
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
      </View>
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
    rank: state.rank
  }
}

export default connect(
  mapStateToProps
)(Rank)
