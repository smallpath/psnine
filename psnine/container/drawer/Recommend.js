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
  Animated
} from 'react-native';

import { connect } from 'react-redux';
import { getRecommend } from '../../actions/recommend.js';
import { getTopicList } from '../../actions/community.js';
import { standardColor, nodeColor, idColor, accentColor } from '../../constants/colorConfig';
import { changeSegmentIndex, changeCommunityType, changeGeneType, changeCircleType } from '../../actions/app';

import { getBattleURL, getGamePngURL } from '../../dao';
import HotGameItem from '../shared/HotGameItem'
import NodeItem from '../shared/NodeItem'
import TipItem from '../shared/TipItem'
import CommentItem from '../shared/LatestCommentItem'
const AnimatedSectionList = Animated.createAnimatedComponent(SectionList);

let toolbarHeight = 56;
let releasedMarginTop = 0;

const renderSectionHeader = ({ section }) => {
  // console.log(Object.keys(section), section.data[0].length)
  const len = section.data.length
  if (len === 1 && section.data[0].length === 0) return undefined
  return (
    <View style={{
      backgroundColor: section.modeInfo.backgroundColor,
      flex: -1,
      padding: 7,
      marginLeft: 7,
      marginRight: 7,
      elevation: 2,
    }}>
      <Text numberOfLines={1}
        style={{ fontSize: 20, color: section.modeInfo.standardColor, textAlign: 'left', lineHeight: 25, marginLeft: 2, marginTop: 2 }}
      >{section.key}</Text>
    </View>
  );
}

class Recommend extends Component {
  static navigationOptions = {
    tabBarLabel: '推荐',
    drawerLabel: '推荐'
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      data: {
        hotGames: [],
        nodes: [],
        tips: [],
        comment: [],
        warning: ''
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    // console.log('received', nextProps.data.hotGames.length)
    if (this.props.screenProps.modeInfo.themeName != nextProps.screenProps.modeInfo.themeName) {
      this.props.screenProps.modeInfo = nextProps.screenProps.modeInfo;
    } else if (this.props.data.hotGames.length < nextProps.data.hotGames.length) {
      // this.setState({
      //   isLoading: false
      // })
    } else {
      if (nextProps.segmentedIndex !== 0) return
      this.setState({
        isLoading: false,
        data: this.props.data
      })
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.isLoading !== nextState.isLoading) return true

    const { communityType, geneType, circleType, modeInfo, searchTitle } = nextProps.screenProps

    if (searchTitle !== this.props.screenProps.searchTitle) return true
    if (modeInfo.themeName !== this.props.screenProps.modeInfo.themeName) return true
    if (geneType !== this.props.screenProps.geneType) return true
    if (communityType !== this.props.screenProps.communityType) return true
    if (circleType !== this.props.screenProps.circleType) return true

    if (this.props.data.hotGames.length < nextProps.data.hotGames.length) {
      return true
    }
    // console.log(nextProps.segmentedIndex, nextProps.segmentedIndex !== 0)
    if (nextProps.segmentedIndex !== 0) return false
    if (this.props.screenProps.searchTitle !== nextProps.screenProps.searchTitle) {
      return false
    }
    
    
    return true
  }

  componentWillMount = () => {
    if (this.props.data.hotGames.length === 0) {
      this._onRefresh();
    }
  }
  componentWillUnmount = () => {
    this.setTimeout && clearTimeout(this.setTimeout)
  }

  componentDidMount = () => {
    this.setTimeout = setTimeout(() => {
      this.setState({
        data: this.props.data,
        isLoading: false
      })
    }, 0)
  }

  _onRefresh = (type = '') => {
    this.setState({
      isLoading: true
    })
    this.props.dispatch(getRecommend());
  }

  _renderItemComponent = ({ item: rowData, index }, type) => {
    const { modeInfo, navigation } = this.props.screenProps
    let outter = []
    switch (type) {
      case 0:
        outter = rowData.map((item, index) => (<HotGameItem key={index} {...{
          modeInfo,
          navigation,
          rowData: item
        }}/>))
        break;
      case 1:
        outter = rowData.map((item, index) => (<NodeItem key={index} {...{
          modeInfo,
          navigation,
          rowData: item,
          onPress: () => {
            this.props.dispatch(changeCommunityType(item.id))
            toast('已更新节点, 请左滑至社区')
          }
        }}/>))
        break;
      case 2:
        outter = rowData.map((item, index) => (<TipItem key={index} {...{
          modeInfo,
          navigation,
          rowData: item
        }}/>))
        break;
      case 3:
        outter = rowData.map((item, index) => (<CommentItem key={index} {...{
          modeInfo,
          navigation,
          rowData: item
        }}/>))
        break;
    }
    return (
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: 7, elevation: 2, backgroundColor: modeInfo.backgroundColor}}>
        {outter}
      </View>
    )
  }

  render() {
    const { battle: battleReducer } = this.props;
    const { modeInfo } = this.props.screenProps
    let { data } = this.state

    let keys = Object.keys(data);
    let NUM_SECTIONS = keys.length;
    // console.log(data)
    const sections = Object.keys(data).filter(item => item !== 'warning').map((sectionName, index) => {
      return {
        key: nameMapper[sectionName],
        modeInfo,
        data: [data[sectionName]],
        renderItem: (...args) => this._renderItemComponent(...args, index)
      }
    });
    // console.log('recommend re-rendered')
    return (
      <AnimatedSectionList
        enableVirtualization={false}
        ref={flatlist => this.flatlist = flatlist}
        refreshControl={
          <RefreshControl
            refreshing={this.state.isLoading}
            onRefresh={this._onRefresh}
            colors={[modeInfo.accentColor]}
            progressBackgroundColor={modeInfo.backgroundColor}
            ref={ref => this.refreshControl = ref}
          />
        }
        disableVirtualization={true}
        keyExtractor={(item, index) => `${item.id}`}
        renderItem={this._renderItemComponent}
        renderSectionHeader={renderSectionHeader}
        stickySectionHeadersEnabled
        sections={sections}
        style={styles.list}
      />
    )
  }

}

const nameMapper = {
  'hotGames' : '热门游戏',
  'nodes': '常用节点',
  'tips': '奖杯TIPS',
  'comment': '游戏评论',
}

const styles = StyleSheet.create({
  avatar: {
    width: 50,
    height: 50,
  }
});


function mapStateToProps(state) {
  return {
    data: state.recommend,
    segmentedIndex: state.app.segmentedIndex
  };
}

export default connect(
  mapStateToProps
)(Recommend);
