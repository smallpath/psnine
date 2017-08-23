import React, { Component } from 'react'
import {
  View,
  RefreshControl,
  Picker,
  FlatList,
  Animated,
  Dimensions
} from 'react-native'

import { connect } from 'react-redux'
import { getDiscountList } from '../../redux/action/discount.js'

import TopicItem from '../../component/DiscountItem'
import FooterProgress from '../../component/FooterProgress'

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList)

declare var global

class Game extends Component<any, any> {
  static navigationOptions = {
    tabBarLabel: '数折',
    drawerLabel: '数折'
  }

  flatlist: any = false
  refreshControl: any = false

  constructor(props) {
    super(props)

    this.state = {
      pf: 'all',
      region: 'all',
      ddstatus: 'all',
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
          prompt='选择服务器'
          selectedValue={this.state.region}
          onValueChange={this.onValueChange.bind(this, 'region')}>
          <Picker.Item label='全部' value='all' />
          <Picker.Item label='港服' value='hk' />
          <Picker.Item label='美服' value='us' />
          <Picker.Item label='日服' value='jp' />
        </Picker>
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
          color: modeInfo.standardTextColor
        }}
          prompt='选择状态'
          selectedValue={this.state.ddstatus}
          onValueChange={this.onValueChange.bind(this, 'ddstatus')}>
          <Picker.Item label='全部' value='all' />
          <Picker.Item label='进行中' value='on' />
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
    const { reducer } = this.props
    const { registerAfterEach, searchTitle } = this.props.screenProps
    if (reducer.page === 0) {
      this._onRefresh(
        searchTitle
      )
    }
    registerAfterEach({
      index: 5,
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
    const { pf, ddstatus, region } = this.state
    dispatch(
      getDiscountList(1, {
        ddstatus,
        pf,
        region,
        title: typeof title !== 'undefined' ? title : this.props.screenProps.searchTitle
      })
    )
  }

  _loadMoreData = () => {
    const { reducer, dispatch } = this.props
    const { pf, ddstatus, region } = this.state
    let page = reducer.page + 1
    dispatch(getDiscountList(page, {
      ddstatus, pf, region,
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

  ITEM_HEIGHT = 165
  width = Dimensions.get('window').width
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
    const { reducer } = this.props
    const { modeInfo } = this.props.screenProps
    const { width, height } = Dimensions.get('window')
    this.width = Math.min(width, height)
    global.log('Discount.js rendered', reducer.list.length)
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
          data={reducer.list}
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
    reducer: state.discount
  }
}

export default connect(
  mapStateToProps
)(Game)
