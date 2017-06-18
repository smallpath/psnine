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
import { standardColor, nodeColor, idColor, accentColor } from '../../constants/colorConfig';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getGroupAPI } from '../../dao';
import CircleItem from '../shared/CircleItem'
const AnimatedSectionList = Animated.createAnimatedComponent(SectionList);

let toolbarHeight = 56;
let releasedMarginTop = 0;

let toolbarActions = []

const renderSectionHeader = ({ section }) => {
  // console.log(section)
  return (
    <View style={{
      backgroundColor: section.modeInfo.backgroundColor,
      flex: -1,
      padding: 7,
      elevation: 2,
    }}>
      <Text numberOfLines={1}
        style={{ fontSize: 20, color: idColor, textAlign: 'left', lineHeight: 25, marginLeft: 2, marginTop: 2 }}
      >{section.key}</Text>
    </View>
  );
}

export default class Group extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      data: {
        joinedList : [],
        ownedList : []
      }
    }
  }

  componentWillMount = () => {
    this.fetch()
  }

  fetch = (type = '') => {
    const { modeInfo } = this.props.screenProps
    const { ITEM_HEIGHT } = this
    const { navigation } = this.props
    this.setState({
      isLoading: true
    })
    InteractionManager.runAfterInteractions(() => {
      getGroupAPI(navigation.state.params.URL).then(data => {
        this.setState({
          data,
          isLoading: false
        })
      })
    })
  }

  onNavClicked = () => {
    this.props.navigation.goBack()
  }

  ITEM_HEIGHT = 78 + 7
  _renderItemComponent = ({ item: rowData, index }) => {
    const { modeInfo } = this.props.screenProps
    const { ITEM_HEIGHT } = this
    const { navigation } = this.props
    return (<CircleItem {...{
      modeInfo,
      navigation,
      rowData
    }}/>)
  }

  render() {
    const { modeInfo } = this.props.screenProps
    const { data } = this.state;

    let keys = Object.keys(data);
    let NUM_SECTIONS = keys.length;

    const sections = Object.keys(data).filter(sectionName => data[sectionName].length !== 0).map(sectionName => {
      return {
        key: sectionName === 'joinedList' ? '我加入的机因圈' : '我创建的机因圈',
        modeInfo,
        data: data[sectionName]
      }
    });

    return (
      <View
        style={{ flex: 1, backgroundColor: modeInfo.backgroundColor }}
        onStartShouldSetResponder={() => false}
        onMoveShouldSetResponder={() => false}
      >
        <Ionicons.ToolbarAndroid
          navIconName="md-arrow-back"
          overflowIconName="md-more"
          iconColor={modeInfo.isNightMode ? '#000' : '#fff'}
          title={'圈子'}
          style={{ backgroundColor: modeInfo.standardColor, height: 56, elevation: 4 }}
          titleColor={modeInfo.isNightMode ? '#000' : '#fff'}
          actions={toolbarActions}
          onIconClicked={this.onNavClicked}
          onActionSelected={this.onActionSelected}
        />
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
          keyExtractor={(item, index) => `${item.id || item.href}`}
          renderItem={this._renderItemComponent}
          renderSectionHeader={renderSectionHeader}
          stickySectionHeadersEnabled
          sections={sections}
          style={styles.list}
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
