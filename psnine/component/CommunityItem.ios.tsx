import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableNativeFeedback,
  Platform
} from 'react-native'
import {
  NavigationDispatch
} from 'react-navigation'

import { standardColor, idColor } from '../constant/colorConfig'
import { changeCommunityType } from '../redux/action/app'

import {
  getTopicURL
} from '../dao'

import { FlatlistItemProp, FlatlistItemState, ModalList } from '../interface'

interface ExtendedProp extends FlatlistItemProp {
  modalList?: ModalList[]
  ITEM_HEIGHT: number
  toolbarDispatch?: NavigationDispatch<any>
}

const isIOS = Platform.OS === 'ios'

export default class ComplexComment extends React.PureComponent<ExtendedProp, FlatlistItemState> {

  constructor(props) {
    super(props)

    this.state = {
      modalVisible: false
    }
  }

  _onRowPressed = (rowData) => {
    const { navigation } = this.props
    const id = rowData.id || parseInt(rowData.url.split('/').pop(), 10)
    const URL = getTopicURL(id)
    navigation.navigate('CommunityTopic', {
      URL,
      title: rowData.title,
      rowData,
      type: 'community',
      shouldBeSawBackground: true
    })
  }

  render() {
    const { modeInfo, rowData, onPress, navigation, modalList = [], toolbarDispatch } = this.props
    // console.log(modalList)
    const { numColumns = 1 } = modeInfo
    const fuckingIOS: any = { marginLeft: 10, flex: 1, flexWrap: 'wrap', flexDirection: 'column', justifyContent: 'space-between'  }
    if (isIOS) {
      // set the width to 0 to avoid text not wrap on the fucking ios
      fuckingIOS.width = 0
    }
    return (
      <TouchableNativeFeedback
        onPress={() => {
          if (onPress) {
            onPress(rowData)
          } else {
            this._onRowPressed(rowData)
          }
        }}
        onLongPress={() => {
          modalList.length && this.setState({
            modalVisible: true
          })
        }}
        useForeground={true}
        background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
      >
      <View style={{
        flexDirection: 'row', padding: 12,
        marginVertical: 3.5,
        marginHorizontal: numColumns === 1 ? 0 : 3.5,
        backgroundColor: modeInfo.backgroundColor,
        elevation: 1,
        flex: numColumns === 1 ? -1 : 1
      }}>
          <Image
            source={{ uri: rowData.avatar }}
            style={styles.avatar}
          />
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
                  opacity: 1,
                  borderRadius: 2
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
                      <View style={{height: 50, paddingVertical: 10,
                        paddingLeft: 20 , alignSelf: 'stretch', alignContent: 'stretch', justifyContent: 'center'}}>
                        <Text style={{textAlignVertical: 'center', fontSize: 18, color: modeInfo.standardTextColor}}>{item.text}</Text>
                      </View>
                    </TouchableNativeFeedback>
                  ))
                }
                </View>
              )} />
            )
          }
          <View style={fuckingIOS}>
            <Text
              ellipsizeMode={'tail'}
              numberOfLines={2}
              style={{ flex: -1, color: modeInfo.titleTextColor }}>
              {rowData.title}
            </Text>

            <View style={{ flex: -1, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text selectable={false} numberOfLines={1} style={{
                  fontSize: 12, flex: -1, color: modeInfo.standardColor, textAlign: 'center', textAlignVertical: 'center' }} onPress={() => {
                  // this.flatlist.getNode().recordInteraction()
                  navigation.navigate('Home', {
                    title: rowData.psnid,
                    id: rowData.psnid,
                    URL: `https://psnine.com/psnid/${rowData.psnid}`
                  })
                }}>{rowData.psnid}</Text>
              <Text selectable={false} numberOfLines={1}
                style={{
                  fontSize: 12, flex: -1,
                  color: modeInfo.standardTextColor, textAlign: 'center', textAlignVertical: 'center' }}>{rowData.date}</Text>
              <Text selectable={false} numberOfLines={1}
                style={{
                  fontSize: 12, flex: -1,
                  color: modeInfo.standardTextColor, textAlign: 'center', textAlignVertical: 'center' }}>{rowData.count}回复</Text>
              <Text selectable={false} numberOfLines={1}
                style={{ fontSize: 12, flex: -1,
                color: (rowData.type && toolbarDispatch) ? modeInfo.standardColor : modeInfo.standardTextColor,
                textAlign: 'center', textAlignVertical: 'center'
                }} onPress={
                rowData.type && toolbarDispatch ? () => {
                  toolbarDispatch(changeCommunityType(rowData.type))
                } : undefined
              }>{rowData.type}</Text>
            </View>

          </View>

        </View>
      </TouchableNativeFeedback>
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