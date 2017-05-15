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

import HTMLView from '../../components/HtmlToView';
import { connect } from 'react-redux';
import { getRankList } from '../../actions/rank.js';
import { standardColor, nodeColor, idColor } from '../../constants/colorConfig';
import Icon from 'react-native-vector-icons/Ionicons';

import { getHomeURL } from '../../dao';

import { changeScrollType } from '../../actions/app';

let toolbarHeight = 56;
let releasedMarginTop = 0;
let prevPosition = -1;

let dataSource = new ListView.DataSource({
  rowHasChanged: (row1, row2) => {
    return row1.psnid !== row2.psnid || row1.rank !== row2.rank
  },
});

class Rank extends Component {
  static navigationOptions = {
    tabBarLabel: '排行',
    drawerLabel: '排行'
  }

  constructor(props) {
    super(props);

    this.state = {
      server: 'hk',
      sort: 'point',
      cheat: '0'
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
    const URL = getHomeURL(rowData.psnid);
    navigation.navigate('Home', {
      // URL: 'http://psnine.com/psngame/5424?psnid=Smallpath',
      URL,
      title: rowData.psnid,
      rowData
    })
  }


  handleImageOnclick = (url) => this.props.screenProps.navigation.navigate('ImageViewer', {
    images: [
      { url }
    ]
  })

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
          <View style={{ flex: 1, flexDirection: 'row', padding: 12, justifyContent: 'space-around', alignItems: 'center' }}>

            <Image
              source={{ uri: rowData.avatar }}
              style={[styles.avatar, { width: 50 }]}
            />

            <View style={{ flex: 2, padding: 5}}>
              <Text style={{color: modeInfo.accentColor}}>{rowData.psnid}</Text>
              <Text style={{color: modeInfo.titleTextColor}}>第{rowData.rank}</Text>
              <HTMLView
                value={rowData.content}
                modeInfo={modeInfo}
                stylesheet={styles}
                onImageLongPress={this.handleImageOnclick}
                imagePaddingOffset={30 + 10}
                shouldForceInline={true}
              />
            </View>

            { rowData.type === 'general' ? this.renderGeneral(rowData) : this.renderOther(rowData) }

          </View>
        </TouchableElement>
      </View>
    )
  }

  renderGeneral = (rowData) => {
    const { modeInfo } = this.props.screenProps
    return (
      <View style={{flex: 4, flexDirection: 'row'}}>
        <View style={{flex: 2, flexDirection: 'column'}}>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <Text style={{color: modeInfo.standardTextColor}}>{rowData.level}</Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <Text style={{color: modeInfo.standardTextColor}}>{rowData.games}</Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <Text style={{color: modeInfo.standardTextColor}}>{rowData.perfectRate}</Text>
          </View>
        </View>
        <View style={{flex: 2, flexDirection: 'column'}}>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <Text style={{color: modeInfo.standardTextColor}}>{rowData.platinum}</Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <Text style={{color: modeInfo.standardTextColor}}>{rowData.gold}</Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <Text style={{color: modeInfo.standardTextColor}}>{rowData.silver}</Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <Text style={{color: modeInfo.standardTextColor}}>{rowData.bronze}</Text>
          </View>
        </View>
      </View>
    )
  }

  renderOther = (rowData) => {
    const { modeInfo } = this.props.screenProps
    return (
      <View style={{flex: 4, flexDirection: 'row'}}>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <HTMLView
            value={rowData.level}
            modeInfo={modeInfo}
            stylesheet={styles}
            onImageLongPress={this.handleImageOnclick}
            imagePaddingOffset={30 + 0 + 10}
            shouldForceInline={true}
          />
          <Text style={{color: modeInfo.standardTextColor}}>{rowData.exp}</Text>
        </View>
        { rowData.games && <View style={{ flex: 1, flexDirection: 'column' }}>
          <Text style={{color: modeInfo.standardTextColor}}>{rowData.games}</Text>
        </View> || undefined}
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
          <Picker.Item label="最后更新" value="datadate" />
          <Picker.Item label="等级排行" value="point" />
          <Picker.Item label="游戏最多" value="totalgame" />
          <Picker.Item label="完美率" value="rarity" />
          <Picker.Item label="签到最多" value="qidao" />
          <Picker.Item label="N币最多" value="nb" />
          <Picker.Item label="Z币最多" value="zb" />
        </Picker>
        <Picker style={{
          flex: 2.5,
          borderWidth: 1,
          color: modeInfo.standardTextColor
        }}
          prompt='选服'
          selectedValue={this.state.server}
          onValueChange={this.onValueChange.bind(this, 'server')}>
          <Picker.Item label="所有" value="all" />
          <Picker.Item label="国服" value="cn" />
          <Picker.Item label="港服" value="hk" />
          <Picker.Item label="日服" value="jp" />
          <Picker.Item label="台服" value="tw" />
          <Picker.Item label="美服" value="us" />
          <Picker.Item label="英服" value="gb" />
          <Picker.Item label="加服" value="ca" />
        </Picker>
        <Picker style={{
          flex: 3,
          color: modeInfo.standardTextColor
        }}
          prompt='排序'
          selectedValue={this.state.cheat}
          onValueChange={this.onValueChange.bind(this, 'cheat')}>
          <Picker.Item label="身家清白" value="0" />
          <Picker.Item label="浪子回头" value="1" />
          <Picker.Item label="无可救药" value="2" />
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
    } else if (this.props.screenProps.searchTitle !== nextProps.screenProps.searchTitle) {
      this._onRefresh(
        nextProps.screenProps.searchTitle
      )
    }
  }

  componentDidUpdate = () => {
    const { rank: reducer } = this.props;

    if (reducer.page == 1) {
      // this._scrollToTop()
    } else {
      this.currentHeight = this.listView.getMetrics().contentLength;
    }

    this.refreshControl._nativeRef.setNativeProps({
      refreshing: false,
    });
  }

  componentDidMount = () => {
    const { rank: reducer } = this.props;
    if (reducer.page === 0) {
      this._onRefresh();
    }
  }

  _onRefresh = (title = '') => {
    const { rank: reducer, dispatch } = this.props;

    this.refreshControl._nativeRef.setNativeProps({
      refreshing: true,
    });

    const { server, sort, cheat } = this.state
    dispatch(getRankList(1, {
      sort, server, cheat,
      title: typeof title !== 'undefined' ? title : this.props.screenProps.searchTitle
    }));
  }

  _scrollToTop = () => {
    this.listView.scrollTo({ y: 0, animated: true });
  }

  _loadMoreData = () => {
    const { rank: reducer, dispatch } = this.props;
    const { server, sort, cheat } = this.state
    let page = reducer.page + 1;
    dispatch(getRankList(page, {
      sort, server, cheat,
      title: this.props.screenProps.searchTitle
    }));
  }

  _onEndReached = () => {
    const { rank: reducer } = this.props;

    if (reducer.page === reducer.totalPage) return

    this.refreshControl._nativeRef.setNativeProps({
      refreshing: true,
    });

    this._loadMoreData();
  }

  render() {
    const { rank: reducer } = this.props;
    const { modeInfo } = this.props.screenProps
    // console.log('Community.js rendered');
    dataSource = dataSource.cloneWithRows(reducer.ranks);

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
            if (reducer.page == 1)
              return;
            const y = this.currentHeight + 60 - this.listViewHeight
            if (y === prevPosition) {
              return
            }
            prevPosition = y;
            /*this.listView.scrollTo({ y, animated: true })*/
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
    rank: state.rank
  };
}

export default connect(
  mapStateToProps
)(Rank);
