import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  InteractionManager,
  SectionList,
  Animated,
  ScrollView,
  Button,
  ActivityIndicator
} from 'react-native'

import Ionicons from 'react-native-vector-icons/Ionicons'
import { getDetailAPI, getNBAPI } from '../../dao'
import CircleItem from '../../component/CircleItem'

const AnimatedSectionList = Animated.createAnimatedComponent(SectionList)

let toolbarHeight = 56
let releasedMarginTop = 0

let toolbarActions = []

export default class Detail extends Component<any, any> {

  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      data: {
        joinedList : [],
        ownedList : []
      },
      nb: ''
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
      Promise.all([
        getNBAPI('http://psnine.com/my'),
        getDetailAPI('http://psnine.com/my/account')
      ]).then(arr => {
        this.setState({
          data: arr[1],
          nb: arr[0],
          isLoading: false
        })
      })
    })
  }

  onNavClicked = () => {
    this.props.navigation.goBack()
  }

  ITEM_HEIGHT = 74 + 7
  _renderItemComponent = ({ item, rowData, index }) => {
    // console.log(...args)
    const { modeInfo } = this.props.screenProps
    const { ITEM_HEIGHT } = this
    const { navigation } = this.props
    return (<CircleItem {...{
      modeInfo,
      navigation,
      rowData
    }}/>)
  }

  renderVIP = (rowData) => {
    const { modeInfo } = this.props.screenProps
    const { navigation } = this.props
    return (
      <ScrollView style={{flex: 1, padding: 5}}>
        <Button color={modeInfo.accentColor} title={'捐助PSNINE'} onPress={() => {
          navigation.navigate('WebView', {
            URL: 'http://psnine.com/set/mujuan',
            title: '捐助PSNINE'
          })
        }}/>
        <View style={{flex: 1, alignItems: 'center'}}><Text style={{color: modeInfo.standardColor, padding: 20}}>{this.state.nb}</Text></View>
        <View style={{ flex: 1, flexDirection: 'row' }}>
          <View style={{flex: 1, alignItems: 'center'}}><Text style={{color: '#659f13', padding: 20}}>{rowData.zb}</Text></View>
          <View style={{flex: 1, alignItems: 'center'}}><Text style={{color: '#b94a48', padding: 20}}>{rowData.level}</Text></View>
        </View>
        <View style={{ flex: 1, padding: 20 }}>
          <Text style={{ color: modeInfo.standardTextColor }}>{rowData.ssInfo}</Text>
        </View>
        { rowData.serverInfo && rowData.serverInfo.length && <View style={{ flex: 1, padding: 10 }}>
          {rowData.serverInfo.map((item, index) => <View key={index} style={{flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 2}}>
            <Text style={{flex: 1, alignItems: 'center', color: modeInfo.standardTextColor }}>{item.ip}</Text><Text
              style={{flex: 1, alignItems: 'center', color: modeInfo.standardTextColor }}>{item.name}</Text>
          </View>)}
        </View>}
        <View style={{ flex: 1, padding: 10 }}>
          <global.HTMLView
            value={rowData.history}
            modeInfo={modeInfo}
            stylesheet={styles}
            onImageLongPress={(url) => this.props.navigation.navigate('ImageViewer', {
              images: [
                { url }
              ]
            })}
            imagePaddingOffset={20}
            shouldForceInline={false}
          />
        </View>
      </ScrollView>
    )
  }

  render() {
    const { modeInfo } = this.props.screenProps
    const { data } = this.state

    let keys = Object.keys(data)
    let NUM_SECTIONS = keys.length

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
          title={'明细'}
          style={{ backgroundColor: modeInfo.standardColor, height: 56, elevation: 4 }}
          titleColor={modeInfo.isNightMode ? '#000' : '#fff'}
          actions={toolbarActions}
          onIconClicked={this.onNavClicked}
          onActionSelected={this.onActionSelected}
        />
        {
          this.state.isLoading && (
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
            <ScrollView
              ref={flatlist => this.flatlist = flatlist}
              style={styles.list}
              >
              { this.state.data.vipInfo && this.renderVIP(this.state.data.vipInfo)}
            </ScrollView>
          )
        }
      </View>
    )
  }

}

const styles = StyleSheet.create({
  avatar: {
    width: 50,
    height: 50
  }
})
