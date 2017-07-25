import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableNativeFeedback
} from 'react-native'

import { getQAUrl } from '../dao'
import { FlatlistItemProp, FlatlistItemState, ModalList } from '../interface'

interface ExtendedProp extends FlatlistItemProp {
  modalList?: ModalList[]
  ITEM_HEIGHT: number
}

export default class extends React.PureComponent<ExtendedProp, FlatlistItemState> {
  constructor(props) {
    super(props)

    this.state = {
      modalVisible: false
    }
  }

  _onRowPressed = (rowData) => {
    const { navigation } = this.props
    const URL = getQAUrl(rowData.id)
    navigation.navigate('QaTopic', {
      URL,
      title: rowData.title,
      rowData,
      type: 'qa',
      shouldBeSawBackground: true
    })
  }

  render() {
    const { modeInfo, rowData, ITEM_HEIGHT, modalList = [] } = this.props
    const { numColumns = 1 } = modeInfo
    return (
      <TouchableNativeFeedback
        onPress={() => {
          this._onRowPressed(rowData)
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
          flex: numColumns === 1 ? -1 : 1,
          height: ITEM_HEIGHT - 7
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
                        <View style={{
                          height: 50, paddingVertical: 10, paddingLeft: 20 , alignSelf: 'stretch', alignContent: 'stretch', justifyContent: 'center'
                        }}>
                          <Text style={{textAlignVertical: 'center', fontSize: 18, color: modeInfo.standardTextColor}}>{item.text}</Text>
                        </View>
                      </TouchableNativeFeedback>
                    ))
                  }
                  </View>
                )} />
              )
            }
          <View style={{ marginLeft: 10, flex: 1, flexDirection: 'column', justifyContent: 'space-between' }}>
            <Text
              ellipsizeMode={'tail'}
              numberOfLines={2}
              style={{ flex: -1, color: modeInfo.titleTextColor }}>
              {rowData.title}
            </Text>

            <View style={{ flex: -1, flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text selectable={false} style={{
                fontSize: 12, flex: -1, color: modeInfo.standardColor, textAlign: 'center', textAlignVertical: 'center'
              }} onPress={
                () => {
                  this.props.navigation.navigate('Home', {
                    title: rowData.psnid,
                    id: rowData.psnid,
                    URL: `http://psnine.com/psnid/${rowData.psnid}`
                  })
                }
              }>{rowData.psnid}</Text>
              <Text style={{
                fontSize: 12, flex: -1, color: modeInfo.standardTextColor, textAlign: 'center', textAlignVertical: 'center'
              }}>{rowData.price}</Text>
              <Text style={{
                fontSize: 12, flex: -1, color: modeInfo.standardTextColor, textAlign: 'center', textAlignVertical: 'center'
              }}>{rowData.date}</Text>
              <Text style={{
                fontSize: 12, flex: -1, color: modeInfo.standardTextColor, textAlign: 'center', textAlignVertical: 'center'
              }}>{rowData.count}回复</Text>
            </View>

          </View>

        </View>
      </TouchableNativeFeedback>

    )
  }

}

const styles = StyleSheet.create({
  avatar: {
    width: 50,
    height: 50
  }
})
