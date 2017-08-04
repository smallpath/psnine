import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  AsyncStorage,
  Picker,
  Alert
} from 'react-native'

import Ionicons from 'react-native-vector-icons/Ionicons'
import { standardColor, idColor, accentColor } from '../../constant/colorConfig'

class General extends Component<any, any> {

  constructor(props) {
    super(props)

    this.state = {
      tabMode: 'tab'
    }
  }

  componentDidMount() {

  }

  async componentWillMount() {
    const value = await AsyncStorage.getItem('@Theme:tabMode')
    const tabMode = value === 'drawer' ? 'drawer' : 'tab'
    this.setState({
      tabMode
    })
  }

  renderSwitchType = (_?, index?) => {
    const { modeInfo } = this.props.screenProps
    return (
    <View key={index} style={[styles.themeItem, {
        flex: -1,
        height: 80,
        flexDirection: 'row',
        padding: 10,
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: modeInfo.standradTextColor
    }]}>
      <View style={{flex: 4, justifyContent: 'center', alignItems: 'flex-start'}}>
        <Text style={[styles.themeName, { marginTop: 12, flex: 1, color: modeInfo.titleTextColor }]}>
          {'选择首页模式'}
        </Text>
        <Text style={[styles.themeName, { marginTop: -12, fontSize: 13, flex: 1, color: modeInfo.standardTextColor }]}>
          {'可选标签模式或右侧抽屉模式'}
        </Text>
      </View>
      <Picker style={{
        flex: 3,
        color: modeInfo.standardTextColor
      }}
        prompt='选择首页模式'
        selectedValue={this.state.tabMode}
        onValueChange={this.onValueChange.bind(this, 'tabMode')}>
        <Picker.Item label='右侧抽屉' value='drawer' />
        <Picker.Item label='标签' value='tab' />
      </Picker>
    </View>
    )
  }

  onValueChange = (key, value) => {
    const newState = {}
    newState[key] = value
    this.setState(newState, () => {
      if (key === 'tabMode') {
        Alert.alert(
          '提示',
          '重启后生效'
        )
        AsyncStorage.setItem('@Theme:tabMode', value)
      }
    })
  }

  render() {
    const { modeInfo } = this.props.screenProps

    return (
      <View style={{ flex: 1, backgroundColor: modeInfo.backgroundColor }}
        onStartShouldSetResponder={() => false}
        onMoveShouldSetResponder={() => false}>
        <Ionicons.ToolbarAndroid
          navIconName='md-arrow-back'
          overflowIconName='md-more'
          iconColor={modeInfo.isNightMode ? '#000' : '#fff'}
          title={`一般`}
          titleColor={modeInfo.isNightMode ? '#000' : '#fff'}
          style={[styles.toolbar, { backgroundColor: modeInfo.standardColor }]}
          onIconClicked={() => {
            this.props.navigation.goBack()
          }}
        />
        <View style={{flex: 1}}>
          {this.renderSwitchType()}
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  themeItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6
  },
  themeName: {
    flex: 1,
    fontSize: 16
  },
  regist: {
    flex: 1,
    flexDirection: 'row',
    marginTop: 20,
    margin: 10
  },
  openURL: {
    color: accentColor,
    textDecorationLine: 'underline'
  },
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
  selectedTitle: {
    // backgroundColor: '#00ffff'
    // fontSize: 20
  },
  avatar: {
    width: 50,
    height: 50
  },
  a: {
    fontWeight: '300',
    color: idColor // make links coloured pink
  }
})

export default General