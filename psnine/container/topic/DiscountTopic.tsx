import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  InteractionManager,
  ActivityIndicator,
  Animated,
  SectionList,
  Dimensions,
  Text
} from 'react-native'

import Ionicons from 'react-native-vector-icons/Ionicons'
import {
  standardColor,
  idColor
} from '../../constant/colorConfig'

import { fetchDiscountTopic as getAPI } from '../../dao'

import DiscountItem from '../../component/DiscountItem'
import GameItem from '../../component/GameItem'

declare var global

export default class extends Component<any, any> {

  constructor(props) {
    super(props)
    this.state = {
      data: false,
      isLoading: true,
      toolbar: [],
      afterEachHooks: [],
      mainContent: false,
      rotation: new Animated.Value(1),
      scale: new Animated.Value(1),
      opacity: new Animated.Value(1),
      openVal: new Animated.Value(0),
      modalVisible: false,
      modalOpenVal: new Animated.Value(0),
      marginTop: new Animated.Value(0)
    }
  }

  componentWillMount() {
    this.preFetch()
  }

  preFetch = () => {
    const { params } = this.props.navigation.state
    this.setState({
      isLoading: true
    })
    InteractionManager.runAfterInteractions(() => {
      getAPI(params.URL).then(data => {
        this.setState({
          data,
          isLoading: false
        })
      })
    })
  }

  handleImageOnclick = (url) => this.props.navigation.navigate('ImageViewer', {
    images: [
      { url }
    ]
  })

  renderHeader = (rowData) => {
    const { modeInfo } = this.props.screenProps
    // console.log(rowData.content)
    return (
      <View style={{ padding: 12, margin: 7, backgroundColor: modeInfo.backgroundColor, elevation: 1, flex: 1 }}>
        <global.HTMLView
          value={rowData.content}
          modeInfo={modeInfo}
          stylesheet={styles}
          onImageLongPress={() => { }}
          imagePaddingOffset={30}
          shouldForceInline={true}
        />
      </View>
    )
  }

  ITEM_HEIGHT = 150
  width = Dimensions.get('window').width
  _renderItem = ({ item: rowData }) => {
    const { modeInfo } = this.props.screenProps
    const { navigation } = this.props
    const { ITEM_HEIGHT } = this
    return <DiscountItem {...{
      navigation,
      rowData,
      modeInfo,
      ITEM_HEIGHT
    }} />
  }
  _renderGame = ({ item: rowData }) => {
    const { modeInfo } = this.props.screenProps
    const { navigation } = this.props
    return <GameItem {...{
      navigation,
      rowData,
      modeInfo,
      ITEM_HEIGHT: 74 + 7
    }} />
  }

  render() {
    const { params } = this.props.navigation.state
    // console.log('GamePage.js rendered');
    const { modeInfo } = this.props.screenProps
    const { data } = this. state
    const keyMapper = ['优惠历史', '关联奖杯']
    let sections = data.list ? [data.list, data.games].map((item, index) => ({
      key: keyMapper[index],
      modeInfo,
      data: item,
      renderItem: index === 0 ? this._renderItem : this._renderGame
    })) : []
    if (sections.length >= 2) {
      sections[1].data.length === 0 && sections.pop()
    }
    return (
      <View
        style={{ flex: 1, backgroundColor: modeInfo.background }}
        onStartShouldSetResponder={() => false}
        onMoveShouldSetResponder={() => false}
      >
        <Ionicons.ToolbarAndroid
          navIconName='md-arrow-back'
          overflowIconName='md-more'
          iconColor={modeInfo.isNightMode ? '#000' : '#fff'}
          title={`${data && data.title || params.title || '数折'}`}
          titleColor={modeInfo.isNightMode ? '#000' : '#fff'}
          style={[styles.toolbar, { backgroundColor: modeInfo.standardColor }]}
          actions={this.state.toolbar}
          key={this.state.toolbar.map(item => item.text || '').join('::')}
          onIconClicked={() => {
            this.props.navigation.goBack()
          }}
          onActionSelected={this.state.onActionSelected}
        />
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
        ) || (
          <SectionList
          enableVirtualization={false}
          disableVirtualization={true}
          keyExtractor={(item, index) => `${item.id || item.href}${index}`}
          renderSectionHeader={renderSectionHeader}
          stickySectionHeadersEnabled
          sections={sections}
        />
        )}
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
      elevation: 2
    }}>
      <Text numberOfLines={1}
        style={{ fontSize: 20, color: section.modeInfo.standardColor, textAlign: 'left', lineHeight: 25, marginLeft: 2, marginTop: 2 }}
      >{section.key}</Text>
    </View>
  )
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
