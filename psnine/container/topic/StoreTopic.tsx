import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Dimensions,
  InteractionManager,
  ActivityIndicator,
  StatusBar,
  Animated,
  Easing,
  ScrollView
} from 'react-native'

import Ionicons from 'react-native-vector-icons/Ionicons'
import {
  standardColor,
  idColor
} from '../../constant/colorConfig'

import { fetchStore as getAPI } from '../../dao'

// import CreateUserTab from './UserTab'

let screen = Dimensions.get('window')
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = screen

let toolbarActions = []
let title = 'TOPIC'
let WEBVIEW_REF = `WEBVIEW_REF`

let toolbarHeight = 56
let releasedMarginTop = 0

const ACTUAL_SCREEN_HEIGHT = SCREEN_HEIGHT - StatusBar.currentHeight + 1

let CIRCLE_SIZE = 56
let config = { tension: 30, friction: 7, ease: Easing.in(Easing.ease(1, 0, 1, 1)), duration: 200 }

const limit = SCREEN_WIDTH - toolbarHeight

export default class extends Component {

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
      marginTop: new Animated.Value(0),
      onActionSelected: this._onActionSelected
    }
  }

  componentWillMount = () => {
    this.preFetch()
    this._previousTop = 0
    const { openVal, marginTop } = this.state
    this._viewStyles = {
      style: {
        top: this._previousTop
      }
    }

  }

  preFetch = () => {
    const { params } = this.props.navigation.state
    this.setState({
      isLoading: true
    })
    InteractionManager.runAfterInteractions(() => {
      const data = getAPI(params).then(data => {
        this.setState({
          data,
          isLoading: false,
          titleInfo: data.titleInfo
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
    const { nightModeInfo } = modeInfo
    const { titleInfo } = this.state
    const color = 'rgba(255,255,255,1)'
    const infoColor = 'rgba(255,255,255,0.8)'
    // console.log(rowData.content)
    return (
      <View style={{ padding: 12, margin: 7, backgroundColor: modeInfo.backgroundColor, elevation: 1, flex: 1 }}>
        <HTMLView
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

  render() {
    const { params } = this.props.navigation.state
    // console.log('GamePage.js rendered');
    const { modeInfo } = this.props.screenProps
    const { data: source, marginTop } = this.state
    const data = []
    const renderFuncArr = []
    const shouldPushData = !this.state.isLoading

    this.viewBottomIndex = Math.max(data.length - 1, 0)

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
          title={`${params.title}`}
          titleColor={modeInfo.isNightMode ? '#000' : '#fff'}
          style={[styles.toolbar, { backgroundColor: modeInfo.standardColor }]}
          actions={this.state.toolbar}
          key={this.state.toolbar.map(item => item.text || '').join('::')}
          onIconClicked={() => {
            if (marginTop._value === 0) {
              this.props.navigation.goBack()
              return
            }
            this._viewStyles.style.top = 0
            this._previousTop = 0
            Animated.timing(marginTop, { toValue: 0, ...config, duration: 200 }).start()
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
        )}
        {!this.state.isLoading && <ScrollView style={{ flex: 1 }}>{this.renderHeader(this.state.data)}</ScrollView>}
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
    //backgroundColor: '#00ffff'
    //fontSize: 20
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
