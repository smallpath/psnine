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
import { getBattleList } from '../../redux/action/battle.js';
import { standardColor, nodeColor, idColor, accentColor } from '../../constant/colorConfig';

import { getBattleURL, getGamePngURL } from '../../dao';
import BattleItem from '../../component/BattleItem'
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

class Battle extends Component {
  static navigationOptions = {
    tabBarLabel: '约战',
    drawerLabel: '约战'
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
    } else if (Object.keys(this.props.battle.battles).length < Object.keys(nextProps.battle.battles).length){
      this.setState({
        isLoading: false
      })
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.screenProps.modeInfo.themeName != nextProps.screenProps.modeInfo.themeName) {
      return true
    }
    if (this.props.screenProps.searchTitle !== nextProps.screenProps.searchTitle) {
      return false
    }
    return true
  }

  componentWillMount = () => {
    const { battle: battleReducer } = this.props;
    if (Object.keys(battleReducer.battles).length === 0) this._onRefresh();
  }

  _onRefresh = (type = '') => {
    const { battle: battleReducer, dispatch } = this.props;
    this.setState({
      isLoading: true
    })
    dispatch(getBattleList());
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
    let data = battleReducer.battles;

    let keys = Object.keys(data);
    let NUM_SECTIONS = keys.length;

    const sections = Object.keys(data).map(sectionName => {
      return {
        key: sectionName,
        modeInfo,
        data: data[sectionName]
      }
    });
    // console.log('?? battle rendered')
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
        renderScrollComponent={props => <NestedScrollView {...props}/>}
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
    battle: state.battle,
  };
}

export default connect(
  mapStateToProps
)(Battle);
