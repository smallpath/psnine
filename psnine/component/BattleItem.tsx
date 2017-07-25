import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableNativeFeedback
} from 'react-native'

import { getBattleURL } from '../dao'

import { FlatlistItemProp, FlatlistItemState, ModalList } from '../interface'

interface ExtendedProp extends FlatlistItemProp {
  modalList?: ModalList[]
}

export default class BattleItem extends React.PureComponent<ExtendedProp, FlatlistItemState> {
  constructor(props) {
    super(props)

    this.state = {
      modalVisible: false
    }
  }

  _onRowPressed = (rowData) => {
    const { navigation } = this.props
    const URL = getBattleURL(rowData.id)
    navigation.navigate('BattleTopic', {
      URL,
      title: rowData.title,
      rowData,
      type: 'battle'
      // shouldBeSawBackground: true
    })
  }

  render() {
    // console.log(rowData)
    const { modeInfo, rowData, modalList = [] } = this.props

    return (
      <View style={{
        marginLeft: 7,
        marginRight: 7,
        backgroundColor: modeInfo.backgroundColor,
        elevation: 2
      }}>
        <TouchableNativeFeedback
          onPress={() => { this._onRowPressed(rowData) }}
          onLongPress={() => {
             modalList.length && this.setState({
              modalVisible: true
            })
          }}
          background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
        >
          <View style={{ flex: -1, flexDirection: 'row', padding: 12 }}>
            <View style={{
              flex: 1,
              flexDirection: 'column',
              marginLeft: -2,
              alignSelf: 'center'
            }}>
              <Image
                source={{ uri: rowData.avatar }}
                style={{
                  width: 91,
                  height: 50,
                  alignSelf: 'center'
                }}
              />
              <Text style={{ flex: -1, color: modeInfo.standardColor, textAlign: 'center', textAlignVertical: 'center' }}>{rowData.game}</Text>
            </View>
            {
              this.state.modalVisible && modalList.length && (
              <global.MyDialog modeInfo={modeInfo}
                modalVisible={this.state.modalVisible}
                onDismiss={() => { this.setState({ modalVisible: false }) }}
                onRequestClose={() => { this.setState({ modalVisible: false }) }}
                renderContent={() => (
                  <View style={{
                    justifyContent: 'center',
                    alignItems: 'flex-start',
                    backgroundColor: modeInfo.backgroundColor,
                    position: 'absolute',
                    left: 30,
                    right: 30,
                    paddingVertical: 15,
                    elevation: 4,
                    opacity: 1
                  }}>
                  {
                    modalList.map((item, index) => (
                      <TouchableNativeFeedback key={index + item.text} onPress={() => {
                          this.setState({
                            modalVisible: false
                          }, () => {
                            item.onPress(rowData)
                          })
                        }}>
                        <View style={{height: 50,
                          paddingVertical: 10, paddingLeft: 20 , alignSelf: 'stretch', alignContent: 'stretch', justifyContent: 'center'}}>
                          <Text style={{textAlignVertical: 'center', fontSize: 18, color: modeInfo.standardTextColor}}>{item.text}</Text>
                        </View>
                      </TouchableNativeFeedback>
                    ))
                  }
                  </View>
                )} />
              )
            }
            <View style={{ marginLeft: 10, flex: 2, flexDirection: 'column' }}>
              <Text
                ellipsizeMode={'tail'}
                numberOfLines={1}
                style={{ flex: -1, color: modeInfo.titleTextColor, fontSize: 15 }}>
                {rowData.title}
              </Text>
              <Text>
                <Text style={{ flex: -1, color: modeInfo.titleTextColor }} numberOfLines={1}>{rowData.date}</Text>
                <Text style={{ flex: -1, color: modeInfo.standardTextColor }} numberOfLines={1}> 开始</Text>
              </Text>
              <Text>
                <Text style={{ flex: -1, color: modeInfo.titleTextColor }} numberOfLines={1}>{rowData.num}</Text>
                <Text style={{ flex: -1, color: modeInfo.standardTextColor }} numberOfLines={1}> 人招募</Text>
              </Text>
              <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ flex: -1, color: modeInfo.standardTextColor,
                  textAlign: 'center', textAlignVertical: 'center' }}>{rowData.platform.join(' ')}</Text>
                <Text style={{ flex: -1, color: modeInfo.standardColor, marginRight: -60, textAlignVertical: 'center' }} onPress={
                () => {
                  this.props.navigation.navigate('Home', {
                    title: rowData.psnid,
                    id: rowData.psnid,
                    URL: `http://psnine.com/psnid/${rowData.psnid}`
                  })
                }
              }>{rowData.psnid}</Text>
              </View>
            </View>
            <Image
              source={{ uri: rowData.gameAvatar }}
              style={[styles.avatar, { marginLeft: 10 }]}
            />
          </View>
        </TouchableNativeFeedback>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  avatar: {
    width: 50,
    height: 50
  }
})
