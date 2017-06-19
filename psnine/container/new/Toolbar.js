import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableNativeFeedback,
  Linking,
  Alert,
  ListView,
  ScrollView,
  Picker
} from 'react-native';

import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { standardColor, accentColor } from '../../constants/colorConfig';

import { pngPrefix, getDealURL, getHappyPlusOneURL, getStoreURL } from '../../dao';

import { safeLogin, registURL } from '../../dao/login';

import packages from '../../../package.json'

import checkVersion from '../../bootstrap/checkVersion'

let dataSource = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2,
});

const items = [
  {
    text: '加粗',
    onPress: function() {
      const { params } = this.props.navigation.state
      const { callback } = params
      if (callback) {
        this.props.navigation.goBack()
        callback({ 
          text: '[b][/b]',
          offset: 3
        })
      }
    }
  },
  {
    text: '彩色字体',
    onPress: null,
    renderComponent: function() {
      const { modeInfo } = this.props.screenProps
      return (
        <Picker style={{
          flex: 1,
          borderWidth: 1,
          color: modeInfo.standardTextColor
        }}
          prompt='选择颜色'
          selectedValue={this.state.color}
          onValueChange={(value) => {
            if (value === 'select') return
            const { params } = this.props.navigation.state
            const { callback } = params
            this.setState({
              color: value
            })
            if (callback) {
              this.props.navigation.goBack()
              callback({ 
                text: `[color=${value}][/color]`,
                offset: -6
              })
            }
          }}>
          <Picker.Item label="选择颜色" value="select" />
          <Picker.Item label="红色" color="red" value="red" />
          <Picker.Item label="橘黄" color="orange"  value="orange" />
          <Picker.Item label="棕色" color="brown"  value="brown" />
          <Picker.Item label="蓝色" color="blue"  value="blue" />
          <Picker.Item label="深紫" color="deeppink"  value="deeppink" />
        </Picker>
      )
    }
  },
  {
    text: '居中',
    onPress: function() {
      const { params } = this.props.navigation.state
      const { callback } = params
      if (callback) {
        this.props.navigation.goBack()
        callback({ 
          text: '[align=center]8888[/align]',
          offset: 3
        })
      }
    }
  },
  {
    text: '链接',
    onPress: function() {
      const { params } = this.props.navigation.state
      const { callback } = params
      if (callback) {
        this.props.navigation.goBack()
        callback({ 
          text: '[url][/url]',
          offset: 3
        })
      }
    }
  },
  {
    text: '视频',
    onPress: function() {
      const { params } = this.props.navigation.state
      const { callback } = params
      if (callback) {
        this.props.navigation.goBack()
        callback({ 
          text: '[flash][/flash]',
          offset: 3
        })
      }
    }
  },
  {
    text: '引用',
    onPress: function() {
      const { params } = this.props.navigation.state
      const { callback } = params
      if (callback) {
        this.props.navigation.goBack()
        callback({ 
          text: '[quote][/quote]',
          offset: 3
        })
      }
    }
  },
  {
    text: '图片',
    onPress: function() {
      const { params } = this.props.navigation.state
      const { callback } = params
      if (callback) {
        this.props.navigation.goBack()
        callback({ 
          text: '[img][/img]',
          offset: 3
        })
      }
    }
  },
  {
    text: '刮刮卡',
    onPress: function() {
      const { params } = this.props.navigation.state
      const { callback } = params
      if (callback) {
        this.props.navigation.goBack()
        callback({ 
          text: '[mark][/mark]',
          offset: 3
        })
      }
    }
  },
  {
    text: '删除线',
    onPress: function() {
      const { params } = this.props.navigation.state
      const { callback } = params
      if (callback) {
        this.props.navigation.goBack()
        callback({ 
          text: '[s][/s]',
          offset: 3
        })
      }
    }
  },
  {
    text: '分页',
    onPress: function() {
      const { params } = this.props.navigation.state
      const { callback } = params
      if (callback) {
        this.props.navigation.goBack()
        callback({ 
          text: '[title][/title]',
          offset: 3
        })
      }
    }
  }
]

class About extends Component {

  constructor(props) {
    super(props);

    this.state = {
      color: 'select'
    }
  }

  render() {
    const { modeInfo } = this.props.screenProps

    return (
      <View style={{ flex: 1, backgroundColor: modeInfo.backgroundColor }}>
        <Ionicons.ToolbarAndroid
          navIconName="md-arrow-back"
          overflowIconName="md-more"
          iconColor={modeInfo.isNightMode ? '#000' : '#fff'}
          title={`花式回复`}
          titleColor={modeInfo.isNightMode ? '#000' : '#fff'}
          style={[styles.toolbar, { backgroundColor: modeInfo.standardColor }]}
          onIconClicked={() => {
            this.props.navigation.goBack()
          }}
        />
        <ScrollView style={{ flex: 2, backgroundColor: modeInfo.backgroundColor }}>
          {items.map((item, index) => {
            const inner = (
              <View pointerEvents={item.renderComponent ? 'auto' : 'box-only'} style={{ height: 60, backgroundColor: modeInfo.backgroundColor, 
                padding: 6,
                flexDirection: 'row',
                alignItems: 'center',
                borderBottomColor: modeInfo.brighterLevelOne, borderBottomWidth: StyleSheet.hairlineWidth}}>
                <Text style={[styles.themeName, { flex: 1, color: modeInfo.titleTextColor }]}>
                  {item.text}
                </Text>
                {item.renderComponent && item.renderComponent.bind(this)()||undefined}
              </View>
            )
            return item.renderComponent ? (
              <View key={index} style={{flex:1}}>
                {inner}
              </View>
            ) : (
              <TouchableNativeFeedback key={index} onPress={item.onPress ? item.onPress.bind(this) : null}>
                {inner}
              </TouchableNativeFeedback>
            )
          })}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  themeItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
  },
  themeName: {
    flex: 1,
    fontSize: 16,
    marginLeft: 16,
  },  
  toolbar: {
    backgroundColor: standardColor,
    height: 56,
    elevation: 4,
  },
  regist: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 20,
    margin: 10,
  },
  openURL: {
    color: accentColor,
    textDecorationLine: 'underline',
  },
});


export default About