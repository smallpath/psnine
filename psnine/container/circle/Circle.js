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
  Button,
  RefreshControl,
  Slider
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
import Item from '../shared/GeneItem'
import FooterProgress from '../shared/FooterProgress'
// import CreateUserTab from './UserTab'

let screen = Dimensions.get('window');
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = screen;

// let toolbarActions = [];
let title = "TOPIC";
let WEBVIEW_REF = `WEBVIEW_REF`;

let toolbarHeight = 56;
let releasedMarginTop = 0;

const ACTUAL_SCREEN_HEIGHT = SCREEN_HEIGHT - StatusBar.currentHeight + 1;

let CIRCLE_SIZE = 56;
let config = { tension: 30, friction: 7, ease: Easing.in(Easing.ease(1, 0, 1, 1)), duration: 200 };

const limit = SCREEN_WIDTH - toolbarHeight

let toolbarActions = [
  { title: '跳页', iconName: 'md-map', show: 'always' },
];

import { postCircle } from '../../dao/post'

export default class extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: false,
      isRefreshing: true,
      isLoadingMore: false,
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
      onActionSelected: this._onActionSelected,
      sliderValue: 1,     
      list: [],
      numberPerPage: 60,
      numPages: 1,
      commentTotal: 1,
      currentPage: 1,
      titleInfo: {}
    }
  }


  handlePress = (index) => {
    const { modeInfo } = this.props.screenProps
    const { nightModeInfo } = modeInfo
    const { navigation } = this.props
    const { params } = navigation.state
    let URL
    const id = (params.URL.match(/\/group\/(\d+)/) || [0, -1])[1]
    switch(index) {
      case 0:

        break;
      case 1:
        break;
      case 2:
        URL = params.URL + '/leaderboard?page=1'
        navigation.navigate('CircleRank', {
          URL
        })
        break;
      case 3:
        // 退圈
      case 4:
        // 申请加入
        postCircle({
          type: index === 3 ? 'unjoin' : 'join',
          groupid: id
        }).then(() => {
          global.toast && global.toast(index === 3 ? '退圈成功' : '申请成功')
        }).catch((err) => {
          global.toast && global.toast(err.toString())
        }).then(() => this.preFetch())
        break;
    }
  }

  componentWillMount = () => {
    const { params } = this.props.navigation.state
    this.URL = params.URL.includes('?page=') ? params.URL : `${params.URL}?page=1`
    this.fetchMessages(this.URL, 'jump');
  }

  fetchMessages = (url, type = 'down') => {
    this.setState({
      [type === 'down' ? 'isLoadingMore' : 'isRefreshing'] : true
    }, () => {
      InteractionManager.runAfterInteractions(() => {
        getAPI(url).then(data => {
          // console.log(url, type)
          let thisList = []
          const thisPage = parseInt((url.match(/\?page=(\d+)/) || [0, 1])[1])
          let cb = () => { }
          if (type === 'down') {
            thisList = this.state.list.concat(data.list)
            this.pageArr.push(thisPage)
          } else if (type === 'up') {
            thisList = this.state.list.slice()
            thisList.unshift(...data.list)
            this.pageArr.unshift(thisPage)
          } else if (type === 'jump') {
            // cb = () => this.listView.scrollTo({ y: 0, animated: true });
            thisList = data.list
            this.pageArr = [thisPage]
          }
          this.pageArr = this.pageArr.sort((a, b) => a - b)
          // console.log('??', thisList.length, this.pageArr)
          this.setState({
            list: thisList,
            numPages: data.numPages,
            currentPage: thisPage,
            isLoadingMore: false,
            isRefreshing: false,
            titleInfo: data.titleInfo
          }, cb);
        })
      })
    })
  }

  handleImageOnclick = (url) => this.props.navigation.navigate('ImageViewer', {
    images: [
      { url }
    ]
  })

  pageArr = [1]
  _onRefresh = () => {
    const { URL } = this;
    const currentPage = this.pageArr[0] || 1
    let type = currentPage === 1 ? 'jump' : 'up'
    let targetPage = currentPage - 1
    if (type === 'jump') {
      targetPage = 1
    }
    if (this.pageArr.includes(targetPage)) type = 'jump'
    if (this.state.isLoadingMore || this.state.isRefreshing) return
    // console.log(URL.split('=').slice(0, -1).concat(targetPage).join('='))
    this.fetchMessages(URL.split('=').slice(0, -1).concat(targetPage).join('='), type);
  }

  _onEndReached = () => {
    const { URL } = this;
    const currentPage = this.pageArr[this.pageArr.length - 1]
    const targetPage = currentPage + 1
    if (targetPage > this.state.numPages) return
    if (this.state.isLoadingMore || this.state.isRefreshing) return
    this.fetchMessages(URL.split('=').slice(0, -1).concat(targetPage).join('='), 'down');

  }

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
        marginBottom: 3.5,
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
                <Text style={{ color: modeInfo.titleTextColor }}>{rowData.name}</Text>
              </View>

              <View style={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{color: modeInfo.standardTextColor}}><Text style={{fontSize: 12, color: modeInfo.standardTextColor}}>机长：</Text>{rowData.owner}</Text>
              </View>
            </View> 
          </View>
        </View>

        { rowData.isLogined && rowData.isJoined && (
          <View style={{ justifyContent: 'space-around', alignItems: 'center', flexDirection: 'row', padding: 7}}>
            {/*<Button style={{flex:1}} title={'发基因'} color={modeInfo.standardColor} onPress={() => this.handlePress(0)}></Button>*/}
            <Button style={{flex:1}} title={'基因列表'} color={modeInfo.standardColor} onPress={() => this.handlePress(1)}></Button>
            <Button style={{flex:1}} title={'玩家排行榜'} color={modeInfo.standardColor} onPress={() => this.handlePress(2)}></Button>
            <Button style={{flex:1}} title={'贵圈真乱'} color={modeInfo.accentColor} onPress={() => this.handlePress(3)}></Button>
          </View>
        ) || (rowData.isLogined && (
          <View style={{ justifyContent: 'center', alignItems: 'center', flexDirection: 'row', padding: 7}}>
            <Button style={{flex:1}} title={'申请加入'} color={modeInfo.standardColor} onPress={() => this.handlePress(4)}></Button>
          </View>
        ) || undefined )}

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

  _renderItem = ({ item: rowData, index }) => {
    const { modeInfo } = this.props.screenProps
    const { navigation } = this.props
    // console.log(index)
    return <Item {...{
      navigation,
      rowData,
      modeInfo
    }} />
  }

  onActionSelected = (index) => {
    switch (index) {
      case 0:
        this.setState({
          modalVisible: true
        })
      return
    }
  }

  render() {
    // return (<View/>)
    // console.log('fuckyou1')
    const { params } = this.props.navigation.state
    // console.log('GamePage.js rendered');
    const { modeInfo } = this.props.screenProps
    const { data: source, marginTop } = this.state
    const data = []
    const renderFuncArr = []
    const shouldPushData = !this.state.isRefreshing 

    if (shouldPushData) {
      data.push(...this.state.list)
      data.unshift(this.state.titleInfo)
      data[0].id = 'default'
    }

    // console.log(data.length, '==>')

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
          actions={toolbarActions}
          onActionSelected={this.onActionSelected}
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
        />
        {/*{this.state.isRefreshing && (
          <ActivityIndicator
            animating={this.state.isRefreshing}
            style={{
              flex: 999,
              justifyContent: 'center',
              alignItems: 'center'
            }}
            color={accentColor}
            size={50}
          />
        )}*/}
        { <FlatList style={{
            flex: 1,
            backgroundColor: modeInfo.backgroundColor
          }}
            ref={flatlist => this.flatlist = flatlist}
            refreshControl={
              <RefreshControl
                refreshing={this.state.isRefreshing}
                onRefresh={this._onRefresh}
                colors={[modeInfo.standardColor]}
                progressBackgroundColor={modeInfo.backgroundColor}
                ref={ref => this.refreshControl = ref}
              />
            }
            data={data}
            keyExtractor={(item, index) => item.id}
            ListFooterComponent={() => <FooterProgress isLoadingMore={this.state.isLoadingMore} />}
            renderItem={({ item: rowData, index }) => index === 0 ? this.renderHeader(rowData) : this._renderItem({item: rowData, index})}
            extraData={modeInfo}
            windowSize={21}
            onEndReached={this._onEndReached}
            onEndReachedThreshold={0.5}
            updateCellsBatchingPeriod={1}
            initialNumToRender={8}
            maxToRenderPerBatch={8}
            disableVirtualization={false}
            contentContainerStyle={styles.list}
            getItemLayout={(data, index) => (
              {length: this.ITEM_HEIGHT, offset: this.ITEM_HEIGHT * index, index}
            )}
            viewabilityConfig={{
              minimumViewTime: 1,
              viewAreaCoveragePercentThreshold: 0,
              waitForInteractions: true
            }}
          />}
          {this.state.modalVisible && (
            <MyDialog modeInfo={modeInfo}
              modalVisible={this.state.modalVisible}
              onDismiss={() => { this.setState({ modalVisible: false }); this.isValueChanged = false }}
              onRequestClose={() => { this.setState({ modalVisible: false }); this.isValueChanged = false }}
              renderContent={() => (
                <View style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                  backgroundColor: modeInfo.backgroundColor,
                  paddingVertical: 30,
                  paddingHorizontal: 40,
                  elevation: 4,
                  opacity: 1
                }} borderRadius={2}>
                  <Text style={{ alignSelf: 'flex-start', fontSize: 18, color: modeInfo.titleTextColor }}>选择页数: {
                    this.isValueChanged ? this.state.sliderValue : this.state.currentPage
                  }</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{color: modeInfo.standardTextColor}}>{this.state.currentPage}</Text>
                    <Slider
                      maximumValue={this.state.numPages}
                      minimumValue={1}
                      maximumTrackTintColor={modeInfo.accentColor}
                      minimumTrackTintColor={modeInfo.standardTextColor}
                      thumbTintColor={modeInfo.accentColor}
                      style={{
                        paddingHorizontal: 90,
                        height: 50
                      }}
                      value={this.state.currentPage}
                      onValueChange={(value) => {
                        this.isValueChanged = true
                        this.setState({
                          sliderValue: Math.round(value)
                        })
                      }}
                    />
                    <Text style={{color: modeInfo.standardTextColor}}>{this.state.numPages}</Text>
                  </View>
                  <Text style={{ alignSelf: 'flex-end', color: '#009688' }}
                    onPress={() => {
                      this.setState({
                        modalVisible: false,
                        /*isLoadingMore: true*/
                      }, () => {
                        const currentPage = this.state.currentPage
                        const targetPage = this.URL.split('=').slice(0, -1).concat(this.state.sliderValue).join('=')
                        this.fetchMessages(targetPage, 'jump');
                      })
                    }}>确定</Text>
                </View>
              )} />
          )}
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
