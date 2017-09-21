import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableNativeFeedback,
  InteractionManager,
  ActivityIndicator,
  Animated,
  FlatList,
  Button
} from 'react-native'

import Ionicons from 'react-native-vector-icons/Ionicons'
import colorConfig, {
  standardColor, idColor,
  getLevelColorFromProgress,
  getContentFromTrophy
} from '../../constant/colorConfig'

import {
  getGameAPI
} from '../../dao'

let toolbarActions = []

export default class GamePage extends Component<any, any> {

  constructor(props) {
    super(props)
    const { navigation } = this.props
    const { params } = navigation.state
    const { selections = [] } = params
    this.state = {
      data: false,
      isLoading: true,
      mainContent: false,
      rotation: new Animated.Value(1),
      scale: new Animated.Value(1),
      opacity: new Animated.Value(1),
      openVal: new Animated.Value(0),
      modalVisible: false,
      modalOpenVal: new Animated.Value(0),
      topicMarginTop: new Animated.Value(0),
      selections
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
      getGameAPI(params.URL).then(data => {

        this.hasPlayer = !!data.playerInfo.psnid
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
    return (
      <View key={rowData.id} style={{
        backgroundColor: modeInfo.backgroundColor
      }}>
        <TouchableNativeFeedback
          onPress={() => {

          }}
          useForeground={true}
          background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
        >
          <View pointerEvents='box-only' style={{ flex: 1, flexDirection: 'row', padding: 12 }}>
            <Image
              source={{ uri: rowData.avatar }}
              style={[styles.avatar, { width: 91 }]}
            />

            <View style={{ marginLeft: 10, flex: 1, flexDirection: 'column', alignContent: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <Text
                  ellipsizeMode={'tail'}
                  style={{ flex: -1, color: modeInfo.titleTextColor }}>
                  {rowData.title}
                </Text>
                <Text selectable={false} style={{
                  flex: -1,
                  marginLeft: 5,
                  color: idColor,
                  textAlign: 'center',
                  textAlignVertical: 'center'
                }}>{rowData.tip || rowData.platform && rowData.platform.join(' ')}</Text>
              </View>

              <View style={{ flex: 1.1, flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text selectable={false} style={{
                  flex: -1,
                  color: modeInfo.standardTextColor,
                  textAlign: 'center',
                  textAlignVertical: 'center',
                  fontSize: 10
                }}>{getContentFromTrophy(rowData.trophyArr.join('')).map((item, index) => {
                  return (
                    <Text key={index} style={{color: colorConfig['trophyColor' + (index + 1)]}}>
                      {item}
                    </Text>
                  )
                })}</Text>
                <Text selectable={false} style={{
                  flex: -1,
                  color: getLevelColorFromProgress(rowData.rare),
                  textAlign: 'center',
                  textAlignVertical: 'center',
                  fontSize: 10
                }}>{rowData.alert}</Text>
                <Text selectable={false} style={{
                  flex: -1,
                  color: modeInfo.standardTextColor,
                  textAlign: 'center',
                  textAlignVertical: 'center',
                  fontSize: 10
                }}>{rowData.rare}</Text>
              </View>

            </View>

          </View>
        </TouchableNativeFeedback>
      </View>
    )
  }
  hasPlayer = false
  renderPlayer = (rowData) => {
    const { modeInfo } = this.props.screenProps
    return (
      <View pointerEvents='box-only' style={{
        flex: 1,
        flexDirection: 'row',
        padding: 12,
        backgroundColor: modeInfo.backgroundColor
        }}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: modeInfo.titleTextColor, textAlign: 'center'  }}>{rowData.psnid}</Text>
          <Text style={{ color: modeInfo.standardTextColor, textAlign: 'center' }}>{rowData.total}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: modeInfo.titleTextColor, textAlign: 'center' }}>{rowData.first}</Text>
          <Text style={{ color: modeInfo.standardTextColor, textAlign: 'center', fontSize: 12 }}>首个杯</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={{ color: modeInfo.titleTextColor, textAlign: 'center' }}>{rowData.last}</Text>
          <Text style={{ color: modeInfo.standardTextColor, textAlign: 'center', fontSize: 12 }}>最后杯</Text>
        </View>
        { rowData.time && (<View style={{ flex: 1 }}>
          <Text style={{ color: modeInfo.titleTextColor, textAlign: 'center' }}>{rowData.time}</Text>
          <Text style={{ color: modeInfo.standardTextColor, textAlign: 'center', fontSize: 12 }}>总耗时</Text>
        </View>)}
      </View>
    )
  }

  renderToolbar = (list) => {
    const { modeInfo } = this.props.screenProps
    let screen = Dimensions.get('window')
    const { width: SCREEN_WIDTH } = screen
    return (
      <View style={{
        flex: 0,
        flexDirection: 'row',
        alignItems: 'center',
        flexWrap: 'wrap',
        backgroundColor: modeInfo.backgroundColor
      }}>
        {list.map((item, index) => /*['讨论', '评论'].includes(item.text) && */(
          <TouchableNativeFeedback key={index} onPress={() => {
              if (item.text === '主题') {
                this.props.navigation.navigate('GameTopic', {
                  URL: `${item.url}?page=1`
                })
              } else if (item.text === '评论') {
                this.props.navigation.navigate('GamePoint', {
                  URL: `${item.url}`,
                  rowData: {
                    id: (item.url.match(/\/psngame\/(\d+)\/comment/) || [0, -1])[1]
                  }
                })
              } else if (item.text === '问答') {
                this.props.navigation.navigate('GameQa', {
                  URL: `${item.url}?page=1`
                })
              } else if (item.text === '约战') {
                this.props.navigation.navigate('GameBattle', {
                  URL: `${item.url}?page=1`
                })
              } else if (item.text === '游列') {
                this.props.navigation.navigate('GameList', {
                  URL: `${item.url}?page=1`
                })
              } else if (item.text === '排行') {
                this.props.navigation.navigate('GameRank', {
                  URL: `${item.url}?page=1`
                })
              }
            }}>
            <View pointerEvents={'box-only'} style={{
              flex: 1, alignItems: 'center', justifyContent: 'center', height: 55, width: SCREEN_WIDTH / (list.length) }}  key={index}>
              <Text style={{ color: idColor, textAlign: 'left', fontSize: 12 }}>{item.text}</Text>
            </View>
          </TouchableNativeFeedback>
        ) || undefined )}
      </View>
    )
  }

  hasContent = false
  renderGameHeader = (rowData, index) => {
    const { modeInfo } = this.props.screenProps
    return (
      <View key={rowData.id || index}  style={{
        backgroundColor: modeInfo.backgroundColor,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: modeInfo.brighterLevelOne,
        padding: 2
      }}>
        <TouchableNativeFeedback
          onPress={() => {

          }}
          useForeground={true}
          background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
        >
          <View pointerEvents='box-only' style={{ flex: 1, flexDirection: 'row', padding: 12 }}>
            <Image
              source={{ uri: rowData.avatar }}
              style={[styles.avatar, { width: 91 }]}
            />

            <View style={{ marginLeft: 10, flex: 1, flexDirection: 'column', alignContent: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <Text
                  ellipsizeMode={'tail'}
                  style={{ flex: -1, color: modeInfo.titleTextColor }}>
                  {rowData.title}
                </Text>
              </View>

              <View style={{ flex: 1.1, flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text selectable={false} style={{
                  flex: -1,
                  color: modeInfo.standardTextColor,
                  textAlign: 'center',
                  textAlignVertical: 'center',
                  fontSize: 10
                }}>{getContentFromTrophy(rowData.trophyArr.join('')).map((item, index) => {
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
      </View>
    )
  }

  renderTrophy = (rowData, index) => {
    const { modeInfo } = this.props.screenProps
    const { selections } = this.state
    // console.log(this.props.navigation)
    const { callbackAfterAll } = this.props.navigation.state.params
    const isChecked = selections.includes(rowData.indexID)
    return (
      <TouchableNativeFeedback key={rowData.id || index} onPress={
        () => {
          if (callbackAfterAll) {
            const target = this.state.selections.includes(rowData.indexID) ?
              this.state.selections.filter(item => item !== rowData.indexID) :
              this.state.selections.slice().concat(rowData.indexID)
            this.setState({
              selections: target
            })
          } else {
            this.props.navigation.navigate('Trophy', {
              URL: rowData.href,
              title: rowData.title,
              rowData,
              type: 'trophy'
            })
          }
        }
      }>
        <View key={rowData.id || index} pointerEvents={'box-only'} style={{
          backgroundColor: isChecked ? modeInfo.tintColor : modeInfo.backgroundColor,
          flexDirection: 'row',
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: modeInfo.brighterLevelOne,
          padding: 0
        }}>
          <View pointerEvents='box-only' style={{ flex: -1, flexDirection: 'row', padding: 12, backgroundColor: rowData.backgroundColor }}>
            <Image
              source={{ uri: rowData.avatar }}
              style={[styles.avatar, { width: 54, height: 54 }]}
            />
          </View>
          <View style={{ justifyContent: 'space-around', flex: 3, padding: 4 }}>
            <Text
              ellipsizeMode={'tail'}
              style={{ flex: -1, color: modeInfo.titleTextColor }}>
              {rowData.title}
              { rowData.translate && <Text style={{ color: modeInfo.standardTextColor, marginLeft: 2  }}>{' ' + rowData.translate}</Text> }
              { rowData.tip && <Text style={{ color: modeInfo.standardColor , fontSize: 12, marginLeft: 2 }}>{' ' + rowData.tip}</Text> }
            </Text>
            <Text
              ellipsizeMode={'tail'}
              style={{ flex: -1, color: modeInfo.titleTextColor }}>
              {rowData.translateText || rowData.text}
            </Text>
          </View>
          { rowData.time && (
              <View style={{ flex: 1, justifyContent: 'center', padding: 2 }}>
                <Text selectable={false} style={{
                  flex: -1,
                  color: modeInfo.okColor,
                  textAlign: 'center',
                  textAlignVertical: 'center',
                  fontSize: 10
                }}>{rowData.time}</Text>
              </View>
            )
          }
          <View style={{ flex: 0.8, justifyContent: 'center', padding: 2 }}>
            <Text selectable={false}
              style={{
                flex: -1,
                textAlign: 'center',
                textAlignVertical: 'center',
                color: modeInfo.titleTextColor }}>{rowData.rare}</Text>
            <Text
              ellipsizeMode={'tail'}
              style={{
                flex: -1,
                color: modeInfo.standardTextColor,
                textAlign: 'center',
                textAlignVertical: 'center',
                fontSize: 10
              }}>{rowData.rare ? '珍惜度' : ''}</Text>
          </View>
        </View>
      </TouchableNativeFeedback>
    )
  }

  renderOneProfile = (rowData, index) => {
    const { modeInfo } = this.props.screenProps
    return (
      <View key={index} style={{ backgroundColor: modeInfo.backgroundColor }}>
        { index !== 0 && <Text style={{
          textAlign: 'left', color: modeInfo.standardTextColor, padding: 5, paddingLeft: 10, paddingBottom: 0, fontSize: 15}}>第{index}个DLC</Text>}
        <View>
          { index !== 0 && this.renderGameHeader(rowData.banner, index) }
          { rowData.list.map((item , index) => this.renderTrophy(item , index)) }
        </View>
      </View>
    )
  }

  renderAllProfiles = (rowData, index) => {
    return (
      <View key={index}>
        {
          rowData.map((item , index) => this.renderOneProfile(item, index))
        }
      </View>
    )
  }

  renderLinkHeader = (url) => {
    const { modeInfo } = this.props.screenProps
    const { navigation } = this.props
    const onPress = () => navigation.navigate('NewGame', {
      URL: url
    })
    return (
    <View style={{margin: 5, backgroundColor: modeInfo.backgroundColor}}>
      <Button onPress={onPress} title='关联游戏' color={modeInfo.accentColor}/>
    </View>
    )
  }

  render() {
    const { params } = this.props.navigation.state
    // console.log('GamePage.js rendered');
    const { modeInfo } = this.props.screenProps
    const { data: source } = this.state
    const data: any[] = []
    const renderFuncArr: any[] = []
    const shouldPushData = !this.state.isLoading
    if (shouldPushData) {
      data.push(source.gameInfo)
      renderFuncArr.push(this.renderHeader)
      if (source.gameInfo.linkGame) {
        data.push(`${source.gameInfo.linkGame}?page=1`)
        renderFuncArr.push(this.renderLinkHeader)
      }
    }
    if (shouldPushData && this.hasPlayer) {
      data.push(source.playerInfo)
      renderFuncArr.push(this.renderPlayer)
    }
    if (shouldPushData) {
      data.push(source.toolbarInfo)
      renderFuncArr.push(this.renderToolbar)
      data.push(source.trophyArr)
      renderFuncArr.push(this.renderAllProfiles)
    }
    const title = params.rowData.id ? `No.${params.rowData.id}` : (params.title || params.rowData.title)
    const targetToolbar: any = toolbarActions.slice()
    const { navigation } = this.props
    if (params.callbackAfterAll) {
      targetToolbar.push({ title: '确定', iconName: 'md-done-all', show: 'always', onPress: () => {
        const { params } = navigation.state
        params.callbackAfterAll && params.callbackAfterAll(this.state.selections)
        navigation.goBack()
      } })
    }

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
          title={title}
          titleColor={modeInfo.isNightMode ? '#000' : '#fff'}
          style={[styles.toolbar, { backgroundColor: modeInfo.standardColor }]}
          actions={targetToolbar}
          onIconClicked={() => {
            this.props.navigation.goBack()
          }}
          onActionSelected={(index) => targetToolbar[index].onPress()}
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
        {!this.state.isLoading && <FlatList style={{
          flex: -1,
          backgroundColor: modeInfo.backgroundColor
        }}
          ref={flatlist => this.flatlist = flatlist}
          data={data}
          keyExtractor={(item, index) => item.id || index}
          renderItem={({ item, index }) => {
            return renderFuncArr[index](item)
          }}
          extraData={this.state}
          windowSize={999}
          disableVirtualization={true}
          viewabilityConfig={{
            minimumViewTime: 3000,
            viewAreaCoveragePercentThreshold: 100,
            waitForInteraction: true
          }}
        >
        </FlatList>
        }
      </View>
    )
  }

  isValueChanged = false
  flatlist: any = false
  refreshControl: any = false
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
