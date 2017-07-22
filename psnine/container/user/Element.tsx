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
  Button
} from 'react-native';

import { connect } from 'react-redux';
import { standardColor, nodeColor, idColor, accentColor } from '../../constant/colorConfig';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getGroupAPI } from '../../dao';
import CircleItem from '../../component/CircleItem'
const AnimatedSectionList = Animated.createAnimatedComponent(SectionList);

let toolbarHeight = 56;
let releasedMarginTop = 0;

let toolbarActions = []

class NodeItem extends React.PureComponent {

  shouldComponentUpdate = (props, state) => {
    if (props.modeInfo.themeName !== this.props.modeInfo.themeName) return true
    return false
  }

  render() {
    const { modeInfo, onPress, rowData, navigation } = this.props

    return (
      <View style={{
        alignSelf: 'flex-start',
        alignContent: 'flex-end',
        backgroundColor: modeInfo.backgroundColor,
        flex: -1,
        margin: 4
      }}>
        <Button onPress={onPress} color={modeInfo.accentColor} title={rowData.text}/>
      </View>
    )
  }

}

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

export default class Element extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      data: []
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

  ITEM_HEIGHT = 74 + 7
  _renderItemComponent = ({ item: rowData, index: outerIndex }) => {
    const { modeInfo } = this.props.screenProps
    const { ITEM_HEIGHT } = this
    const { navigation } = this.props
    // console.log(rowData)
    return (
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: 7, backgroundColor: modeInfo.backgroundColor}}>
        {rowData.map((item, index) => (<NodeItem key={index} {...{
          modeInfo,
          navigation,
          rowData: item,
          onPress: () => {
            {/*console.log(rowData)*/}
            this.props.navigation.navigate('Circle', {
              URL: item.url,
              title: item.text,
              rowData: item
            })
          }
        }}/>))}
      </View>
    )
  }

  render() {
    const { modeInfo } = this.props.screenProps
    const { data } = this.state;

    let keys = Object.keys(data);
    let NUM_SECTIONS = keys.length;

    const sections = [{
      key: '曾使用过的所有元素',
      modeInfo,
      data: [data]
    }]

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
