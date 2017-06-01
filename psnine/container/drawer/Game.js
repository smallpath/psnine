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
  Picker,
  FlatList
} from 'react-native';

import { connect } from 'react-redux';
import { getGameList } from '../../actions/game.js';
import { standardColor, nodeColor, idColor } from '../../constants/colorConfig';
import Icon from 'react-native-vector-icons/Ionicons';

import { getGameUrl } from '../../dao';

import { changeScrollType } from '../../actions/app';

import TopicItem from '../shared/GameItem'
import FooterProgress from '../shared/FooterProgress'

let toolbarHeight = 56;
let releasedMarginTop = 0;
let prevPosition = -1;

class Game extends Component {
  static navigationOptions = {
    tabBarLabel: '游戏',
    drawerLabel: '游戏'
  }

  constructor(props) {
    super(props);

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
          <Picker.Item label="全部" value="all" />
          <Picker.Item label="PSV" value="psvita" />
          <Picker.Item label="PS3" value="ps3" />
          <Picker.Item label="PS4" value="ps4" />
        </Picker>
        <Picker style={{
          flex: 1,
          borderWidth: 1,
          color: modeInfo.standardTextColor
        }}
          prompt='选择DLC'
          selectedValue={this.state.dlc}
          onValueChange={this.onValueChange.bind(this, 'dlc')}>
          <Picker.Item label="全部" value="all" />
          <Picker.Item label="有DLC" value="dlc" />
          <Picker.Item label="无DLC" value="nodlc" />
        </Picker>
        <Picker style={{
          flex: 1.5,
          color: modeInfo.standardTextColor
        }}
          prompt='排序'
          selectedValue={this.state.sort}
          onValueChange={this.onValueChange.bind(this, 'sort')}>
          <Picker.Item label="最新排序" value="newest" />
          <Picker.Item label="玩的最多" value="owner" />
          <Picker.Item label="完美难度" value="difficulty" />
        </Picker>
      </View>
    )
  }

  onValueChange = (key: string, value: string) => {
    const newState = {};
    newState[key] = value;
    this.setState(newState, () => {
      this._onRefresh()
    });
  };

  shouldOnRefreshForSearch = false
  componentWillReceiveProps = (nextProps) => {
    let shouldCall = nextProps.segmentedIndex === 2
    let empty = () => {}
    let cb = empty
    if (this.props.screenProps.modeInfo.isNightMode != nextProps.screenProps.modeInfo.isNightMode) {
      cb = () => {}
    } else if (this.props.screenProps.searchTitle !== nextProps.screenProps.searchTitle) {
      if (shouldCall) {
        cb = () => this._onRefresh(
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
          nextProps.screenProps.searchTitle
        )
      } else {
        cb = () => this.setState({
          isRefreshing: false,
          isLoadingMore: false
        })
      }
    }
    if (shouldCall) {
      cb && cb()
    }
  }


  shouldComponentUpdate = (nextProps, nextState) => {
    if (nextState.isRefreshing !== this.state.isRefreshing) {
      if (this.shouldOnRefreshForSearch === true) this.shouldOnRefreshForSearch = false
      return true
    }
    if (nextProps.segmentedIndex !== 2) return false
    if (this.props.segmentedIndex !== 2) {
      if (this.shouldOnRefreshForSearch === true) {
        this.shouldOnRefreshForSearch = false
        return true
      }
      if (nextProps.screenProps.searchTitle === this.props.screenProps.searchTitle) return false
    }
    return true
  }

  componentWillMount = () => {
    const { game: gameReducer } = this.props;
    if (gameReducer.page === 0) {
      this._onRefresh();
    }
  }

  _onRefresh = (title) => {
    const { game: gameReducer, dispatch } = this.props;

    this.setState({
      isRefreshing: true
    })

    const { pf, sort, dlc } = this.state
    dispatch(
      getGameList(1, {
        sort, 
        pf, 
        dlc,
        title: typeof title !== 'undefined' ? title : this.props.screenProps.searchTitle
      })
    );
  }

  _loadMoreData = () => {
    const { game: gameReducer, dispatch } = this.props;
    const { pf, sort, dlc } = this.state
    let page = gameReducer.page + 1;
    dispatch(getGameList(page, {
      sort, pf, dlc,
      title: this.props.screenProps.searchTitle
    }));
  }

  _onEndReached = () => {
    const { game: gameReducer } = this.props;

    if (this.state.isRefreshing || this.state.isLoadingMore) return

    this.setState({
      isLoadingMore: true
    })

    this._loadMoreData();
  }


  ITEM_HEIGHT = 74 + 7

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
    const { game: gameReducer } = this.props;
    const { modeInfo } = this.props.screenProps
    log('Game.js rendered');
    return (
      <View style={{ backgroundColor: modeInfo.backgroundColor, flex: 1 }}>
        {this._renderHeader()}
        <FlatList style={{
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
          data={gameReducer.games}
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
      </View>
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
    game: state.game,
    segmentedIndex: state.app.segmentedIndex
  };
}

export default connect(
  mapStateToProps
)(Game);
