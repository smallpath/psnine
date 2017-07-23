import React, { Component } from 'react'
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
  TextInput,
  FlatList,
  Button
} from 'react-native'

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window')

import { connect } from 'react-redux'
import { standardColor, nodeColor, idColor } from '../../constant/colorConfig'

import Ionicons from 'react-native-vector-icons/Ionicons'
import { getMyGameAPI } from '../../dao'

import UserGameItem from '../../component/UserGameItem'
import FooterProgress from '../../component/FooterProgress'

let toolbarActions = [
  { title: '跳页', iconName: 'md-map', show: 'always' }
]

class UserGame extends Component {
  static navigationOptions = {
     tabBarLabel: '游戏'
  }
  constructor(props) {
    super(props)
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
      pf: 'all',
      ob: 'date',
      dlc: 'all',
      text: ''
    }
  }

  componentWillMount = async () => {
    const { screenProps } = this.props
    const name = '游戏'
    let params = {}
    screenProps.toolbar.forEach(({ text, url}) => {
      // console.log(text, name, text.includes(name))
      if (text.includes(name)) {
        params.text = text
        params.URL = url
      }
    })
    if (!params.URL) {
      params = { ...screenProps.toolbar[1] }
    }
    this.URL = params.URL.includes('?page') ? params.URL : `${params.URL}?page=1`
    this.originURL = params.URL
    this.fetchMessages(params.URL, 'jump')
  }

  fetchMessages = (url, type = 'down') => {
    this.setState({
      [type === 'down' ? 'isLoadingMore' : 'isRefreshing'] : true
    }, () => {
      if (type !== 'down') {
        this.flatlist && this.flatlist.scrollToOffset({ offset: 0, animated: true });
      }
      InteractionManager.runAfterInteractions(() => {
        // alert(url)
        getMyGameAPI(url).then(data => {
          let thisList = []
          const thisPage = parseInt((url.match(/\page=(\d+)/) || [0, 1])[1])
          let cb = () => {}
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
            isRefreshing: false
          }, () => {
            cb()
            const componentDidFocus = () => {
              InteractionManager.runAfterInteractions(() => {
                this.props.screenProps.setToolbar({
                  toolbar: toolbarActions,
                  toolbarActions: this.onActionSelected,
                  componentDidFocus: {
                    index: 1,
                    handler: componentDidFocus
                  }
                })
              })
            }
            componentDidFocus()
          })
        })
      })
    })
  }

  pageArr = [1]
  _onRefresh = () => {
    const { URL } = this
    const currentPage = this.pageArr[0] || 1
    let type = currentPage === 1 ? 'jump' : 'up'
    let targetPage = currentPage - 1
    if (type === 'jump') {
      targetPage = 1
    }
    if (this.pageArr.includes(targetPage)) type = 'jump'
    if (this.state.isLoadingMore || this.state.isRefreshing) return
    this.fetchMessages(URL.split('=').slice(0, -1).concat(targetPage).join('='), type)
  }

  _onEndReached = () => {
    const { URL } = this
    const currentPage = this.pageArr[this.pageArr.length - 1]
    const targetPage = currentPage + 1
    if (targetPage > this.state.numPages) return
    if (this.state.isLoadingMore || this.state.isRefreshing) return
    this.fetchMessages(URL.split('=').slice(0, -1).concat(targetPage).join('='), 'down')

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

  ITEM_HEIGHT = 83

  _renderItem = ({ item: rowData, index }) => {
    const { modeInfo, navigation } = this.props.screenProps
    const { ITEM_HEIGHT } = this
    return <UserGameItem {...{
      navigation,
      rowData,
      modeInfo,
      ITEM_HEIGHT
    }} />
  }

  sliderValue = 1
  render() {
    const { modeInfo } = this.props.screenProps
    const { URL } = this
    // console.log('Message.js rendered');
    const { width: SCREEN_WIDTH } = Dimensions.get('window')

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
          ListFooterComponent={() => <FooterProgress isLoadingMore={this.state.isLoadingMore} modeInfo={modeInfo}/>}
          data={this.state.list}
          keyExtractor={(item, index) => item.href}
          renderItem={this._renderItem}
          onEndReached={this._onEndReached}
          onEndReachedThreshold={0.5}
          extraData={modeInfo}
          windowSize={21}
          updateCellsBatchingPeriod={1}
          initialNumToRender={42}
          maxToRenderPerBatch={8}
          disableVirtualization={false}
          key={modeInfo.themeName}
          renderScrollComponent={props => <NestedScrollView {...props}/>}
          numColumns={modeInfo.numColumns}
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
        <View style={{
            position: 'absolute',
            right: 16,
            bottom: 16,
            width: 56,
            height: 56,
            borderRadius: 28,
            justifyContent: 'center',
            alignItems: 'center'
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
        {this.state.modalVisible && (
          <MyDialog modeInfo={modeInfo}
            modalVisible={this.state.modalVisible}
            onDismiss={() => { this.setState({ modalVisible: false }); this.isValueChanged = false }}
            onRequestClose={() => { this.setState({ modalVisible: false }); this.isValueChanged = false }}
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
              }} borderRadius={2}>
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
                                    const { pf, ob, dlc, text } = this.state
                                    this.URL = this.originURL + `?${text ? 'title=' + text + '&' : ''}&pf=${pf}&ob=${ob}&dlc=${dlc}&page=1`
                                    this.fetchMessages(this.URL, 'jump')
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
                <View style={{ alignSelf: 'stretch', justifyContent: 'center' }}>
                  <TouchableNativeFeedback
                    useForeground={true}
                    background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
                    onPress={this.goToSearch}>
                    <View pointerEvents='box-only' style={{ flex: 0, padding: 4, paddingHorizontal: 6,
                      margin: 4,
                      backgroundColor: modeInfo.standardColor,
                      borderRadius: 2,
                      alignSelf: 'stretch'
                    }}>
                      <Text style={{ color: modeInfo.backgroundColor, textAlign: 'center', textAlignVertical: 'center' }}>搜索</Text>
                    </View>
                  </TouchableNativeFeedback>
                  { this.state.text && <TouchableNativeFeedback
                    useForeground={true}
                    background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
                    onPress={() => this.search('')}>
                    <View pointerEvents='box-only' style={{ flex: 0, padding: 4, paddingHorizontal: 6,
                      margin: 4,
                      backgroundColor: modeInfo.standardColor,
                      borderRadius: 2,
                      alignSelf: 'stretch'
                    }}>
                      <Text style={{ color: modeInfo.backgroundColor, textAlign: 'center', textAlignVertical: 'center' }}>清空搜索</Text>
                    </View>
                  </TouchableNativeFeedback> || undefined}
                </View>
              </View>
            )} />
        )}
      </View>
    )
  }

  search = (text) => {
    this.setState({
      modalVisible: false,
      text
    }, () => {
      const { pf, ob, dlc, text } = this.state
      this.URL = this.originURL + `?${text ? 'title=' + text + '&' : ''}pf=${pf}&ob=${ob}&dlc=${dlc}&page=1`
      this.fetchMessages(this.URL, 'jump')
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
      text: '最新',
      value: 'date'
    }, {
      text: '进度最快',
      value: 'ratio'
    }, {
      text: '进度最慢',
      value: 'hole'
    }, {
      text: '完美难度',
      value: 'difficulty'
    }]
  },
  dlc: {
    text: 'DLC',
    value: [{
      text: '全部',
      value: 'all'
    }, {
      text: '有DLC',
      value: 'dlc'
    }, {
      text: '无DLC',
      value: 'nodlc'
    }]
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

export default UserGame
