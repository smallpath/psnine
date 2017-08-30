import React, { Component } from 'react'
import {
  StyleSheet,
  Text,
  View,
  TouchableNativeFeedback,
  Platform
} from 'react-native'

import Ionicons from 'react-native-vector-icons/Ionicons'
import { standardColor, idColor, accentColor } from '../../constant/colorConfig'

const isIOS = Platform.OS === 'ios'

/* tslint:disable */
const items = [
  {
    iconName: 'md-construct',
    text: '高级',
    onPress: function() {
      this.props.navigation.navigate('Reading')
    }
  },
  {
    iconName: 'md-information-circle',
    text: 'PSNINE',
    onPress: function() {
      this.props.navigation.navigate('PsnineAbout')
    }
  },
  {
    iconName: 'md-help-circle',
    text: '关于',
    onPress: function() {
      this.props.navigation.navigate('About')
    }
  }
]
/* tslint:enable */

class Setting extends Component<any, any> {

  constructor(props) {
    super(props)

    this.state = {
      checkUpdateTip: '点击检查更新',
      sourceCodeURL: 'https://github.com/smallpath/psnine',
      icon: false,
      switchMethod: true
    }
  }

  componentDidMount() {

  }

  async componentWillMount() {

  }

  renderRow = (item?, index?) => {
    const { modeInfo } = this.props.screenProps
    return (
      <TouchableNativeFeedback
        onPress={item.onPress.bind(this)}
        key={index}
      >
        <View pointerEvents={'box-only'} style={[styles.themeItem, {
          flex: -1,
          height: 80,
          flexDirection: 'row'
        }]}>
          <View style={{ width: 30, height: 30, flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Ionicons name={item.iconName} size={30} color={modeInfo.accentColor} />
          </View>
          <View style={{
            borderBottomWidth: StyleSheet.hairlineWidth,
            borderBottomColor: modeInfo.standradTextColor,
            alignItems: 'flex-start',
            justifyContent: 'center',
            flex: 4,
            height: 80
          }}>
            <Text style={[styles.themeName, { alignContent: 'stretch', textAlignVertical: 'center', 
              flex: isIOS ? -1 : 1, color: modeInfo.titleTextColor }]}>
              {item.text}
            </Text>
          </View>
        </View>
      </TouchableNativeFeedback>
    )
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
          title={`设置`}
          titleColor={modeInfo.isNightMode ? '#000' : '#fff'}
          style={[styles.toolbar, { backgroundColor: modeInfo.standardColor }]}
          onIconClicked={() => {
            this.props.navigation.goBack()
          }}
        />
        <View style={{flex: 1}}>
          {items.map((...args) => this.renderRow(...args))}
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

export default Setting