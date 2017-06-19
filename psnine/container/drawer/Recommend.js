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
import { standardColor, nodeColor, idColor, accentColor } from '../../constants/colorConfig';

import { getBattleURL, getGamePngURL } from '../../dao';
import BattleItem from '../shared/BattleItem'
const AnimatedSectionList = Animated.createAnimatedComponent(SectionList);

let toolbarHeight = 56;
let releasedMarginTop = 0;

const renderSectionHeader = ({ section }) => {
  // console.log(section)
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
      isLoading: false
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.screenProps.modeInfo.themeName != nextProps.screenProps.modeInfo.themeName) {
      this.props.screenProps.modeInfo = nextProps.screenProps.modeInfo;
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.screenProps.modeInfo.themeName != nextProps.screenProps.modeInfo.themeName) {
      return true
    }
    return true
  }

  componentWillMount = () => {
    if (this.props.data.hotGames.length === 0) {
      this._onRefresh();
    }
  }

  _onRefresh = (type = '') => {
    const { battle: battleReducer, dispatch } = this.props;
    this.setState({
      isLoading: true
    })
    dispatch(getRecommend());
  }

  _renderItemComponent = ({ item: rowData, index }) => {
    const { modeInfo, navigation } = this.props.screenProps
    return (<BattleItem {...{
      modeInfo,
      navigation,
      rowData
    }}/>)
  }

  render() {
    const { battle: battleReducer } = this.props;
    const { modeInfo } = this.props.screenProps
    let { data } = this.props.data

    let keys = Object.keys(data);
    let NUM_SECTIONS = keys.length;

    const sections = Object.keys(data).filter(item => item !== 'warning').map(sectionName => {
      return {
        key: sectionName,
        modeInfo,
        data: data[sectionName],
        renderItem: (...args) => this._renderItemComponent(...args)
      }
    });

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

const styles = StyleSheet.create({
  avatar: {
    width: 50,
    height: 50,
  }
});


function mapStateToProps(state) {
  return {
    data: state.recommend,
  };
}

export default connect(
  mapStateToProps
)(Recommend);
