import React, { Component } from 'react'
import {
  Text,
  View,
  ActivityIndicator,
  Animated,
  FlatList,
  TouchableNativeFeedback
} from 'react-native'

import TrophyItem from '../../component/TrophyItem'
import Ionicons from 'react-native-vector-icons/Ionicons'

declare var global

export default class TrophyAdvisor extends Component<any, any> {
  static navigationOptions = {
     tabBarLabel: '奖杯建议'
  }
  constructor(props) {
    super(props)
    this.state = {
      pf: 'all',
      ob: 'easy',
      dlc: 'all',
      text: '',
      isLoading: false,
      data: [],
      rotation: new Animated.Value(1),
      scale: new Animated.Value(1),
      opacity: new Animated.Value(1),
      openVal: new Animated.Value(0),
      modalVisible: false,
      modalOpenVal: new Animated.Value(0),
      topicMarginTop: new Animated.Value(0),
      scrollEnabled: true
    }
  }

  componentWillMount() {
    this.onValueChanged()
  }

  flatlist: any

  handleImageOnclick = (url) => this.props.navigation.navigate('ImageViewer', {
    images: [
      { url }
    ]
  })

  renderItem = ({ item: rowData }) => {
    const { modeInfo, navigation } = this.props.screenProps
    return <TrophyItem {...{
      navigation,
      rowData,
      modeInfo
    }} />
  }

  hasGameTable = false

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
        { !this.state.isLoading && (
          <FlatList style={{
            flex: -1,
            backgroundColor: modeInfo.backgroundColor
          }}
            data={this.state.data}
            ref={(list) => this.flatlist = list}
            scrollEnabled={this.state.scrollEnabled}
            keyExtractor={(item, index) => item.href || index}
            renderItem={this.renderItem}
            extraData={this.state}
            windowSize={999}
            renderScrollComponent={props => <global.NestedScrollView {...props}/>}
            key={modeInfo.themeName}
            numColumns={modeInfo.numColumns}
            removeClippedSubviews={false}
            disableVirtualization={true}
            viewabilityConfig={{
              minimumViewTime: 3000,
              viewAreaCoveragePercentThreshold: 100,
              waitForInteraction: true
            }}
          >
          </FlatList>
        )}
        { !this.state.isLoading && (
          <View style={{
              position: 'absolute',
              right: 16,
              bottom: 16,
              width: 56,
              height: 56,
              borderRadius: 28,
              justifyContent: 'center',
              alignItems: 'center',
              elevation: 6
            }} ref={float => this.float = float}>
            <TouchableNativeFeedback
              background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
              useForeground={false}
              onPress={() => this.setState({ modalVisible: true })}
              onPressIn={() => {
                this.float.setNativeProps({
                  style: {
                    elevation: 12
                  }
                })
              }}
              onPressOut={() => {
                this.float.setNativeProps({
                  style: {
                    elevation: 6
                  }
                })
              }}>
              <View pointerEvents='box-only' style={{
                backgroundColor: modeInfo.accentColor,
                borderRadius: 28, width: 56, height: 56, flex: -1, justifyContent: 'center', alignItems: 'center'
              }}>
                <Ionicons name='md-search' size={24} color={modeInfo.backgroundColor}/>
              </View>
            </TouchableNativeFeedback>
          </View>
        )}
        {this.state.modalVisible && (
          <global.MyDialog modeInfo={modeInfo}
            modalVisible={this.state.modalVisible}
            onDismiss={() => { this.setState({ modalVisible: false }) }}
            onRequestClose={() => { this.setState({ modalVisible: false }) }}
            renderContent={() => (
              <View style={{
                justifyContent: 'center',
                alignItems: 'flex-start',
                backgroundColor: modeInfo.backgroundColor,
                paddingVertical: 20,
                paddingHorizontal: 20,
                elevation: 4,
                opacity: 1,
                borderRadius: 2
              }} >
                {
                  Object.keys(filters).map((kind, index) => {
                    return (
                      <View style={{flexDirection: 'row', padding: 5}} key={index}>
                        <Text style={{color: modeInfo.standardTextColor, textAlignVertical: 'center'}}>{filters[kind].text}: </Text>
                        {
                          filters[kind].value.map((item, inner) => {
                            return (
                              <View key={inner} style={{margin: 2}}>
                                <TouchableNativeFeedback
                                  useForeground={true}
                                  background={TouchableNativeFeedback.SelectableBackgroundBorderless()} onPress={() => {
                                  this.setState({
                                    [kind]: item.value,
                                    modalVisible: false
                                  }, () => {
                                    this.onValueChanged()
                                  })
                                }}>
                                  <View style={{ flex: -1, padding: 4, paddingHorizontal: 6,
                                    backgroundColor: modeInfo[item.value === this.state[kind] ? 'accentColor' : 'standardColor'],
                                    borderRadius: 2 }}>
                                    <Text style={{ color: modeInfo.backgroundColor }}>{item.text}</Text>
                                  </View>
                                </TouchableNativeFeedback>
                              </View>
                            )
                          })
                        }
                      </View>
                    )
                  })
                }
              </View>
            )} />
        )}
      </View>
    )
  }

  isValueChanged = false
  float: any = false

  search = (text) => {
    this.setState({
      modalVisible: false,
      text
    }, () => {
      this.onValueChanged()
    })
  }

  onValueChanged = () => {
    const { pf, ob } = this.state

    const { trophyList } = this.props.screenProps
    let data = trophyList.filter(item => !item.timestamp && item.rare)
    switch (pf) {
      case 'psvita':
        data = data.filter(item => item.gameInfo.platform.includes('PSV'))
        break
      case 'ps3':
        data = data.filter(item => item.gameInfo.platform.includes('PS3'))
        break
      case 'ps4':
        data = data.filter(item => item.gameInfo.platform.includes('PS4'))
        break
    }
    switch (ob) {
      case 'difficult':
        data = data.sort((a, b) => parseFloat(a.rare) - parseFloat(b.rare))
        break
      case 'easy':
        data = data.sort((a, b) => parseFloat(b.rare) - parseFloat(a.rare))
        break
    }
    this.flatlist && this.flatlist.scrollToOffset({ offset: 0, animated: true })
    this.setState({
      data
    })
  }

  goToSearch = async () => {
    await this.setState({ modalVisible: false })
    this.props.screenProps.navigation.navigate('Search', {
      callback: (text) => {
        if (text === this.state.text) return
        this.search(text)
      },
      content: this.state.text,
      placeholder: '搜索游戏',
      shouldSeeBackground: true
    })
  }
}

const filters = {
  pf: {
    text: '平台',
    value: [{
      text: '全部',
      value: 'all'
    }, {
      text: 'PSV',
      value: 'psvita'
    }, {
      text: 'PS3',
      value: 'ps3'
    }, {
      text: 'PS4',
      value: 'ps4'
    }]
  },
  ob: {
    text: '排序',
    value: [{
      text: '难度最高',
      value: 'difficult'
    }, {
      text: '难度最低',
      value: 'easy'
    }]
  }
}