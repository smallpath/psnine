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
  Picker
} from 'react-native';

import { connect } from 'react-redux';
import { getGameList } from '../../actions/game.js';
import { standardColor, nodeColor, idColor } from '../../constants/colorConfig';
import Icon from 'react-native-vector-icons/Ionicons';

import { getGameUrl } from '../../dao';

import { changeScrollType } from '../../actions/app';

let toolbarHeight = 56;
let releasedMarginTop = 0;
let prevPosition = -1;

let dataSource = new ListView.DataSource({
  rowHasChanged: (row1, row2) => {
    return row1.id !== row2.id || row1.views !== row2.views || row1.count !== row2.count;
  },
});

class Game extends Component {
  static navigationOptions = {
    tabBarLabel: '游戏'
  }

  constructor(props) {
    super(props);

    this.state = {
      pf: 'all',
      sort: 'newest',
      dlc: 'all'
    }
  }

  _renderSeparator(sectionID: number, rowID: number, adjacentRowHighlighted: bool) {
    return (
      <View
        key={`${sectionID}-${rowID}`}
        style={{ height: 1, backgroundColor: 'rgba(0, 0, 0, 0.1)', marginLeft: 10, marginRight: 10 }}
      />
    );
  }

  _onRowPressed = (rowData) => {
    const { navigation } = this.props.screenProps;
    const URL = getGameUrl(rowData.id);
    navigation.navigate('GamePage', {
      // URL: 'http://psnine.com/psngame/5424?psnid=Smallpath',
      URL,
      title: rowData.title,
      rowData,
      type: 'game'
    })
  }


  _renderRow = (rowData,
    sectionID: number | string,
    rowID: number | string,
    highlightRow: (sectionID: number, rowID: number) => void
  ) => {
    const { modeInfo } = this.props.screenProps
    let TouchableElement = TouchableNativeFeedback;
    return (
      <View rowID={rowID} style={{
        marginTop: 7,
        backgroundColor: modeInfo.backgroundColor,
        elevation: 1,
      }}>
        <TouchableElement
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
              style={[styles.avatar, { width: 91 }]}
            />

            <View style={{ marginLeft: 10, flex: 1, flexDirection: 'column' }}>
              <Text
                ellipsizeMode={'tail'}
                numberOfLines={3}
                style={{ flex: 2.5, color: modeInfo.titleTextColor, }}>
                {rowData.title}
              </Text>

              <View style={{ flex: 1.1, flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text selectable={false} style={{ flex: -1, color: idColor, textAlign: 'center', textAlignVertical: 'center' }}>{rowData.platform}</Text>
                <Text selectable={false} style={{ flex: -1, color: modeInfo.standardTextColor, textAlign: 'center', textAlignVertical: 'center' }}>{rowData.region}</Text>
                <Text selectable={false} style={{ flex: -1, color: modeInfo.standardTextColor, textAlign: 'center', textAlignVertical: 'center' }}>{
                  rowData.platium + rowData.gold + rowData.selver + rowData.bronze
                }</Text>
              </View>

            </View>

          </View>
        </TouchableElement>
      </View>
    )
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

  componentWillReceiveProps = (nextProps) => {
    const { modeInfo } = this.props.screenProps
    if (modeInfo.isNightMode != nextProps.screenProps.modeInfo.isNightMode) {
      this.props.screenProps.modeInfo = nextProps.screenProps.modeInfo;
    }
  }

  componentDidUpdate = () => {
    const { game: gameReducer } = this.props;

    if (gameReducer.page == 1) {
      this._scrollToTop()
    } else {
      this.currentHeight = this.listView.getMetrics().contentLength;
    }

    this.refreshControl._nativeRef.setNativeProps({
      refreshing: false,
    });
  }

  componentDidMount = () => {
    const { game: gameReducer } = this.props;
    if (gameReducer.page === 0) {
      this._onRefresh();
    }
  }

  _onRefresh = () => {
    const { game: gameReducer, dispatch } = this.props;

    this.refreshControl._nativeRef.setNativeProps({
      refreshing: true,
    });

    const { pf, sort, dlc } = this.state
    dispatch(getGameList(1, sort, pf, dlc));
  }

  _scrollToTop = () => {
    this.listView.scrollTo({ y: 0, animated: true });
  }

  _loadMoreData = () => {
    const { game: gameReducer, dispatch } = this.props;
    const { pf, sort, dlc } = this.state
    let page = gameReducer.page + 1;
    dispatch(getGameList(page, sort, pf, dlc));
  }

  _onEndReached = () => {
    const { game: gameReducer } = this.props;

    this.refreshControl._nativeRef.setNativeProps({
      refreshing: true,
    });

    this._loadMoreData();
  }

  render() {
    const { game: gameReducer } = this.props;
    const { modeInfo } = this.props.screenProps
    // console.log('Community.js rendered');
    dataSource = dataSource.cloneWithRows(gameReducer.games);
    return (
      <View style={{ backgroundColor: modeInfo.backgroundColor, flex: 1 }}>
        {this._renderHeader()}
        <ListView
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={this._onRefresh}
              colors={[standardColor]}
              progressBackgroundColor={modeInfo.backgroundColor}
              ref={ref => this.refreshControl = ref}
            />
          }
          key={modeInfo.isNightMode}
          ref={listView => this.listView = listView}
          style={{ backgroundColor: modeInfo.backgroundColor, flex: 10 }}
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
            if (gameReducer.page == 1)
              return;
            const y = this.currentHeight + 60 - this.listViewHeight
            if (y === prevPosition) {
              return
            }
            prevPosition = y;
            this.listView.scrollTo({ y, animated: true })
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
    game: state.game
  };
}

export default connect(
  mapStateToProps
)(Game);
