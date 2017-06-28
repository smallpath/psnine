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

import MyDialog from '../../components/Dialog';
import HTMLView from '../../components/HtmlToView';
import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { standardColor, nodeColor, idColor, accentColor } from '../../constants/colorConfig';
import { changeSegmentIndex, changeCommunityType, changeGeneType, changeCircleType } from '../../actions/app';

import {
  getGamePointAPI,
  getTopicURL
} from '../../dao'

let screen = Dimensions.get('window');
const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = screen;
export default class ComplexComment extends React.PureComponent {

  constructor(props) {
    super(props)

    this.state = {
      modalVisible: false
    }
  }

  shouldComponentUpdate = (props, state) => props.modeInfo.themeName !== this.props.modeInfo.themeName || this.state.modalVisible !== state.modalVisible

  _onRowPressed = (rowData) => {
    const { navigation } = this.props;
    const id = rowData.id || parseInt(rowData.url.split('/').pop())
    const URL = getTopicURL(id)
    navigation.navigate('CommunityTopic', {
      URL,
      title: rowData.title,
      rowData,
      type: 'community',
      shouldBeSawBackground: true
    })
  }

  render = () => {
    const { modeInfo, rowData, navigation, ITEM_HEIGHT, modalList = [], toolbarDispatch } = this.props
    // console.log(modalList)
    const { numColumns = 1 } = modeInfo
    return (
      <View style={{
        marginVertical: 3.5,
        marginHorizontal: numColumns === 1 ? 0 : 3.5,
        backgroundColor: modeInfo.backgroundColor,
        elevation: 1,
        flex: numColumns === 1 ? -1 : 1,
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
            <View style={{ marginLeft: 10, flex: 1, flexDirection: 'column', justifyContent: 'space-between'  }}>
              <Text
                ellipsizeMode={'tail'}
                numberOfLines={2}
                style={{ flex: -1, color: modeInfo.titleTextColor, }}>
                {rowData.title}
              </Text>

              <View style={{ flex: -1, flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text selectable={false} style={{ flex: -1, color: modeInfo.standardColor, textAlign: 'center', textAlignVertical: 'center' }} onPress={() => {
                    // this.flatlist.getNode().recordInteraction()
                    navigation.navigate('Home', {
                      title: rowData.psnid,
                      id: rowData.psnid,
                      URL: `http://psnine.com/psnid/${rowData.psnid}`
                    })
                  }}>{rowData.psnid}</Text>
                <Text selectable={false} style={{ flex: -1, color: modeInfo.standardTextColor, textAlign: 'center', textAlignVertical: 'center' }}>{rowData.date}</Text>
                <Text selectable={false} style={{ flex: -1, color: modeInfo.standardTextColor, textAlign: 'center', textAlignVertical: 'center' }}>{rowData.count}回复</Text>
                <Text selectable={false} style={{ flex: -1, color: rowData.type && toolbarDispatch ? modeInfo.standardColor : modeInfo.standardTextColor, textAlign: 'center', textAlignVertical: 'center' }} onPress={
                  rowData.type && toolbarDispatch ? () => {
                    toolbarDispatch(changeCommunityType(rowData.type));
                  } : null
                }>{rowData.type}</Text>
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
    color: idColor, // make links coloured pink
  },
});