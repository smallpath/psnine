import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableNativeFeedback
} from 'react-native'

import { FlatlistItemProp, FlatlistItemState } from '../interface'

interface ExtendedProp extends FlatlistItemProp {
  isChecked?: boolean
  onLongPress?: (...args) => any
  width?: number
  ITEM_HEIGHT?: number
}

declare var global

export default class PhotoItem extends React.PureComponent<ExtendedProp, FlatlistItemState> {

  constructor(props) {
    super(props)

    this.state = {
      modalVisible: false
    }

    this.initModal()
  }

  modalItems: any
  initModal = () => {
    const { rowData, onLongPress } = this.props
    const modalItems = [{
      text: '查看图片',
      onPress: () => {
        requestAnimationFrame(() => {
          this.props.navigation.navigate('ImageViewer', {
            images: [
              { url: rowData.img }
            ]
          })
        })
      }
    }]

    if (onLongPress) {
      modalItems.push({
        text: '删除图片',
        onPress: () => {
          onLongPress()
        }
      })
    }

    this.modalItems = modalItems
  }

  showDialog = () => {
    const options = {
      items: this.modalItems.map(item => item.text),
      itemsCallback: (id) => this.setState({
        modalVisible: false
      }, () => this.modalItems[id].onPress())
    }
    const dialog = new global.DialogAndroid()
    dialog.set(options)
    dialog.show()
  }

  render() {
    const { modeInfo, rowData, onLongPress,
      isChecked = false, onPress, width = 150, ITEM_HEIGHT } = this.props

    return (
      <TouchableNativeFeedback
        onPress={
          () => {
            onPress && onPress()
          }
        }
        onLongPress={!onLongPress ? undefined : () => {
          global.isIOS ? this.setState({
            modalVisible: true
          }) : this.showDialog()
        }}
        useForeground={true}

        background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
      >
        <View style={{
          flex: -1, flexDirection: 'row', padding: 5,
          backgroundColor: isChecked ? modeInfo.accentColor : modeInfo.backgroundColor,
          alignSelf: 'flex-start',
          alignContent: 'flex-end',
          width: ITEM_HEIGHT
        }}>
          {
            this.state.modalVisible && (
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
                    <TouchableNativeFeedback onPress={() => {
                        this.setState({
                          modalVisible: false
                        }, () => {

                        })
                      }}>
                      <View style={{
                        height: 50, paddingVertical: 10, paddingLeft: 20 , alignSelf: 'stretch', alignContent: 'stretch', justifyContent: 'center'
                      }}>
                        <Text style={{textAlignVertical: 'center', fontSize: 18, color: modeInfo.standardTextColor}}>查看图片</Text>
                      </View>
                    </TouchableNativeFeedback>
                    { onLongPress && <TouchableNativeFeedback onPress={() => {
                        this.setState({
                          modalVisible: false
                        }, () => {
                          onLongPress && onLongPress()
                        })
                      }}>
                      <View style={{
                        height: 50, paddingVertical: 10, paddingLeft: 20 , alignSelf: 'stretch', alignContent: 'stretch', justifyContent: 'center'
                      }}>
                        <Text style={{textAlignVertical: 'center', fontSize: 18, color: modeInfo.standardTextColor}}>删除图片</Text>
                      </View>
                    </TouchableNativeFeedback>}
                  </View>
                )} />
            )
          }
          <Image
            source={{ uri: rowData.img || rowData.href }}
            style={[styles.avatar, { width: width, height: width }]}
          />
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
