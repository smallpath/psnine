import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableNativeFeedback
} from 'react-native'

import colorConfig, {
  levelColor
} from '../constant/colorConfig'

import { getHomeURL } from '../dao'

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

  shouldComponentUpdate(props, state) {
    return props.modeInfo.themeName !== this.props.modeInfo.themeName || this.state.modalVisible !== state.modalVisible
  }

  _onRowPressed = (rowData) => {
    const { navigation } = this.props
    const URL = getHomeURL(rowData.psnid)
    navigation.navigate('Home', {
      // URL: 'http://psnine.com/psngame/5424?psnid=Smallpath',
      URL,
      title: rowData.psnid,
      rowData
    })
  }

  handleImageOnclick = () => {}

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
        <View pointerEvents={'box-only'} style={{
          flexDirection: 'row',
          flexWrap: 'nowrap', padding: 8, justifyContent: 'space-around', alignItems: 'center',
          marginVertical: 3.5,
          marginHorizontal: numColumns === 1 ? 0 : 3.5,
          backgroundColor: modeInfo.backgroundColor,
          elevation: 1,
          flex: numColumns === 1 ? -1 : 1,
          height: ITEM_HEIGHT - 7
        }}>
          <Image
            source={{ uri: rowData.avatar }}
            style={[styles.avatar, { width: 50 }]}
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
          <View style={{ flex: 3, padding: 5}}>
            <Text style={{color: modeInfo.accentColor}}>{rowData.psnid}</Text>
            <global.HTMLView
              value={rowData.content}
              modeInfo={modeInfo}
              stylesheet={styles}
              onImageLongPress={this.handleImageOnclick}
              imagePaddingOffset={30 + 10}
              shouldForceInline={true}
            />
          </View>
          { rowData.type === 'general' ? this.renderGeneral(rowData) : this.renderOther(rowData) }
        </View>
      </TouchableNativeFeedback>
    )
  }

  renderGeneral = (rowData) => {

    const { modeInfo, ITEM_HEIGHT } = this.props
    return (
      <View style={{flex: 4, flexDirection: 'row', height: ITEM_HEIGHT - 7 - 7 }}>
        <View style={{flex: 2, flexDirection: 'column'}}>
          { rowData.rank && <View style={{ flex: 1, flexDirection: 'column' }}>
            <Text style={{color: modeInfo.titleTextColor}}>{rowData.rank ? 'No.' + rowData.rank : ''}</Text>
          </View> || undefined}
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <Text style={{color: levelColor}}>{rowData.level + ' '}<Text style={{color: modeInfo.standardTextColor}}>{rowData.exp}</Text></Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <Text style={{color: modeInfo.standardTextColor}}>{rowData.games}</Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <Text style={{color: modeInfo.standardTextColor}}>{rowData.perfectRate}</Text>
          </View>
        </View>
        <View style={{flex: 2, flexDirection: 'column', paddingLeft: 4}}>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <Text style={{color: colorConfig.trophyColor1}}>{rowData.platinum}</Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <Text style={{color: colorConfig.trophyColor2}}>{rowData.gold}</Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <Text style={{color: colorConfig.trophyColor3}}>{rowData.silver}</Text>
          </View>
          <View style={{ flex: 1, flexDirection: 'column' }}>
            <Text style={{color: colorConfig.trophyColor4}}>{rowData.bronze}</Text>
          </View>
        </View>
      </View>
    )
  }

  renderOther = (rowData) => {
    const { modeInfo } = this.props

    return (
      <View style={{flex: 4, flexDirection: 'row'}}>
        <View style={{ flex: 1, flexDirection: 'column' }}>
          <global.HTMLView
            value={rowData.level}
            modeInfo={modeInfo}
            stylesheet={styles}
            onImageLongPress={this.handleImageOnclick}
            imagePaddingOffset={30 + 0 + 10}
            shouldForceInline={true}
          />
          <Text style={{color: modeInfo.standardTextColor}}>{rowData.exp}</Text>
        </View>
        { rowData.games && <View style={{ flex: 1, flexDirection: 'column' }}>
          <Text style={{color: modeInfo.standardTextColor}}>{rowData.games}</Text>
        </View> || undefined}
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
