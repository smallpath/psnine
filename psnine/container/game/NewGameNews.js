import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  Image,
  Picker,
  Dimensions,
  TouchableNativeFeedback,
  RefreshControl,
  InteractionManager,
  Modal,
  Slider,
  FlatList
} from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

import MyDialog from '../../components/Dialog'

import { connect } from 'react-redux';
import { standardColor, nodeColor, idColor } from '../../constants/colorConfig';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { getGameMapperAPI, getTopicURL } from '../../dao';

import TopicItem from '../shared/CommunityItem'
import GameItem from '../shared/GameItem'
import NewsItem from '../shared/NewsItem'
import FooterProgress from '../shared/FooterProgress'

let toolbarActions = [
  // { title: '跳页', iconName: 'md-map', show: 'always' },
];

class NewsItemBackup extends React.PureComponent {

  shouldComponentUpdate = (props, state) => props.modeInfo.themeName !== this.props.modeInfo.themeName

  _onRowPressed = (rowData) => {
    const { navigation } = this.props;
    const id = rowData.id || parseInt(rowData.url.split('/').pop())
    const URL = getTopicURL(id)
    navigation.navigate('CommunityTopic', {
      URL,
      title: rowData.title,
      rowData,
      type: 'community',
      shouldBeSawBackground: true
    })
  }

  render = () => {
    const { modeInfo, index = 0, rowData, navigation, ITEM_HEIGHT = 200, modalList = [], width = 260 } = this.props
    // console.log(rowData)
    return (
      <View style={{ height: ITEM_HEIGHT - 5, justifyContent: 'center', alignItems: 'center' }}>
        <View style={{
          marginVertical: 2.5,
          marginLeft: index % 2 ? 0 : 5,
          marginRight: index % 2 ? 0 : 5,
          marginHorizontal: 5,
          backgroundColor: modeInfo.backgroundColor,
          elevation: 1,
          flex: -1,
          height: ITEM_HEIGHT - 5,
          width
        }}>
          <TouchableNativeFeedback
            onPress={() => {
              this._onRowPressed(rowData)
            }}
            useForeground={true}
            delayPressIn={0}
            background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
          >
            <View style={{ flex: 1 }}>
              <View style={{ width, height: ITEM_HEIGHT - 5 - 50, backgroundColor: modeInfo.titleTextColor }}>
              { rowData.avatar && <Image
                source={{ uri: rowData.avatar }}
                style={{ width, height: ITEM_HEIGHT - 5 - 50 }}
              /> || undefined}
                <View style={{ 
                  position: 'absolute', 
                  bottom: 0, 
                  flex: -1,
                  left: 0,
                  right: 0,
                  flexDirection: 'row', 
                  justifyContent: 'space-between',
                  paddingHorizontal: 4,
                  zIndex: 2  }}>
                  <Text style={{ flex: -1, color: modeInfo.titleTextColor, }}>
                    {rowData.date}
                  </Text>
                  <Text style={{ flex: -1, color: modeInfo.titleTextColor, }}>
                    {rowData.reply}
                  </Text>
                </View>
                <View style={{ 
                  position: 'absolute', 
                  bottom: 0, 
                  flex: -1,
                  left: 0,
                  right: 0,
                  flexDirection: 'row', 
                  justifyContent: 'space-between',
                  backgroundColor: modeInfo.brighterLevelOne,
                  paddingHorizontal: 4,
                  opacity: 0.5,
                  zIndex: 1}}>
                  <Text style={{ flex: -1, color: modeInfo.titleTextColor, }}>
                    {rowData.date}
                  </Text>
                  <Text style={{ flex: -1, color: modeInfo.titleTextColor, }}>
                    {rowData.reply}
                  </Text>
                </View>
              </View>

              <View style={{ height: 45, padding: 5 }}>
                <Text
                  ellipsizeMode={'tail'}
                  numberOfLines={2}
                  style={{ flex: 1, color: modeInfo.titleTextColor, textAlignVertical: 'center' }}>
                  {rowData.title}
                </Text>
              </View>

            </View>
          </TouchableNativeFeedback>
        </View>
      </View>
    )
  }

}

class GameTopic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      URL: this.props.screenProps.baseUrl + '/news',
      numberPerPage: 60,
      numPages: 1,
      commentTotal: 1,
      currentPage: 1,
      isRefreshing: false,
      isLoadingMore: false,
      modalVisible: false,
      sliderValue: 1
    }
  }


  componentWillMount = async () => {
    this.fetchMessages(this.state.URL, 'jump');
  }

  fetchMessages = (url, type = 'down') => {
    this.setState({
      [type === 'down' ? 'isLoadingMore' : 'isRefreshing'] : true
    }, () => {
      InteractionManager.runAfterInteractions(() => {
        getGameMapperAPI(url).then(data => {
          this.setState({
            list: data,
            isLoadingMore: false,
            isRefreshing: false
          });
        })
      })
    })
  }

  pageArr = [1]
  _onRefresh = () => {
    if (this.state.isLoadingMore || this.state.isRefreshing) return
    this.fetchMessages(this.state.URL);
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


  ITEM_HEIGHT = 200 + 10

  _renderItem = ({ item: rowData, index }) => {
    const { modeInfo } = this.props.screenProps
    const { ITEM_HEIGHT } = this
    const { navigation } = this.props.screenProps
    // console.log(rowData)
    return <NewsItem {...{
      navigation,
      rowData,
      width: this.width - 10 * 2 + 2.5,
      modeInfo,
      index,
      ITEM_HEIGHT: this.width / 26  * 20
    }} />
  }

  sliderValue = 1
  width = Dimensions.get('window').width
  render() {
    const { modeInfo } = this.props.screenProps
    const { params } = this.props.screenProps.navigation.state
    const data = this.state.list
    // console.log('Message.js rendered');
    const { width, height } = Dimensions.get('window')
    this.width = width / 2 + 10 //Math.min(width, height) / 2 + 10
    return (
      <View
        style={{ flex: 1, backgroundColor: modeInfo.backgroundColor }}
        onStartShouldSetResponder={() => false}
        onMoveShouldSetResponder={() => false}
      >
        <FlatList style={{
          flex: 1,
          backgroundColor: modeInfo.backgroundColor
        }}
          ref={flatlist => this.flatlist = flatlist}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this._onRefresh}
              colors={[modeInfo.accentColor]}
              progressBackgroundColor={modeInfo.backgroundColor}
              ref={ref => this.refreshControl = ref}
            />
          }
          data={data}
          keyExtractor={(item, index) => item.id}
          renderItem={this._renderItem}
          onEndReached={this._onEndReached}
          onEndReachedThreshold={0.5}
          extraData={modeInfo}
          windowSize={21}
          updateCellsBatchingPeriod={1}
          initialNumToRender={42}
          maxToRenderPerBatch={8}
          disableVirtualization={false}
          contentContainerStyle={styles.list}
          viewabilityConfig={{
            minimumViewTime: 1,
            viewAreaCoveragePercentThreshold: 0,
            waitForInteractions: true
          }}
        />
      </View>
    )
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


export default GameTopic;
