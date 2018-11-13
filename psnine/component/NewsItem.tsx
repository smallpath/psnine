import React from 'react'
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableNativeFeedback
} from 'react-native'

import { standardColor, idColor } from '../constant/colorConfig'

import {
  getTopicURL,
  getGeneURL
} from '../dao'

import { FlatlistItemProp, FlatlistItemState } from '../interface'

export default class NewsItem extends React.PureComponent<FlatlistItemProp, FlatlistItemState> {

  constructor(props) {
    super(props)

    this.state = {
      modalVisible: false
    }
  }

  _onRowPressed = (rowData) => {
    const { navigation } = this.props
    const id = rowData.id || parseInt(rowData.url.split('/').pop(), 10)
    if (rowData.newsType === 'gene') {
      const URL = getGeneURL(id)
      return navigation.navigate('CommunityTopic', {
        URL,
        title: rowData.title,
        rowData,
        type: 'gene'
      })
    }
    const URL = getTopicURL(id)
    navigation.navigate('CommunityTopic', {
      URL,
      title: rowData.title,
      rowData,
      type: 'community'
    })
  }

  render() {
    const { modeInfo, rowData, navigation } = this.props
    // console.log(modalList)
    const { numColumns = 1 } = modeInfo
    const imageItems = rowData.thumbs.map((value, index) => (<Image key={rowData.id + '' + index} source={{ uri: value }} style={styles.image} />))
    return (
      <View style={{
        marginVertical: 3.5,
        marginHorizontal: numColumns === 1 ? 0 : 3.5,
        backgroundColor: modeInfo.backgroundColor,
        elevation: 1,
        flex: numColumns === 1 ? -1 : 1
      }}>
        <TouchableNativeFeedback
          onPress={() => {
            this._onRowPressed(rowData)
          }}
          useForeground={true}

          background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
        >
          <View style={{ flex: 1, flexDirection: 'row', padding: 12 }}>
            <Image
              source={{ uri: rowData.avatar }}
              style={styles.avatar}
            />
            <View style={{ marginLeft: 10, flex: 1, flexDirection: 'column', justifyContent: 'space-between'  }}>
              <Text
                ellipsizeMode={'tail'}
                numberOfLines={2}
                style={{ flex: -1, color: modeInfo.titleTextColor }}>
                {rowData.title}
              </Text>
              <View style={{ flex: -1, flexDirection: 'row', flexWrap: 'wrap', marginTop: 5, marginBottom: 5 }}>
                {imageItems}
              </View>
              <View style={{ flex: -1, flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text selectable={false} style={{
                  fontSize: 12, flex: -1, color: modeInfo.standardColor, textAlign: 'center', textAlignVertical: 'center'
                }} onPress={() => {
                    // this.flatlist.getNode().recordInteraction()
                    navigation.navigate('Home', {
                      title: rowData.psnid,
                      id: rowData.psnid,
                      URL: `https://psnine.com/psnid/${rowData.psnid}`
                    })
                  }}>{rowData.psnid}</Text>
                <Text selectable={false} style={{
                  fontSize: 12, flex: -1, color: modeInfo.standardTextColor, textAlign: 'center', textAlignVertical: 'center'
                }}>{rowData.date}</Text>
                <Text selectable={false} style={{
                  fontSize: 12, flex: -1, color: modeInfo.standardTextColor, textAlign: 'center', textAlignVertical: 'center'
                }}>{rowData.count}</Text>
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
  image: {
    width: 68,
    height: 68,
    margin: StyleSheet.hairlineWidth
  },
  a: {
    fontWeight: '300',
    color: idColor // make links coloured pink
  }
})