import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  SectionList,
  TouchableNativeFeedback,
  ActivityIndicator,
  processColor,
  Animated,
  FlatList
} from 'react-native'
import update from 'immutability-helper'

import PieChart from './PieChart'
import LineChart from './LineChart'

import UserGameItem from '../../component/UserGameItem'
import {
  standardColor,
  idColor
} from '../../constant/colorConfig'

declare var global

const renderSectionHeader = ({ section }) => {
  // console.log(section)
  return (
    <View style={{
      backgroundColor: section.modeInfo.backgroundColor,
      flex: -1,
      padding: 7,
      elevation: 2
    }}>
      <Text numberOfLines={1}
        style={{ fontSize: 20, color: section.modeInfo.standardColor, textAlign: 'left', lineHeight: 25, marginLeft: 2, marginTop: 2 }}
      >{section.key}</Text>
    </View>
  )
}

export default class Home extends Component<any, any> {
  static navigationOptions = {
     tabBarLabel: '奖杯状态'
  }
  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      rotation: new Animated.Value(1),
      scale: new Animated.Value(1),
      opacity: new Animated.Value(1),
      openVal: new Animated.Value(0),
      modalVisible: false,
      sections: [],
      modalOpenVal: new Animated.Value(0),
      topicMarginTop: new Animated.Value(0),
      scrollEnabled: true
    }
  }

  flatlist: any
  componentWillMount() {
    const { modeInfo, statsInfo } = this.props.screenProps
    const sections = [{
      data: [statsInfo.platform],
      modeInfo,
      key: '平台',
      renderItem: this.renderItem.bind(this, 0)
    }, {
      data: [statsInfo.trophyNumber],
      modeInfo,
      key: '奖杯',
      renderItem: this.renderItem.bind(this, 1)
    }, {
      data: [statsInfo.trophyPoints],
      modeInfo,
      key: '奖杯点数',
      renderItem: this.renderItem.bind(this, 2)
    }, {
      data: [statsInfo.trophyRare],
      modeInfo,
      key: '奖杯稀有度',
      renderItem: this.renderItem.bind(this, 3)
    }, {
      data: [statsInfo.gamePercent],
      modeInfo,
      key: '游戏完成率',
      renderItem: this.renderItem.bind(this, 4)
    }, {
      data: [statsInfo.gameDifficulty],
      modeInfo,
      key: '游戏难度',
      renderItem: this.renderItem.bind(this, 5)
    }, {
      data: [statsInfo.monthTrophy],
      modeInfo,
      key: '月活跃度',
      renderItem: this.renderItem.bind(this, 6)
    }, {
      data: [{ dataSets: statsInfo.dayTrophy, xAxis: statsInfo.dayArr }],
      modeInfo,
      key: '奖杯进度',
      renderItem: this.renderItem.bind(this, 7)
    }]
    // console.log(statsInfo.monthTrophy)
    this.setState({ sections })
  }

  handleImageOnclick = (url) => this.props.navigation.navigate('ImageViewer', {
    images: [
      { url }
    ]
  })

  hasGameTable = false

  renderItem = (index, { item }) => {
    const { modeInfo, statsInfo } = this.props.screenProps
    switch (index) {
      case 0:
        return <PieChart modeInfo={modeInfo} suffix='游戏' value={item}/>
      case 1:
        return <PieChart modeInfo={modeInfo} suffix='奖杯' value={item}/>
      case 2:
        return <PieChart modeInfo={modeInfo} suffix='奖杯点数' value={item}/>
      case 3:
        return <PieChart modeInfo={modeInfo} suffix='奖杯稀有度'
          selectedEntry={statsInfo.trophyRarePercent} value={item}/>
      case 4:
        return <PieChart modeInfo={modeInfo} suffix='游戏完成率'
          selectedEntry={statsInfo.gameRarePercent} value={item}/>
      case 5:
        return <PieChart modeInfo={modeInfo} suffix='游戏难度'
          ignore value={item}/>
      case 6:
        return <LineChart modeInfo={modeInfo} suffix='月活跃度'
          value={item}/>
      case 7:
        return <LineChart modeInfo={modeInfo} suffix='月活跃度'
          value={item.dataSets} xAxis={item.xAxis}/>
    }
    return null
  }

  render() {
    // console.log('GamePage.js rendered');
    const { modeInfo } = this.props.screenProps

    // console.log(modeInfo.themeName)
    return (
      <View
        style={{ flex: 1, backgroundColor: modeInfo.backgroundColor }}
        onStartShouldSetResponder={() => false}
        onMoveShouldSetResponder={() => false}
      >
        {this.state.isLoading && (
          <ActivityIndicator
            animating={this.state.isLoading}
            style={{
              flex: 999,
              justifyContent: 'center',
              alignItems: 'center'
            }}
            color={modeInfo.accentColor}
            size={50}
          />
        )}
        {!this.state.isLoading && <SectionList style={{
          flex: -1,
          backgroundColor: modeInfo.backgroundColor
        }}
          sections={this.state.sections}
          stickySectionHeadersEnabled
          ref={(list) => this.flatlist = list}
          keyExtractor={(_, index) => index.toString()}
          renderSectionHeader={renderSectionHeader as any}
          extraData={this.state}
          renderScrollComponent={props => <global.NestedScrollView {...props}/>}
          key={modeInfo.themeName}
          removeClippedSubviews={false}
          disableVirtualization={true}
          viewabilityConfig={{
            minimumViewTime: 3000,
            viewAreaCoveragePercentThreshold: 100,
            waitForInteraction: true
          }}
        >
        </SectionList>
        }
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#F5FCFF'
  },
  toolbar: {
    backgroundColor: standardColor,
    height: 56,
    elevation: 4
  },
  selectedTitle: {
    // backgroundColor: '#00ffff'
    // fontSize: 20
  },
  avatar: {
    width: 50,
    height: 50
  },
  a: {
    fontWeight: '300',
    color: idColor // make links coloured pink
  }
})