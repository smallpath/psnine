import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Image,
  Dimensions,
  TouchableNativeFeedback,
  InteractionManager,
  ActivityIndicator,
  StatusBar,
  Animated,
  Easing,
  FlatList,
  PanResponder,
  Modal,
  Keyboard
} from 'react-native';

import HTMLView from '../../components/HtmlToView';
import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { standardColor, nodeColor, idColor, accentColor } from '../../constants/colorConfig';
import MyDialog from '../../components/Dialog'

import { getHomeURL } from '../../dao';

import {
  getGamePointAPI,
  getTopicURL
} from '../../dao'

let screen = Dimensions.get('window');
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = screen;

export default class PhotoItem extends React.PureComponent {

  constructor(props) {
    super(props)

    this.state = {
      modalVisible: false
    }
  }

  shouldComponentUpdate = (props, state) => {
    if (props.modeInfo.isNightMode !== this.props.modeInfo.isNightMode) return true
    if (this.state.modalVisible !== state.modalVisible) return true
    if (props.isChecked !== this.props.isChecked) return true
    return false
  }

  render() {
    const { modeInfo, rowData, index, onLongPress, navigation,
      isChecked = true, onPress, width = 150, ITEM_HEIGHT } = this.props

    return (
      <View key={rowData.id || index} style={{
        borderBottomWidth: StyleSheet.hairlineWidth,
        alignSelf: 'flex-start',
        alignContent: 'flex-end',
        backgroundColor: modeInfo.backgroundColor,
        borderBottomColor: modeInfo.brighterLevelOne,
        width: ITEM_HEIGHT,
        height: ITEM_HEIGHT,
      }}>
        <TouchableNativeFeedback
          onPress={
            () => {
              onPress && onPress()
            }
          }
          onLongPress={() => {
            onLongPress && this.setState({
              modalVisible: true
            })
          }}
          useForeground={true}
          delayPressIn={100}
          background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
        >
          <View style={{ flex: 1, flexDirection: 'row', padding: 5, 
          backgroundColor: isChecked ? modeInfo.standardColor : modeInfo.backgroundColor }}>
            {
              this.state.modalVisible && onLongPress && (
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
                      <TouchableNativeFeedback onPress={() => {
                          this.setState({
                            modalVisible: false
                          }, () => {
                            requestAnimationFrame(() => {
                              this.props.navigation.navigate('ImageViewer', {
                                images: [
                                  { url: rowData.img }
                                ]
                              })
                            })
                          })
                        }}>
                        <View style={{height: 50, paddingVertical: 10, paddingLeft: 20 ,alignSelf: 'stretch', alignContent: 'stretch', justifyContent: 'center'}}>
                          <Text style={{textAlignVertical: 'center', fontSize: 18, color: modeInfo.standardTextColor}}>查看图片</Text>
                        </View>
                      </TouchableNativeFeedback>
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
