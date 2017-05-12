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
  FlatList,
  ProgressBarAndroid
} from 'react-native';

import { connect } from 'react-redux';
import { getTopicList } from '../../actions/community.js';
import { standardColor, nodeColor, idColor } from '../../constants/colorConfig';

import { getTopicURL } from '../../dao';

import { changeScrollType } from '../../actions/app';

let toolbarHeight = 56;
let releasedMarginTop = 0;
let prevPosition = -1;

class progress extends Component {
  render() {
    return (
      <View style={{flexDirection:'row', flex: 1, height: 15, alignItems: 'center', justifyContent: 'center'}}>
        <ProgressBarAndroid style={{flex:1,
          height: 15,
          transform: [
            {
              rotateZ: '180deg'
            }
          ]
        }}  styleAttr="Horizontal"/>
        <ProgressBarAndroid style={{flex:1,height: 15,}} styleAttr="Horizontal" />
      </View>
    )
  }
}

class Community extends Component {
  static navigationOptions = {
    tabBarLabel: '社区'
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true
    }
  }

  _onRowPressed = (rowData) => {
    const { navigation } = this.props.screenProps;
    const URL = getTopicURL(rowData.id);
    navigation.navigate('CommunityTopic', {
      URL,
      title: rowData.title,
      rowData,
      type: 'community',
      shouldBeSawBackground: true
    })
  }

  _renderItem = ({ item: rowData, index }) => {
    const { modeInfo } = this.props.screenProps

    return (
      <View style={{
        marginTop: 7,
        backgroundColor: modeInfo.backgroundColor,
        elevation: 1,
        height: this.ITEM_HEIGHT - 7
      }}>
        <TouchableNativeFeedback
          onPress={() => {
            this._onRowPressed(rowData)
          }}
          useForeground={true}
          delayPressIn={100}
          background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
        >
          <View style={{ flex: 1, flexDirection: 'row', padding: 12 }}>
            <Image
              source={{ uri: rowData.avatar }}
              style={styles.avatar}
            />

            <View style={{ marginLeft: 10, flex: 1, flexDirection: 'column' }}>
              <Text
                ellipsizeMode={'tail'}
                numberOfLines={2}
                style={{ flex: 2.5, color: modeInfo.titleTextColor, }}>
                {rowData.title}
              </Text>

              <View style={{ flex: 1.1, flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text selectable={false} style={{ flex: -1, color: idColor, textAlign: 'center', textAlignVertical: 'center' }} onPress={() => {
                    this.props.screenProps.navigation.navigate('Home', {
                      title: rowData.psnid,
                      id: rowData.psnid,
                      URL: `http://psnine.com/psnid/${rowData.psnid}`
                    })
                  }}>{rowData.psnid}</Text>
                <Text selectable={false} style={{ flex: -1, color: modeInfo.standardTextColor, textAlign: 'center', textAlignVertical: 'center' }}>{rowData.date}</Text>
                <Text selectable={false} style={{ flex: -1, color: modeInfo.standardTextColor, textAlign: 'center', textAlignVertical: 'center' }}>{rowData.count}回复</Text>
                <Text selectable={false} style={{ flex: -1, color: modeInfo.standardTextColor, textAlign: 'center', textAlignVertical: 'center' }}>{rowData.type}</Text>
              </View>

            </View>

          </View>
        </TouchableNativeFeedback>
      </View>
    )
  }

  componentWillReceiveProps = (nextProps) => {
    if (this.props.screenProps.communityType != nextProps.screenProps.communityType) {
      this.props.screenProps.communityType = nextProps.screenProps.communityType;
      this._onRefresh(nextProps.screenProps.communityType);
    } else if (this.props.screenProps.modeInfo.isNightMode != nextProps.screenProps.modeInfo.isNightMode) {
      this.props.screenProps.modeInfo = nextProps.screenProps.modeInfo;
    } else {
      // this.refreshControl && this.refreshControl._nativeRef.setNativeProps({
      //   refreshing: false,
      // });
      // this.isLoading = false
      this.setState({
        isLoading: false
      })
    }

  }

  componentDidUpdate = () => {

  }

  componentDidMount = () => {
    const { community: communityReducer } = this.props;
    if (communityReducer.topicPage == 0) {
      this._onRefresh();
    }
  }

  _onRefresh = (type = '') => {
    const { community: reducer, dispatch } = this.props;

    this.setState({
      isLoading: true
    }, () => {
      dispatch(getTopicList(1, type));
    })
    // this.refreshControl && this.refreshControl._nativeRef.setNativeProps({
    //   refreshing: true,
    // });
    // this.isLoading = true
    // dispatch(getTopicList(1, type));
  }

  _scrollToTop = () => {
    this.listView.scrollTo({ y: 0, animated: true });
  }

  _loadMoreData = () => {
    const { community: reducer, dispatch } = this.props;
    const { communityType } = this.props.screenProps

    let page = reducer.topicPage + 1;
    dispatch(getTopicList(page, communityType));
  }

  _onEndReached = () => {
    if (this.state.isLoading === true) return

    // this.refreshControl && this.refreshControl._nativeRef.setNativeProps({
    //   refreshing: true,
    // });
    // this.isLoading = true

    // this._loadMoreData();
    this.setState({
      isLoading: true
    }, () => {
      this._loadMoreData();
    })
  }

  isLoading = true
  ITEM_HEIGHT = 78 + 7
  render() {
    const { community: reducer } = this.props;
    const { modeInfo } = this.props.screenProps
    // console.log('Community.js rendered');

    return (
      <FlatList style={{
        flex: 1,
        backgroundColor: modeInfo.backgroundColor
      }}
        ref={flatlist => this.flatlist = flatlist}
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={this._onRefresh}
            colors={[modeInfo.standardColor]}
            progressBackgroundColor={modeInfo.backgroundColor}
            ref={ref => this.refreshControl = ref}
          />
        }
        ListHeaderComponent={progress}
        ListFooterComponent={progress}
        data={reducer.topics}
        keyExtractor={(item, index) => `${item.id}::${item.views}::${item.count}`}
        renderItem={this._renderItem}
        onEndReached={this._onEndReached}
        onEndReachedThreshold={1}
        extraData={modeInfo}
        windowSize={100}
        maxToRenderPerBatch={32}
        disableVirtualization={false}
        getItemLayout={(data, index) => (
          {length: this.ITEM_HEIGHT, offset: this.ITEM_HEIGHT * index, index}
        )}
        /*viewabilityConfig={{
          minimumViewTime: 3000,
          viewAreaCoveragePercentThreshold: 100,
          waitForInteraction: true
        }}*/
      >
      </FlatList>
      /*<ListView
        refreshControl={
          <RefreshControl
            refreshing={false}
            onRefresh={this._onRefresh}
            colors={[standardColor]}
            progressBackgroundColor={modeInfo.backgroundColor}
            ref={ref => this.refreshControl = ref}
          />
        }
        ref={listView => this.listView = listView}
        key={modeInfo.isNightMode}
        style={{ backgroundColor: modeInfo.backgroundColor }}
        pageSize={32}
        initialListSize={32}
        removeClippedSubviews={false}
        enableEmptySections={true}
        onEndReached={this._onEndReached}
        onEndReachedThreshold={10}
        dataSource={dataSource}
        renderRow={this._renderRow}

        onLayout={event => {
          this.listViewHeight = event.nativeEvent.layout.height
        }}
        onContentSizeChange={() => {
          if (communityReducer.topicPage == 1)
            return;
          const y = this.currentHeight + 60 - this.listViewHeight
          if (y === prevPosition) {
            return
          }
          prevPosition = y;
          this.listView.scrollTo({ y, animated: true })
        }}
      />*/
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
    community: state.community
  };
}

export default connect(
  mapStateToProps
)(Community);
