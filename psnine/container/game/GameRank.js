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
  ProgressBarAndroid
} from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

import MyDialog from '../../components/Dialog'
import HTMLView from '../../components/HtmlToView'

import { connect } from 'react-redux';
import { standardColor, nodeColor, idColor } from '../../constants/colorConfig';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { getGameMapperAPI } from '../../dao';

import FooterProgress from '../shared/FooterProgress'

let toolbarActions = [
  { title: '跳页', iconName: 'md-map', show: 'always' },
];

import colorConfig, {
  errorColor,
  warningColor,
  successColor,
  perfectColor,
  textWarningColor,
  textSuccessColor,
  textErrorColor,
  textPerfectColor
} from '../../constants/colorConfig';

const getColorFromProgress = (progress) => {
  const value = parseInt(progress)
  if (value < 25) return errorColor
  if (value < 50) return warningColor
  if (value < 75) return successColor
  return perfectColor
}

const getLevelColorFromProgress = (progress) => {
  const value = parseFloat(progress)
  if (value <= 5) return textErrorColor
  if (value <= 25) return textWarningColor
  if (value <= 60) return textSuccessColor
  return textPerfectColor
}

const getContentFromTrophy = text => {
  const item1 = text.split('金')[0]
  const item2 = text.split('银')[0].replace(item1, '')
  const item3 = text.split('铜')[0].replace(item1 + item2, '')
  const item4 = '铜' + text.split('铜').pop()
  return [
    item1,
    item2,
    item3,
    item4
  ]
}

class TopicItem extends React.PureComponent {

  shouldComponentUpdate = (props, state) => props.modeInfo.themeName !== this.props.modeInfo.themeName

  _onRowPressed = (rowData) => {
    const { navigation } = this.props;
    navigation.navigate('Home', {
      title: rowData.psnid,
      id: rowData.psnid,
      URL: `http://psnine.com/psnid/${rowData.psnid}`
    })
  }

  _onGamePressed = (rowData) => {
    const { navigation } = this.props;
    navigation.navigate('GamePage', {
      title: '@' + rowData.psnid,
      rowData: {
        id: rowData.url.replace(/\?.*?$/, '').split('/').pop()
      },
      URL: rowData.url
    })
  }


  render = () => {
    const { modeInfo, rowData, modalList = [] } = this.props
    // console.log(rowData.content)
    return (
      <TouchableNativeFeedback onPress={() => this._onGamePressed(rowData)}>
        <View style={{
          marginVertical: 3.5,
          marginHorizontal: 3.5,
          backgroundColor: modeInfo.backgroundColor,
          elevation: 1,
        }}>
          <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'nowrap',padding: 8, justifyContent: 'space-around', alignItems: 'center' }}>
            <View style={{ flex: -1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 10}}>
              <Text style={{textAlign: 'center', textAlignVertical: 'center', color: modeInfo.titleTextColor}}>
                No.{rowData.rank}
              </Text>
            </View>
            <TouchableNativeFeedback onPress={() => {
                this._onGamePressed(rowData)
              }}>
              <Image
                source={{ uri: rowData.avatar }}
                style={[styles.avatar, { width: 50 }]}
              />
            </TouchableNativeFeedback>
            <View style={{ flex: 3, padding: 5}}>
              <View style={{flexDirection: 'row'}}>
                <Image
                  source={{ uri: rowData.server}}
                  style={{ width: 20, height: 20}}
                  />
                <Text style={{color: modeInfo.accentColor}} onPress={() => {
                    this._onRowPressed(rowData)
                  }}>{rowData.psnid}</Text>
              </View>
              <Text style={{color: modeInfo.standardTextColor, fontSize: 12}}>{rowData.time}</Text>
            </View>
            { rowData.cost && (
                <View style={{ flex: 1, justifyContent: 'center', padding: 2 }}>
                  <Text selectable={false}             
                    style={{ 
                      flex: -1,             
                      textAlign: 'center',
                      textAlignVertical: 'center',
                      color: modeInfo.titleTextColor, }}>{rowData.cost}</Text>
                  <Text
                    ellipsizeMode={'tail'} 
                    style={{
                      flex: -1,
                      color: modeInfo.standardTextColor,
                      textAlign: 'center',
                      textAlignVertical: 'center',
                      fontSize: 10
                    }}>总耗时</Text>
                </View>
                ) || <View style={{ flex: 1, justifyContent: 'center', padding: 2 }}/>
              }
            <View style={{ flex: 1.5, justifyContent: 'center', padding: 2 }}>
              <Text selectable={false}             
                style={{ 
                  flex: -1,             
                  textAlign: 'center',
                  textAlignVertical: 'center',
                  color: modeInfo.titleTextColor, }}>{rowData.progress}</Text>
              <ProgressBarAndroid color={getColorFromProgress(rowData.progress)}
                indeterminate={false}
                progress={parseInt(rowData.progress)/100}
                style={{flex: -1, height: 4}}
                styleAttr="Horizontal" />
              <Text
                ellipsizeMode={'tail'} 
                style={{
                  flex: -1,
                  color: modeInfo.standardTextColor,
                  textAlign: 'center',
                  textAlignVertical: 'center',
                  fontSize: 10
                }}>{getContentFromTrophy(rowData.trophies.join('')).map((item, index) => {
                  return (
                    <Text key={index} style={{color: colorConfig['trophyColor' + (index + 1)]}}>
                      {item}
                    </Text>
                  )
                })}</Text>
            </View>
          </View>
        </View>
      </TouchableNativeFeedback>
    )
  }
}

class GameTopic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      numberPerPage: 60,
      numPages: 1,
      commentTotal: 1,
      currentPage: 1,
      isRefreshing: true,
      isLoadingMore: false,
      modalVisible: false,
      sliderValue: 1
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
        const { server, ob } = this.state
        getGameMapperAPI(url + `&server=${server}&ob=${ob}`).then(data => {
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
          // alert(`${this.state.currentPage} ${thisPage} ${data.numPages}`)
          this.setState({
            list: thisList,
            numberPerPage: data.numberPerPage,
            numPages: data.numPages,
            commentTotal: data.len,
            currentPage: thisPage,
            isLoadingMore: false,
            isRefreshing: false
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
    this.flatlist && this.flatlist.scrollToOffset({ offset: 0, animated: true })
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

  onValueChange = (key: string, value: string) => {
    const newState = {};
    newState[key] = value;
    this.setState(newState, () => {
      this._onRefresh()
    });
  };

  _renderHeader = () => {
    const { modeInfo } = this.props.screenProps
    return (
      <View style={{
        flex: -1,
        elevation: 2,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 40,
        paddingTop: 3,
        backgroundColor: modeInfo.backgroundColor
      }}>
        <Picker style={{
          flex: 1,
          color: modeInfo.standardTextColor
        }}
          prompt='选服'
          selectedValue={this.state.server}
          onValueChange={this.onValueChange.bind(this, 'server')}>
          <Picker.Item label="全部" value="all" />
          <Picker.Item label="港服" value="hk" />
          <Picker.Item label="日服" value="jp" />
          <Picker.Item label="美服" value="us" />
          <Picker.Item label="国服" value="cn" />
        </Picker>
        <Picker style={{
          flex: 1,
          borderWidth: 1,
          color: modeInfo.standardTextColor
        }}
          prompt='排序'
          selectedValue={this.state.ob}
          onValueChange={this.onValueChange.bind(this, 'ob')}>
          <Picker.Item label="进度最快" value="ratio" />
          <Picker.Item label="最新" value="date" />
          <Picker.Item label="完美耗时最短" value="timeuse" />
        </Picker>
      </View>
    )
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


  ITEM_HEIGHT = 78 + 7

  _renderItem = ({ item: rowData, index }) => {
    const { modeInfo } = this.props.screenProps
    const { ITEM_HEIGHT } = this
    const { navigation } = this.props
    return <TopicItem {...{
      navigation,
      rowData,
      modeInfo,
      ITEM_HEIGHT
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
          title={'排行'}
          style={[styles.toolbar, { backgroundColor: modeInfo.standardColor }]}
          titleColor={modeInfo.isNightMode ? '#000' : '#fff'}
          actions={toolbarActions}
          onIconClicked={this.onNavClicked}
          onActionSelected={this.onActionSelected}
        />
        {
          this.state.numPages > 1 && this._renderHeader()
        }
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
          keyExtractor={(item, index) => item.psnid}
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
                paddingVertical: 20,
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
                      modalVisible: false
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


export default GameTopic;
