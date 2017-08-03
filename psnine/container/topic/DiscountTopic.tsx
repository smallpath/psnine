import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  InteractionManager,
  ActivityIndicator,
  Animated,
  FlatList,
  Dimensions
} from 'react-native'

import Ionicons from 'react-native-vector-icons/Ionicons'
import {
  standardColor,
  idColor
} from '../../constant/colorConfig'

import { fetchDiscountTopic as getAPI } from '../../dao'

import DiscountItem from '../../component/DiscountItem'

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

  render() {
    const { params } = this.props.navigation.state
    // console.log('GamePage.js rendered');
    const { modeInfo } = this.props.screenProps

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
          title={`${params.title || '数折'}`}
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
          <FlatList style={{
            flex: 1,
            backgroundColor: modeInfo.background
          }}
            data={this.state.data}
            keyExtractor={(item, index) => `${item.id}::${index}::${item.views}::${item.count}`}
            renderItem={this._renderItem}
            extraData={modeInfo}
            windowSize={21}
            updateCellsBatchingPeriod={1}
            initialNumToRender={42}
            maxToRenderPerBatch={8}
            key={modeInfo.themeName}
            numColumns={modeInfo.numColumns}
            disableVirtualization={false}
            getItemLayout={(_, index) => (
              {length: this.ITEM_HEIGHT, offset: this.ITEM_HEIGHT * index, index}
            )}
            viewabilityConfig={{
              minimumViewTime: 1,
              viewAreaCoveragePercentThreshold: 0,
              waitForInteractions: true
            }}
          />
        )}
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
