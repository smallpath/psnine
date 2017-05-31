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
import { getList } from '../../actions/store.js';
import { standardColor, nodeColor, idColor, accentColor } from '../../constants/colorConfig';

import { getBattleURL, getGamePngURL } from '../../dao';
import FooterProgress from '../shared/FooterProgress'
const AnimatedSectionList = Animated.createAnimatedComponent(SectionList);

let toolbarHeight = 56;
let releasedMarginTop = 0;

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

class StoreItem extends React.PureComponent {
  shouldComponentUpdate = (props) => props.modeInfo.isNightMode !== this.props.modeInfo.isNightMode
  
  _onRowPressed = (rowData) => {
    const { navigation } = this.props;
    navigation.navigate('StoreTopic', {
      id: rowData.id,
      server: rowData.server,
      title: rowData.title || 'PSN商店',
      rowData
    })
  }


  render = () => {
    // console.log(rowData)
    const { modeInfo, rowData, ITEM_HEIGHT } = this.props

    return (
      <View style={{
        marginVertical: 3.5,
        backgroundColor: modeInfo.backgroundColor,
        elevation: 1,
        height: ITEM_HEIGHT - 7,
        justifyContent: 'center', alignItems: 'center'
      }}>
        <TouchableNativeFeedback
          onPress={() => { this._onRowPressed(rowData) }}
          delayPressIn={100}
          background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
        >
          <View style={{ flex: -1, flexDirection: 'row', padding: 5, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{
              flex: 1,
              flexDirection: 'column',
              marginLeft: -2,
              alignSelf: 'center'
            }}>
              <Image
                source={{ uri: rowData.avatar }}
                style={{
                  width: 100,
                  height: 100,
                  alignSelf: 'center',
                }}
              />
            </View>
            <View style={{ marginLeft: 10, flex: 2, flexDirection: 'column' }}>
              <Text
                ellipsizeMode={'tail'}
                numberOfLines={1}
                style={{ flex: -1, color: modeInfo.titleTextColor, fontSize: 15 }}>
                {rowData.title}
              </Text>
              <Text>
                <Text style={{ flex: -1, color: modeInfo.standardTextColor, fontSize: 12 }} numberOfLines={1}>类别：</Text>
                <Text style={{ flex: -1, color: modeInfo.titleTextColor, fontSize: 12 }} numberOfLines={1}>{rowData.type}</Text>
              </Text>
              <Text>
                <Text style={{ flex: -1, color: modeInfo.standardTextColor, fontSize: 12 }} numberOfLines={1}>平台：</Text>
                <Text style={{ flex: -1, color: modeInfo.titleTextColor, fontSize: 12 }} numberOfLines={1}>{rowData.platform}</Text>
              </Text>
              <Text>
                <Text style={{ flex: -1, color: modeInfo.standardTextColor, fontSize: 12 }} numberOfLines={1}>发行：</Text>
                <Text style={{ flex: -1, color: modeInfo.titleTextColor, fontSize: 12 }} numberOfLines={1}>{rowData.date}</Text>
              </Text>
              <Text>
                <Text style={{ flex: -1, color: modeInfo.standardTextColor, fontSize: 12 }} numberOfLines={1}>售价：</Text>
                <Text style={{ flex: -1, color: modeInfo.titleTextColor, fontSize: 12 }} numberOfLines={1}>{rowData.price}</Text>
              </Text>
              <Text>
                <Text style={{ flex: -1, color: modeInfo.standardTextColor, fontSize: 12 }} numberOfLines={1}>备注：</Text>
                <Text style={{ flex: -1, color: modeInfo.titleTextColor, fontSize: 12 }} numberOfLines={1}>{rowData.comment}</Text>
              </Text>
            </View>
          </View>
        </TouchableNativeFeedback>
      </View>
    )
  }
}

class Store extends Component {
  static navigationOptions = {
    tabBarLabel: '商店',
    drawerLabel: '商店'
  };

  constructor(props) {
    super(props);
    this.state = {
      isRefreshing: false,
      isLoadingMore: false,
    }
  }

  shouldOnRefreshForSearch = false
  componentWillReceiveProps = (nextProps) => {
    let shouldCall = nextProps.segmentedIndex === 7
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
    if (shouldCall) {
      cb && cb()
    }
  }


  shouldComponentUpdate = (nextProps, nextState) => {
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

  componentWillMount = () => {
    const { reducer } = this.props;
    const { searchTitle } = this.props.screenProps

    if (reducer.page === 0) {
      this._onRefresh(
        searchTitle
      )
    }
  }

  _onRefresh = (searchTitle) => {
    const { reducer, dispatch } = this.props;
    // const { circleType } = this.props.screenProps

    this.setState({
      isRefreshing: true
    })

    dispatch(getList(1, {
        title: typeof searchTitle !== 'undefined' ? searchTitle : this.props.screenProps.searchTitle
      })
    );
  }

  _loadMoreData = () => {
    const { reducer, dispatch } = this.props;
    const { searchTitle } = this.props.screenProps

    let page = reducer.page + 1;
    dispatch(getList(page, {
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

  ITEM_HEIGHT = 130 + 7

  _renderItem = ({ item: rowData, index }) => {

    const { modeInfo, navigation } = this.props.screenProps
    const { ITEM_HEIGHT } = this
    return <StoreItem {...{
      navigation,
      rowData,
      modeInfo,
      ITEM_HEIGHT
    }} />
  }

  render() {
    const { reducer } = this.props;
    const { modeInfo } = this.props.screenProps
    // console.log('Store.js rendered');
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
        keyExtractor={(item, index) => item.onclick}
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
    reducer: state.store,
    segmentedIndex: state.app.segmentedIndex
  };
}

export default connect(
  mapStateToProps
)(Store);
