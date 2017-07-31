import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  RefreshControl,
  InteractionManager,
  SectionList,
  Animated,
  Button
} from 'react-native'

import { idColor } from '../../constant/colorConfig'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { getGroupAPI } from '../../dao'
const AnimatedSectionList = Animated.createAnimatedComponent(SectionList)

let toolbarActions = []

class NodeItem extends React.PureComponent<any, any> {

  render() {
    const { modeInfo, onPress, rowData } = this.props

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
      elevation: 2
    }}>
      <Text numberOfLines={1}
        style={{ fontSize: 20, color: idColor, textAlign: 'left', lineHeight: 25, marginLeft: 2, marginTop: 2 }}
      >{section.key}</Text>
    </View>
  )
}

export default class Element extends Component<any, any> {

  constructor(props) {
    super(props)
    this.state = {
      isLoading: false,
      data: []
    }
  }

  componentWillMount() {
    this.fetch()
  }

  fetch = () => {
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
  _renderItemComponent = ({ item: rowData }) => {
    const { modeInfo } = this.props.screenProps
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
    const { data } = this.state

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
          navIconName='md-arrow-back'
          overflowIconName='md-more'
          iconColor={modeInfo.isNightMode ? '#000' : '#fff'}
          title={'圈子'}
          style={{ backgroundColor: modeInfo.standardColor, height: 56, elevation: 4 }}
          titleColor={modeInfo.isNightMode ? '#000' : '#fff'}
          actions={toolbarActions}
          onIconClicked={this.onNavClicked}
        />
        <AnimatedSectionList
          enableVirtualization={false}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isLoading}
              colors={[modeInfo.accentColor]}
              progressBackgroundColor={modeInfo.backgroundColor}
            />
          }
          disableVirtualization={true}
          keyExtractor={(item) => `${item.id || item.href}`}
          renderItem={this._renderItemComponent}
          renderSectionHeader={renderSectionHeader}
          stickySectionHeadersEnabled
          sections={sections}
        />
      </View>
    )
  }

}
