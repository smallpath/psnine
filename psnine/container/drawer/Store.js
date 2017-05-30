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
import { getBattleList } from '../../actions/battle.js';
import { standardColor, nodeColor, idColor, accentColor } from '../../constants/colorConfig';

import { getBattleURL, getGamePngURL } from '../../dao';

const AnimatedSectionList = Animated.createAnimatedComponent(SectionList);

let toolbarHeight = 56;
let releasedMarginTop = 0;

class BattleItem extends React.PureComponent {
  shouldComponentUpdate = (props) => props.modeInfo.isNightMode !== this.props.modeInfo.isNightMode
  
  _onRowPressed = (rowData) => {
    const { navigation } = this.props;
    const URL = getBattleURL(rowData.id);
    navigation.navigate('BattleTopic', {
      URL,
      title: rowData.title,
      rowData,
      type: 'battle',
      shouldBeSawBackground: true
    })
  }


  render = () => {
    // console.log(rowData)
    const { modeInfo, rowData } = this.props

    return (
      <View style={{
        marginLeft: 7,
        marginRight: 7,
        backgroundColor: modeInfo.backgroundColor,
        elevation: 2,
      }}>
        <TouchableNativeFeedback
          onPress={() => { this._onRowPressed(rowData) }}
          delayPressIn={100}
          background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
        >
          <View style={{ flex: -1, flexDirection: 'row', padding: 12 }}>
            <View style={{
              flex: 1,
              flexDirection: 'column',
              marginLeft: -2,
              alignSelf: 'center'
            }}>
              <Image
                source={{ uri: rowData.avatar }}
                style={{
                  width: 91,
                  height: 50,
                  alignSelf: 'center',
                }}
              />
              <Text style={{ flex: -1, color: idColor, textAlign: 'center', textAlignVertical: 'center' }}>{rowData.game}</Text>
            </View>
            <View style={{ marginLeft: 10, flex: 2, flexDirection: 'column' }}>
              <Text
                ellipsizeMode={'tail'}
                numberOfLines={1}
                style={{ flex: -1, color: modeInfo.titleTextColor, fontSize: 15 }}>
                {rowData.title}
              </Text>
              <Text>
                <Text style={{ flex: -1, color: modeInfo.titleTextColor }} numberOfLines={1}>{rowData.date}</Text>
                <Text style={{ flex: -1, color: modeInfo.standardTextColor }} numberOfLines={1}> 开始</Text>
              </Text>
              <Text>
                <Text style={{ flex: -1, color: modeInfo.titleTextColor }} numberOfLines={1}>{rowData.num}</Text>
                <Text style={{ flex: -1, color: modeInfo.standardTextColor }} numberOfLines={1}> 人招募</Text>
              </Text>
              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ flex: -1, color: modeInfo.standardTextColor, textAlign: 'center', textAlignVertical: 'center' }}>{rowData.platform.join(' ')}</Text>
                <Text style={{ flex: -1, color: idColor, marginRight: -60, textAlignVertical: 'center' }} onPress={
                () => {
                  this.props.screenProps.navigation.navigate('Home', {
                    title: rowData.psnid,
                    id: rowData.psnid,
                    URL: `http://psnine.com/psnid/${rowData.psnid}`
                  })
                }
              }>{rowData.psnid}</Text>
              </View>
            </View>
            <Image
              source={{ uri: rowData.gameAvatar }}
              style={[styles.avatar, { marginLeft: 10 }]}
            />
          </View>
        </TouchableNativeFeedback>
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
      marginLeft: 7,
      marginRight: 7,
      elevation: 2,
    }}>
      <Text numberOfLines={1}
        style={{ fontSize: 20, color: idColor, textAlign: 'left', lineHeight: 25, marginLeft: 2, marginTop: 2 }}
      >{section.key}</Text>
    </View>
  );
}

class Battle extends Component {
  static navigationOptions = {
    tabBarLabel: '商店',
    drawerLabel: '商店'
  };

  constructor(props) {
    super(props);
    this.state = {
      isLoading: false
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.screenProps.modeInfo.isNightMode != nextProps.screenProps.modeInfo.isNightMode) {
      this.props.screenProps.modeInfo = nextProps.screenProps.modeInfo;
    } else if (Object.keys(this.props.battle.battles).length < Object.keys(nextProps.battle.battles).length){
      this.setState({
        isLoading: false
      })
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.props.screenProps.searchTitle !== nextProps.screenProps.searchTitle) {
      return false
    }
    return true
  }

  componentDidMount = () => {
    const { battle: battleReducer } = this.props;
    // if (Object.keys(battleReducer.battles).length === 0) this._onRefresh();
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

    return (
      <AnimatedSectionList
        enableVirtualization={false}
        ref={flatlist => this.flatlist = flatlist}
        refreshControl={
          <RefreshControl
            refreshing={this.state.isLoading}
            onRefresh={this._onRefresh}
            colors={[modeInfo.standardColor]}
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
    battle: state.battle,
  };
}

export default connect(
  mapStateToProps
)(Battle);
