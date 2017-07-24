import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableNativeFeedback
} from 'react-native'

import { FlatlistItemProp, FlatlistItemState, ModalList } from '../interface'

interface ExtendedProp extends FlatlistItemProp {
  modalList?: ModalList[]
  content: string
  onLongPress: (...args) => any
  preFetch: (...args) => any
  index: number
}

declare var global

export default class extends React.PureComponent<ExtendedProp, FlatlistItemState> {
  constructor(props) {
    super(props)

    this.state = {
      modalVisible: false
    }
  }

  shouldComponentUpdate(props, state) {
    return props.modeInfo.themeName !== this.props.modeInfo.themeName || this.state.modalVisible !== state.modalVisible
  }

  handleImageOnclick = () => {}

  render() {
    const { modeInfo, rowData, content, modalList = [], navigation } = this.props

    return (
      <TouchableNativeFeedback key={rowData.id}   onPress={() => {
          fetch(rowData.href).then(res => {
            if (res.url && typeof res.url === 'string') {
              navigation.navigate('CommunityTopic', {
                URL: res.url,
                title: rowData.psnid,
                rowData: {
                  id: res.url.split('/').pop()
                },
                type: res.url.includes('gene') ? 'gene' : 'community' // todo
              })
            }
          }).catch(err => global.toast(err.toString()))
        }} onLongPress={() => {
            modalList.length && this.setState({
            modalVisible: true
          })
        }}>
        <View pointerEvents={'box-only'} style={{
          backgroundColor: modeInfo.backgroundColor,
          flexDirection: 'column',
          borderBottomWidth: StyleSheet.hairlineWidth,
          borderBottomColor: modeInfo.brighterLevelOne,
          padding: 10
        }}>
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
          <View style={{ flex: -1, flexDirection: 'row', padding: 5 }}>
            <global.HTMLView
              value={content}
              modeInfo={Object.assign({}, modeInfo, {
                standardTextColor: modeInfo.titleTextColor
              })}
              stylesheet={styles}
              onImageLongPress={this.handleImageOnclick}
              imagePaddingOffset={30 + 10}
              shouldForceInline={true}
            />
          </View>
          <View style={{
            flex: 1,
            justifyContent: 'space-around',
            flexDirection: 'row',
            alignItems: 'flex-start',
            padding: 2,
            paddingLeft: 12
          }}>
            <Text
              style={{
                flex: 2,
                textAlign: 'left',
                textAlignVertical: 'center',
                color: modeInfo.standardTextColor }}>{rowData.psnid}</Text>
            <Text
              style={{
                flex: 1,
                textAlign: 'left',
                textAlignVertical: 'center',
                color: modeInfo.standardTextColor }}>{rowData.date}</Text>
            <Text
              style={{
                flex: 1,
                textAlign: 'left',
                textAlignVertical: 'center',
                color: modeInfo.standardTextColor }}>{rowData.count}</Text>
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
