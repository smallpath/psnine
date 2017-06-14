import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  Image,
  TouchableNativeFeedback,
  RefreshControl,
  InteractionManager,
  Picker
} from 'react-native';

import HTMLView from '../../components/HtmlToView';
import MyDialog from '../../components/Dialog';
import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { standardColor, nodeColor, idColor, accentColor } from '../../constants/colorConfig';

import { getQAUrl } from '../../dao';

import {
  getGamePointAPI,
  getTopicURL
} from '../../dao'

export default class extends React.PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      modalVisible: false
    }
  }

  shouldComponentUpdate = (props, state) => props.modeInfo.isNightMode !== this.props.modeInfo.isNightMode || this.state.modalVisible !== state.modalVisible

  _onRowPressed = (rowData) => {
    const { navigation } = this.props;
    const URL = getQAUrl(rowData.id);
    navigation.navigate('QaTopic', {
      URL,
      title: rowData.title,
      rowData,
      type: 'qa',
      shouldBeSawBackground: true
    });
  }

  render = () => {
    const { modeInfo, rowData, ITEM_HEIGHT, modalList = [] } = this.props

    return (
      <View style={{
        marginTop: 7,
        backgroundColor: modeInfo.backgroundColor,
        elevation: 1,
        height: ITEM_HEIGHT - 7
      }}>
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
          delayPressIn={0}
          background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
        >
          <View style={{ flex: 1, flexDirection: 'row', padding: 12 }}>
            <Image
              source={{ uri: rowData.avatar }}
              style={styles.avatar}
            />
            {
              this.state.modalVisible && modalList.length && (
                <MyDialog modeInfo={modeInfo}
                  modalVisible={this.state.modalVisible}
                  onDismiss={() => { this.setState({ modalVisible: false }); }}
                  onRequestClose={() => { this.setState({ modalVisible: false }); }}
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
                    }} borderRadius={2}>
                    {
                      modalList.map((item, index) => (
                        <TouchableNativeFeedback key={index + item.text} onPress={() => {
                            this.setState({
                              modalVisible: false
                            }, () => {
                              item.onPress(rowData)
                            })
                          }}>
                          <View style={{height: 50, paddingVertical: 10, paddingLeft: 20 ,alignSelf: 'stretch', alignContent: 'stretch', justifyContent: 'center'}}>
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
                style={{ flex: -1, color: modeInfo.titleTextColor, }}>
                {rowData.title}
              </Text>

              <View style={{ flex: -1, flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text selectable={false} style={{ flex: -1, color: idColor, textAlign: 'center', textAlignVertical: 'center' }} onPress={
                  () => {
                    this.props.navigation.navigate('Home', {
                      title: rowData.psnid,
                      id: rowData.psnid,
                      URL: `http://psnine.com/psnid/${rowData.psnid}`
                    })
                  }
                }>{rowData.psnid}</Text>
                <Text selectable={false} style={{ flex: -1, color: modeInfo.standardTextColor, textAlign: 'center', textAlignVertical: 'center' }}>{rowData.price}</Text>
                <Text selectable={false} style={{ flex: -1, color: modeInfo.standardTextColor, textAlign: 'center', textAlignVertical: 'center' }}>{rowData.date}</Text>
                <Text selectable={false} style={{ flex: -1, color: modeInfo.standardTextColor, textAlign: 'center', textAlignVertical: 'center' }}>{rowData.count}回复</Text>
              </View>

            </View>

          </View>
        </TouchableNativeFeedback>
      </View>
    )
  }

}


const styles = StyleSheet.create({
  avatar: {
    width: 50,
    height: 50,
  }
});
