import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  ToastAndroid,
  Text,
  View,
  Image,
  Dimensions,
  TouchableNativeFeedback,
  InteractionManager,
  ActivityIndicator,
  StatusBar,
  Animated,
  Easing,
  FlatList,
  PanResponder,
  Modal,
  Keyboard,
  ScrollView,
  BackHandler,
  Button
} from 'react-native';

import { sync } from '../../dao/sync'
import MyDialog from '../../components/Dialog'
import HTMLView from '../../components/HtmlToView';
import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  standardColor, 
  nodeColor, 
  idColor,
  accentColor,
  levelColor,
  rankColor,
} from '../../constants/colorConfig';

import { fetchCircle as getAPI } from '../../dao';

// import CreateUserTab from './UserTab'

let screen = Dimensions.get('window');
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = screen;

let toolbarActions = [];
let title = "TOPIC";
let WEBVIEW_REF = `WEBVIEW_REF`;

let toolbarHeight = 56;
let releasedMarginTop = 0;

const ACTUAL_SCREEN_HEIGHT = SCREEN_HEIGHT - StatusBar.currentHeight + 1;

let CIRCLE_SIZE = 56;
let config = { tension: 30, friction: 7, ease: Easing.in(Easing.ease(1, 0, 1, 1)), duration: 200 };

const limit = SCREEN_WIDTH - toolbarHeight

export default class extends Component {

  constructor(props) {
    super(props);
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


  componentWillUnmount = () => {

  }

  componentWillMount = () => {
    this.preFetch()
    this._previousTop = 0
    const { openVal, marginTop } = this.state
    this._viewStyles= {
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
      const data = getAPI(params.URL).then(data => {
        this.setState({
          data,
          isLoading: false,
          titleInfo: data.titleInfo
        })
      })
    });
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

    return (
      <View style={{
        backgroundColor: modeInfo.backgroundColor,
        margin: 7,
        elevation: 2,
        padding: 12 
      }}>

        <View style={{ justifyContent:'center', alignItems: 'center', alignSelf: 'center', flex: -1,
          backgroundColor: modeInfo.backgroundColor,    
        }}>
          <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}> 
            <View style={{
              width: 85,
              height: 85,
              flexDirection: 'column',
              alignSelf: 'center'
            }} borderRadius={85/2}>
              <Image
                source={{ uri: rowData.avatar }}
                borderRadius={85/2}
                style={{
                  width: 85,
                  height: 85,
                  alignSelf: 'center',
                }}
              />
            </View>
            <View style={{ justifyContent: 'space-between', alignItems: 'flex-start', padding: 12}}>
              <View>
                <Text style={{}}>{rowData.name}</Text>
              </View>

              <View style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Text><Text style={{fontSize: 12, color: modeInfo.standardTextColor}}>机长：</Text>{rowData.owner}</Text>
              </View>
            </View> 
          </View>
        </View>


        <View style={{ justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row', padding: 7}}>
          <Button style={{flex:1}} title={'发基因'} color={modeInfo.standardColor} onPress={() => this.handlePress(0)}></Button>
          <Button style={{flex:1}} title={'基因列表'} color={modeInfo.standardColor} onPress={() => this.handlePress(1)}></Button>
          <Button style={{flex:1}} title={'玩家排行榜'} color={modeInfo.standardColor} onPress={() => this.handlePress(2)}></Button>
          <Button style={{flex:1}} title={'退圈'} color={modeInfo.accentColor} onPress={() => this.handlePress(3)}></Button>
        </View>

        <View style={{padding: 7, marginTop: 0}}>
          <HTMLView
            value={rowData.limit}
            modeInfo={modeInfo}
            stylesheet={styles}
            onImageLongPress={() => {}}
            imagePaddingOffset={30 + 85 + 10}
            shouldForceInline={true}
          />
        </View>

        <View style={{padding: 7}}>
          <HTMLView
            value={rowData.content}
            modeInfo={modeInfo}
            stylesheet={styles}
            onImageLongPress={() => {}}
            imagePaddingOffset={30 + 85 + 10}
            shouldForceInline={true}
          />
        </View>
      </View>
    )
  }

  handlePress = (index) => {
    switch(index) {
      case 0:

        break;
      case 1:

        break;
      case 2:

        break;
      case 3:

        break;
    }
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
          navIconName="md-arrow-back"
          overflowIconName="md-more"
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
            Animated.timing(marginTop, { toValue: 0, ...config, duration: 200 }).start();
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
            color={accentColor}
            size={50}
          />
        )}
        { !this.state.isLoading && <ScrollView>{this.renderHeader(this.state.titleInfo)}</ScrollView>}
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#F5FCFF',
  },
  toolbar: {
    backgroundColor: standardColor,
    height: 56,
    elevation: 4,
  },
  selectedTitle: {
    //backgroundColor: '#00ffff'
    //fontSize: 20
  },
  avatar: {
    width: 50,
    height: 50,
  },
  a: {
    fontWeight: '300',
    color: idColor, // make links coloured pink
  },
});
