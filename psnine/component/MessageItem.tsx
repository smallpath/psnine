import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableNativeFeedback
} from 'react-native'

import { standardColor, accentColor } from '../constant/colorConfig'

import { FlatlistItemProp, FlatlistItemState, ModalList } from '../interface'

interface ExtendedProp extends FlatlistItemProp {
  modalList?: ModalList[]
  isChecked: boolean
  onPress: any
}

declare var global

export default class ComplexComment extends React.PureComponent<ExtendedProp, FlatlistItemState> {
  constructor(props) {
    super(props)

    this.state = {
      modalVisible: false
    }
  }

  showDialog = () => {
    const { rowData, modalList = [] } = this.props
    const options = {
      items: modalList.map(item => item.text),
      itemsCallback: (id) => this.setState({
        modalVisible: false
      }, () => modalList[id].onPress(rowData))
    }
    const dialog = new global.DialogAndroid()
    dialog.set(options)
    dialog.show()
  }

  render() {
    const { modeInfo, rowData, onPress, modalList = [], isChecked = false } = this.props
    return (
      <View key={rowData.id} style={{
        marginVertical: 3.5,
        elevation: 1,
        backgroundColor: isChecked ? modeInfo.tintColor : modeInfo.backgroundColor
      }}>
        <TouchableNativeFeedback
          onPress={() => onPress(rowData)}
          onLongPress={modalList.length ? () => {
            if (global.isIOS) {
              this.setState({
                modalVisible: true
              })
            } else {
              this.showDialog()
            }
          } : undefined}
          useForeground={true}

          background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
        >
          <View style={{ flex: 1, flexDirection: 'row', padding: 12 }}>
            { rowData.avatar && <Image
              source={{ uri: rowData.avatar }}
              style={styles.avatar}
            /> || undefined }
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
                              height: 50,
                              paddingVertical: 10, paddingLeft: 20 , alignSelf: 'stretch', alignContent: 'stretch', justifyContent: 'center'
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
            <View style={{ marginLeft: 10, flex: 1, flexDirection: 'column' }}>
              <global.HTMLView
                value={rowData.content}
                modeInfo={modeInfo}
                stylesheet={styles}
                onImageLongPress={(url) => this.props.navigation.navigate('ImageViewer', {
                  images: [
                    { url }
                  ]
                })}
                imagePaddingOffset={30 + 50}
              />

              <View style={{ flex: 1.1, flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text selectable={false} style={{
                  flex: -1, color: modeInfo.standardColor, textAlign: 'center', textAlignVertical: 'center'
                }} onPress={
                  () => {
                    this.props.navigation.navigate('Home', {
                      title: rowData.psnid,
                      id: rowData.psnid,
                      URL: `https://psnine.com/psnid/${rowData.psnid}`
                    })
                  }
                }>{rowData.psnid}</Text>
                <Text selectable={false} style={{
                  flex: -1, color: modeInfo.standardTextColor, textAlign: 'center', textAlignVertical: 'center'
                }}>{rowData.date}</Text>
              </View>

            </View>

          </View>
        </TouchableNativeFeedback>
      </View>
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
  selectedTitle: {},
  avatar: {
    width: 50,
    height: 50
  },
  a: {
    fontWeight: '300',
    color: accentColor // make links coloured pink
  }
})