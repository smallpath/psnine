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
  FlatList,
  Alert
} from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

import MyDialog from '../../components/Dialog'

import HTMLView from '../../components/HtmlToView';
import { connect } from 'react-redux';
import { standardColor, nodeColor, idColor } from '../../constants/colorConfig';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { getPhotoAPI } from '../../dao';
import { postDeleteImage } from '../../dao/post';

import TopicItem from '../shared/CommunityItem'
import GeneItem from '../shared/GeneItem'
import RankItem from '../shared/RankItem'
import QaItem from '../shared/QaItem'
const Mapper = {
  'topic': TopicItem,
  'gene' : GeneItem,
  'psnid': RankItem,
  'qa': QaItem
}
import FooterProgress from '../shared/FooterProgress'

let toolbarActions = [
  { title: '上传', iconName: 'md-cloud-upload', show: 'always' },
  { title: '跳页', iconName: 'md-map', show: 'always' },
  { title: '确定', iconName: 'md-checkmark', show: 'always' },
];

import Item from '../shared/PhotoItem'

export default class Photo extends Component {
  constructor(props) {
    super(props);
    const { navigation } = this.props
    const { params } = navigation.state
    const { selections = [], type = 'general' } = params
    this.state = {
      list: [],
      numberPerPage: 60,
      numPages: 1,
      commentTotal: 1,
      currentPage: 1,
      isRefreshing: true,
      isLoadingMore: false,
      modalVisible: false,
      sliderValue: 1,
      selections,
      type
    }
  }

  onNavClicked = (rowData) => {
    const { navigation } = this.props;
    navigation.goBack();
  }

  componentWillMount = async () => {
    const { params } = this.props.navigation.state
    this.fetchMessages(params.URL, 'jump');
  }

  fetchMessages = (url, type = 'down') => {
    this.setState({
      [type === 'down' ? 'isLoadingMore' : 'isRefreshing'] : true
    }, () => {
      InteractionManager.runAfterInteractions(() => {
        getPhotoAPI(url).then(data => {
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
          this.setState({
            list: thisList,
            numberPerPage: data.numberPerPage,
            numPages: data.numPages,
            commentTotal: data.len,
            currentPage: thisPage,
            isLoadingMore: false,
            isRefreshing: false,
            finalType: this.state.type
          }, cb);
        })
      })
    })
  }

  pageArr = [1]
  _onRefresh = () => {
    const { URL } = this.props.navigation.state.params;
    const currentPage = this.pageArr[0] || 1
    let type = currentPage === 1 ? 'jump' : 'up'
    let targetPage = currentPage - 1
    if (type === 'jump') {
      targetPage = 1
    }
    if (this.pageArr.includes(targetPage)) type = 'jump'
    if (this.state.isLoadingMore || this.state.isRefreshing) return
    this.fetchMessages(URL.split('=').slice(0, -1).concat(targetPage).join('='), type);
  }

  _onEndReached = () => {
    const { URL } = this.props.navigation.state.params;
    const currentPage = this.pageArr[this.pageArr.length - 1]
    const targetPage = currentPage + 1
    if (targetPage > this.state.numPages) return
    if (this.state.isLoadingMore || this.state.isRefreshing) return
    this.fetchMessages(URL.split('=').slice(0, -1).concat(targetPage).join('='), 'down');
  }

  onActionSelected = (index) => {
    switch (index) {
      case 0:
        this.props.navigation.navigate('ImageUpload', {
          callback: () => {
            this.fetchMessages()
          }
        })
      return
      case 1:
        this.setState({
          modalVisible: true
        })
      return
      case 2:
        const { navigation } = this.props
        const { params } = navigation.state
        params.callbackAfterAll && params.callbackAfterAll(this.state.selections)
        navigation.goBack()
      return
    }
  }


  ITEM_HEIGHT = 150 + 10

  _renderItem = ({ item: rowData, index }) => {
    const { modeInfo } = this.props.screenProps
    const { ITEM_HEIGHT } = this
    const { navigation } = this.props
    const { params } = navigation.state
    const { selections } = this.state
    // console.log(rowData)
    return <Item {...{
      navigation,
      rowData,
      modeInfo,
      ITEM_HEIGHT,
      isChecked: selections.includes(rowData.id),
      onPress: () => {
        if (params.alertText && params.afterAlert) {
          Alert.alert(
            '提示',
            params.alertText,
            [
              {
                text: '取消', style: 'cancel'
              },
              {
                text: '确定', onPress: () => {
                  navigation.goBack()
                  params.afterAlert({ url: rowData.href || rowData.img })
                }
              }
            ]
          )
        } else if (params.callback) {
          navigation.goBack()
          params.callback({ url: rowData.href || rowData.img })
        } else if (params.type === 'multi') {
          const target = this.state.selections.includes(rowData.id) ? 
              this.state.selections.filter(item => item !== rowData.id) : 
              this.state.selections.slice().concat(rowData.id)
          this.setState({
            selections: target
          })
        }
      },
      onLongPress: () => {
        Alert.alert(
          '提示',
          '是否删除图片?',
          [
            {
              text: '取消', style: 'cancel'
            },
            {
              text: '确定', onPress: () => {
                postDeleteImage({ delimg: rowData.delimg }).then(res => res.text()).then(html => {
                  toast('删除成功')
                  this.fetchMessages(params.URL, 'jump');
                })
              }
            }
          ]
        )
      }
    }} />
  }

  sliderValue = 1
  render() {
    const { modeInfo } = this.props.screenProps
    const { params } = this.props.navigation.state
    // console.log('Message.js rendered');

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
          title={'图床'}
          style={[styles.toolbar, { backgroundColor: modeInfo.standardColor }]}
          titleColor={modeInfo.isNightMode ? '#000' : '#fff'}
          actions={params.type === 'multi' ? toolbarActions : toolbarActions.slice(0, 2)}
          onIconClicked={this.onNavClicked}
          onActionSelected={this.onActionSelected}
        />
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
          ListFooterComponent={() => <FooterProgress isLoadingMore={this.state.isLoadingMore} modeInfo={modeInfo} />}
          data={this.state.list}
          keyExtractor={(item, index) => item.url || item.href}
          renderItem={this._renderItem}
          onEndReached={this._onEndReached}
          onEndReachedThreshold={0.5}
          extraData={modeInfo}
          windowSize={21}
          numColumns={2}
          columnWrapperStyle={{
            flex:1
          }}
          updateCellsBatchingPeriod={1}
          initialNumToRender={42}
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
        />
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
                <TouchableNativeFeedback onPress={() => {
                    this.setState({
                      modalVisible: false,
                      isLoading: true
                    }, () => {
                      const currentPage = this.state.currentPage
                      const targetPage = params.URL.split('=').slice(0, -1).concat(this.state.sliderValue).join('=')
                      this.fetchMessages(targetPage, 'jump');
                    })
                  }}>
                  <View style={{ alignSelf: 'flex-end', paddingHorizontal: 8, paddingVertical: 5 }}>
                    <Text style={{color: '#009688'}}>确定</Text>
                  </View>
                </TouchableNativeFeedback>
              </View>
            )} />
        )}
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
