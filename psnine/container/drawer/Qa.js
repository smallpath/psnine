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
import { getQAList } from '../../actions/qa.js';
import { standardColor, nodeColor, idColor } from '../../constants/colorConfig';
import Icon from 'react-native-vector-icons/Ionicons';

import { getQAUrl } from '../../dao';

import { changeScrollType } from '../../actions/app';

import TopicItem from '../shared/QaItem'
import FooterProgress from '../shared/FooterProgress'

let toolbarHeight = 56;
let releasedMarginTop = 0;
let prevPosition = -1;

class Qa extends Component {
  static navigationOptions = {
    tabBarLabel: '问答',
    drawerLabel: '问答'
  };

  constructor(props) {
    super(props);

    this.state = {
      type: 'all',
      sort: 'obdate',
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
          prompt='选择类型'
          selectedValue={this.state.type}
          onValueChange={this.onValueChange.bind(this, 'type')}>
          <Picker.Item label="全部" value="all" />
          <Picker.Item label="PSN游戏" value="psngame" />
          <Picker.Item label="节点" value="node" />
        </Picker>
        <Picker style={{
          flex: 1,
          color: modeInfo.standardTextColor
        }}
          prompt='排序'
          selectedValue={this.state.sort}
          onValueChange={this.onValueChange.bind(this, 'sort')}>
          <Picker.Item label="综合排序" value="obdate" />
          <Picker.Item label="最新" value="date" />
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
    if (this.props.screenProps.modeInfo.themeName != nextProps.screenProps.modeInfo.themeName) {
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
        // this.shouldOnRefreshForSearch = false
        cb = () => this._onRefresh(
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

  componentWillMount = () => {
    const { qa: qaReducer } = this.props;
    const { registerAfterEach, searchTitle } = this.props.screenProps
    if (qaReducer.page === 0) {
      this._onRefresh(
        searchTitle
      );
    }
    registerAfterEach({
      index: 2,
      handler: () => {
        const { searchTitle } = this.props.screenProps
        this._onRefresh(
          searchTitle
        )
      }
    })
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    if (this.props.screenProps.modeInfo.themeName != nextProps.screenProps.modeInfo.themeName) {
      return true
    }
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

  _onRefresh = (title) => {
    const { qa: qaReducer, dispatch } = this.props;

    this.setState({
      isRefreshing: true
    })
    this.flatlist && this.flatlist.scrollToOffset({ offset: 0, animated: true })
    const { type, sort } = this.state
    dispatch(getQAList(1, {
        type,
        sort,
        title: typeof title !== 'undefined' ? title : this.props.screenProps.searchTitle
      })
    );
  }

  _loadMoreData = () => {
    const { qa: qaReducer, dispatch } = this.props;
    const { type, sort } = this.state
    let page = qaReducer.page + 1;
    dispatch(getQAList(page, {
        type, 
        sort,
        title: this.props.screenProps.searchTitle
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
    const { qa: qaReducer } = this.props;
    const { modeInfo } = this.props.screenProps
    log('Qa.js rendered');
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
              colors={[modeInfo.accentColor]}
              progressBackgroundColor={modeInfo.backgroundColor}
              ref={ref => this.refreshControl = ref}
            />
          }
          ListFooterComponent={() => <FooterProgress isLoadingMore={this.state.isLoadingMore} modeInfo={modeInfo} />}
          data={qaReducer.qas}
          keyExtractor={(item, index) => `${item.id}::${item.views}::${item.count}`}
          renderItem={this._renderItem}
          onEndReached={this._onEndReached}
          onEndReachedThreshold={0.5}
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
    height: 50,
  }
});


function mapStateToProps(state) {
  return {
    qa: state.qa,
    segmentedIndex: state.app.segmentedIndex
  };
}

export default connect(
  mapStateToProps
)(Qa);
