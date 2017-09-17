import React, { Component } from 'react'
import {
  View,
  RefreshControl,
  Picker,
  FlatList,
  Animated
} from 'react-native'

import { connect } from 'react-redux'
import { getGameList } from '../../redux/action/game.js'

import TopicItem from '../../component/GameItem'
import FooterProgress from '../../component/FooterProgress'

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList)

declare var global

class Game extends Component<any, any> {
  static navigationOptions = {
    tabBarLabel: '游戏',
    drawerLabel: '游戏'
  }

  flatlist: any = false
  refreshControl: any = false

  constructor(props) {
    super(props)

    this.state = {
      pf: 'all',
      sort: 'newest',
      dlc: 'all',
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
        <Picker style={{
          flex: 1,
          borderWidth: 1,
          color: modeInfo.standardTextColor
        }}
          prompt='选择平台'
          selectedValue={this.state.pf}
          onValueChange={this.onValueChange.bind(this, 'pf')}>
          <Picker.Item label='全部' value='all' />
          <Picker.Item label='PSV' value='psvita' />
          <Picker.Item label='PS3' value='ps3' />
          <Picker.Item label='PS4' value='ps4' />
        </Picker>
        <Picker style={{
          flex: 1,
          borderWidth: 1,
          color: modeInfo.standardTextColor
        }}
          prompt='选择DLC'
          selectedValue={this.state.dlc}
          onValueChange={this.onValueChange.bind(this, 'dlc')}>
          <Picker.Item label='全部' value='all' />
          <Picker.Item label='有DLC' value='dlc' />
          <Picker.Item label='无DLC' value='nodlc' />
        </Picker>
        <Picker style={{
          flex: 1.5,
          color: modeInfo.standardTextColor
        }}
          prompt='排序'
          selectedValue={this.state.sort}
          onValueChange={this.onValueChange.bind(this, 'sort')}>
          <Picker.Item label='最新排序' value='newest' />
          <Picker.Item label='玩的最多' value='owner' />
          <Picker.Item label='完美难度' value='difficulty' />
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

  componentWillReceiveProps(nextProps) {
    if (this.props.screenProps.modeInfo.themeName !== nextProps.screenProps.modeInfo.themeName) {

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

  componentWillMount() {
    const { game: gameReducer } = this.props
    const { registerAfterEach, searchTitle } = this.props.screenProps
    if (gameReducer.page === 0) {
      this._onRefresh(
        searchTitle
      )
    }
    registerAfterEach({
      index: 4,
      handler: (searchTitle) => {
        this._onRefresh(
          searchTitle
        )
      }
    })
  }

  _onRefresh = (title?) => {
    const { dispatch } = this.props

    this.setState({
      isRefreshing: true
    })
    this.flatlist && this.flatlist.getNode().scrollToOffset({ offset: 0, animated: true })
    const { pf, sort, dlc } = this.state
    dispatch(
      getGameList(1, {
        sort,
        pf,
        dlc,
        title: typeof title !== 'undefined' ? title : this.props.screenProps.searchTitle
      })
    )
  }

  _loadMoreData = () => {
    const { game: gameReducer, dispatch } = this.props
    const { pf, sort, dlc } = this.state
    let page = gameReducer.page + 1
    dispatch(getGameList(page, {
      sort, pf, dlc,
      title: this.props.screenProps.searchTitle
    }))
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
    return <TopicItem {...{
      navigation,
      rowData,
      modeInfo,
      ITEM_HEIGHT
    }} />
  }

  render() {
    const { game: gameReducer } = this.props
    const { modeInfo } = this.props.screenProps
    global.log('Game.js rendered')
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
          data={gameReducer.games}
          keyExtractor={(item) => `${item.id}::${item.views}::${item.count}`}
          renderItem={this._renderItem}
          onEndReached={this._onEndReached}
          onEndReachedThreshold={0.5}
          extraData={modeInfo}
          windowSize={21}
          updateCellsBatchingPeriod={1}
          initialNumToRender={42}
          maxToRenderPerBatch={8}
          key={modeInfo.themeName}
          numColumns={modeInfo.numColumns}
          renderScrollComponent={props => <global.NestedScrollView {...props}/>}
          disableVirtualization={false}
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

function mapStateToProps(state) {
  return {
    game: state.game
  }
}

export default connect(
  mapStateToProps
)(Game)
