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
import MyDialog from '../../components/Dialog';
import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { standardColor, nodeColor, idColor, accentColor } from '../../constants/colorConfig';

import {
  getGamePointAPI
} from '../../dao'

let screen = Dimensions.get('window');
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = screen;
export default class ComplexComment extends React.PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      modalVisible: false,
      forceMark: false
    }
  }

  shouldComponentUpdate = (props, state) => {
    if (props.modeInfo.themeName !== this.props.modeInfo.themeName) return true
    if (this.state.modalVisible !== state.modalVisible) return true
    if (this.state.forceMark !== state.forceMark) return true
    return false
  }

  render() {
    const { modeInfo, rowData, onPress, modalList = [], isChecked = false } = this.props
    const shouldShowMark = (rowData.content || '').includes('<span class="mark">')
    return (
      <View key={rowData.id} style={{
        marginVertical: 3.5,
        elevation: 1,
        backgroundColor: isChecked ? modeInfo.tintColor : modeInfo.backgroundColor
      }}>
        <TouchableNativeFeedback
          onPress={() => onPress(rowData)}
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
              source={{ uri: rowData.img }}
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
                      {
                        shouldShowMark && (
                          <TouchableNativeFeedback onPress={() => {
                            this.setState({
                              modalVisible: false
                            }, () => {
                              requestAnimationFrame(() => {
                                this.setState({
                                  forceMark: !this.state.forceMark
                                })
                              })
                            })
                          }}>
                          <View style={{height: 50, paddingVertical: 10, paddingLeft: 20 ,alignSelf: 'stretch', alignContent: 'stretch', justifyContent: 'center'}}>
                            <Text style={{textAlignVertical: 'center', fontSize: 18, color: modeInfo.standardTextColor}}>{!this.state.forceMark && '显示刮刮卡' || '隐藏刮刮卡'}</Text>
                          </View>
                        </TouchableNativeFeedback>
                        )
                      }
                    </View>
                  )} />
              )
            }
            <View style={{ marginLeft: 10, flex: 1, flexDirection: 'column' }}>
              <HTMLView
                value={rowData.content}
                modeInfo={modeInfo}
                stylesheet={styles}
                onImageLongPress={(url) => this.props.navigation.navigate('ImageViewer', {
                  images: [
                    { url }
                  ]
                })}
                forceMark={shouldShowMark ? this.state.forceMark : false}
                imagePaddingOffset={30 + 50}
              />

              <View style={{ flex: 1.1, flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text selectable={false} style={{ flex: -1, color: modeInfo.standardColor, textAlign: 'center', textAlignVertical: 'center' }} onPress={
                  () => {
                    this.props.navigation.navigate('Home', {
                      title: rowData.psnid,
                      id: rowData.psnid,
                      URL: `http://psnine.com/psnid/${rowData.psnid}`
                    })
                  }
                }>{rowData.psnid}</Text>
                <Text selectable={false} style={{ flex: -1, color: modeInfo.standardTextColor, textAlign: 'center', textAlignVertical: 'center' }}>{rowData.date}</Text>
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
    backgroundColor: '#F5FCFF',
  },
  toolbar: {
    backgroundColor: standardColor,
    height: 56,
    elevation: 4,
  },
  selectedTitle: {
    //backgroundColor: '#00ffff'
    //fontSize: 20
  },
  avatar: {
    width: 50,
    height: 50,
  },
  a: {
    fontWeight: '300',
    color: accentColor, // make links coloured pink
  },
});