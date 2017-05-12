import React, { Component } from 'react';
import {
  AsyncStorage,
  Platform,
  ListView,
  Image,
  StyleSheet,
  Text,
  View,
  TouchableNativeFeedback,
  TouchableWithoutFeedback,
  TouchableHighlight,
  ToastAndroid,
} from 'react-native';

import {
  getHomeURL,
  pngPrefix,
  getDealURL,
  getHappyPlusOneURL,
  getStoreURL,
  getRankURL,
  getMyGameURL,
} from '../dao';

import {
  standardColor, 
  nodeColor, 
  idColor,
  accentColor,
  levelColor,
  rankColor,
} from '../constants/colorConfig';


import Icon from 'react-native-vector-icons/Ionicons';

import { safeLogout } from '../dao/logout';
import { safeSignOn } from '../dao/signon';
import { fetchUser } from '../dao';

const ListItems = [
  {
    text: '个人中心',
    iconName: 'md-home',
    onPress: function () {
      const { navigation, closeDrawer } = this.props;
      closeDrawer();

      let URL = getHomeURL(this.state.psnid);
      navigation.navigate('Home', {
        URL,
        title: this.state.psnid
      });
    }
  },
  {
    text: '我的收藏',
    iconName: 'md-star',
    onPress: function () {
      const { navigation, closeDrawer } = this.props;
      closeDrawer();

      let URL = 'http://psnine.com/my/fav?page=1'

      navigation.navigate('Favorite', {
        URL,
        title: '收藏'
      });
    }
  },
  {
    text: '系统选项',
    iconName: 'md-home'
  },
  {
    text: '设置',
    iconName: 'md-options',
    onPress: function () {

    }
  },
  {
    text: '关于',
    iconName: 'md-help-circle',
    onPress: function () {
      const { navigation, closeDrawer } = this.props;
      closeDrawer()
      navigation.navigate('About');
    }
  }
];


class navigationDrawer extends Component {
  constructor(props) {
    super(props);
    let dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });
    this.state = {
      psnid: '',
      userInfo: {
        avatar: require('../img/comment_avatar.png'),
        platinum: '白',
        gold: '金',
        silver: '银',
        bronze: '铜',
        isSigned: true,
      },
      hasMessage: false,
      dataSource: dataSource.cloneWithRows(ListItems),
    }
  }

  componentWillMount() {
    this.checkLoginState();
  }

  checkLoginState = async () => {
    const psnid = await AsyncStorage.getItem('@psnid');

    if (!psnid)
      return;

    const userInfo = await fetchUser(psnid)
    await AsyncStorage.setItem('@userInfo', JSON.stringify(userInfo));

    this.setState({
      psnid,
      userInfo,
      hasMessage: userInfo.hasMessage
    })
  }

  renderSeparator(sectionID: number, rowID: number, adjacentRowHighlighted: bool) {
    return (
      <View
        key={`${sectionID}-${rowID}`}
        style={{ height: adjacentRowHighlighted ? 4 : 1, backgroundColor: adjacentRowHighlighted ? '#3B5998' : '#CCCCCC', }}
      />
    );
  }

  pressLogin = () => {
    const { navigation, closeDrawer } = this.props;
    const { psnid } = this.state;
    closeDrawer();
    if (!psnid) {
      navigation.navigate('Login', {
        setLogin: this.setLogin
      })
    } else {
      let URL = getHomeURL(this.state.psnid);
      navigation.navigate('Home', {
        URL,
        title: this.state.psnid
      });
    }
  }

  pressLogout = async () => {
    const { closeDrawer } = this.props;
    closeDrawer();
    await safeLogout(this.state.psnid);
    this.setState({
      psnid: '',
      userInfo: {
        avatar: require('../img/comment_avatar.png'),
        platinum: '白',
        gold: '金',
        silver: '银',
        bronze: '铜',
      },
      hasMessage: false
    });
    global.toast && global.toast('登出成功', 2000);
  }

  setLogin = (psnid, userInfo) => {
    this.setState({
      psnid,
      userInfo,
    })
  }

  pressSign = async () => {
    const { closeDrawer } = this.props;
    closeDrawer();
    let data = await safeSignOn(this.state.psnid);
    this.setState({
      userInfo: Object.assign({}, this.state.userInfo, { isSigned: true }),
    });

    global.toast && global.toast(data, 2000);
  }

  onMessageClick = () => {
    const { navigation, closeDrawer } = this.props;
    closeDrawer();
    if (this.state.psnid == '') {
      global.toast && global.toast('未登录', 2000);
      return;
    }

    let URL = getHomeURL(this.state.psnid);
    navigation.navigate('Message', {
      URL,
      title: this.state.psnid
    });
  }

  switch = () => {
    const { closeDrawer, switchModeOnRoot } = this.props;
    closeDrawer();
    switchModeOnRoot();
  }

  renderHeader = () => {
    const { navigation, closeDrawer, switchModeOnRoot } = this.props;
    const { modeInfo } = this.props
    const { iconObj: icon, psnid, userInfo, hasMessage } = this.state
    let toolActions = [];
    const iconStyle = {
      borderColor: '#fff',
      borderWidth: 0,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'transparent',
      height: 26,
      width: 26,
      flex: 0,
      marginLeft: 14
    }

    const color = '#fff'
    const size = 24
    const borderRadius = 12

    if (psnid) {
      let dot = undefined
      if (this.state.hasMessage) {
        dot = (
          <View borderRadius={4} style={{ position:'absolute', top: 3, right: 3, backgroundColor: modeInfo.accentColor, height: 8, width: 8}} />
        )
      }
      toolActions.push(
        <TouchableNativeFeedback
          background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
          key={'sign'}
          onPress={() => {
            if (dot) {
              this.setState({
                hasMessage: false
              }, () => {
                this.onMessageClick()
              })
              return
            }
            this.onMessageClick()
          }}
        >
          <View borderRadius={borderRadius} style={iconStyle}>
            <Icon name="md-notifications" size={size} color={color} />
            {dot}
          </View>
        </TouchableNativeFeedback>
      )
    }


    toolActions.push(
      <TouchableNativeFeedback
        background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
        key={'changeStyle'}
        onPress={this.switch}
      >
        <View borderRadius={borderRadius} style={iconStyle}>
          {this.props.modeInfo.isNightMode &&
            <Icon name="md-sunny" size={size} color={color} /> ||
            <Icon name="md-moon" size={size} color={color} />}
        </View>
      </TouchableNativeFeedback>
    );

    if (this.state.psnid != '') {
      if (this.state.userInfo.isSigned == false) {
        toolActions.push(
          <TouchableNativeFeedback
            background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
            key={'log-in'}
            onPress={this.pressSign}
          >
            <View borderRadius={borderRadius} style={iconStyle}>
              <Icon name="md-checkbox-outline" size={size} color={color} />
            </View>
          </TouchableNativeFeedback>
        )
      }
      toolActions.push(
        <TouchableNativeFeedback
          background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
          onPress={this.pressLogout}
          key={'exitApp'}
        >
          <View borderRadius={borderRadius} style={iconStyle}>
            <Icon name="md-log-out" size={size} color={color} />
          </View>
        </TouchableNativeFeedback>
      )
    }

    const infoColor = 'rgba(255,255,255,0.8)'
    // console.log(userInfo, userInfo.exp, userInfo.split)
    return (
      <View style={[{
        flex: 1,
        padding: 20,
        backgroundColor: this.props.modeInfo.standardColor
      }]}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between', alignSelf: 'flex-start', alignContent: 'flex-start' }}>
            <TouchableWithoutFeedback onPress={this.pressLogin}>
              <View borderRadius={35} style={{ flexDirection: 'column', alignItems: 'center', backgroundColor: modeInfo.backgroundColor }}>
                <Image
                  borderRadius={35}
                  source={userInfo.avatar}
                  style={{ width: 70, height: 70, }} />
              </View>
            </TouchableWithoutFeedback>
            <Text style={[styles.menuText, { paddingTop: 5, textAlign: 'center' }]}>{psnid == '' ? '请登录' : psnid}</Text>
            {psnid && (
              <View style={{flex: 1, width: 100}}>
                <View style={{ flexDirection: 'row', justifyContent:'space-between', alignItems: 'center', flex: 1  }}>
                    <Text style={{ color: levelColor, fontSize: 12 }}>{userInfo.exp.split('经验')[0] + ' '}<Text style={{ flex: -1, color: infoColor, fontSize: 12 }}>{userInfo.exp.split('经验')[1]}</Text></Text>
                </View>
                <View style={{ flex: 0, width: 200 }}>
                  <Text style={{ }}>
                    <Text style={{ flex: -1, color: color, textAlign:'center', fontSize: 12 }}>{userInfo.platinum + ' '}</Text>
                    <Text style={{ flex: -1, color: color, textAlign:'center', fontSize: 12 }}>{userInfo.gold + ' '}</Text>
                    <Text style={{ flex: -1, color: color, textAlign:'center', fontSize: 12 }}>{userInfo.silver + ' '}</Text>
                    <Text style={{ flex: -1, color: color, textAlign:'center', fontSize: 12 }}>{userInfo.gold + ' '}</Text>
                    <Text style={{ flex: -1, color: color, textAlign:'center', fontSize: 12 }}>{userInfo.all + ' '}</Text>
                  </Text>
                </View>
              </View>) || undefined}
          </View>
          <View style={{ paddingRight: toolActions.length === 4 ? 20 : 0, flex:1, flexDirection: 'row', alignSelf: 'flex-start', alignContent: 'flex-end', justifyContent: 'center', alignItems: 'flex-end' }}>
            {toolActions}
          </View>
        </View>
      </View>
    );
  }

  renderRow = (rowData, sectionID, rowID, highlightRow) => {
    const item = ListItems[rowID]
    let iconName = item.iconName

    const icon = <Icon name={iconName} size={25} style={{ marginLeft: 6 }} color='#03a9f4' />
    if (rowData.text === '系统选项') {
      return (
        <View style={{ marginTop: 6 }}>
          <View
            style={{ backgroundColor: 'rgba(0,0,0,0.1)', height: rowID === '0' ? 0 : 1, }}
          />
          <View style={[styles.themeItem, {
            padding: 6, paddingLeft: 10, backgroundColor: this.props.modeInfo.backgroundColor
          }]}>
            <Text style={[styles.themeName, { fontSize: 13, color: this.props.modeInfo.standardTextColor }]}>
              {rowData.text}
            </Text>
          </View>
        </View>
      )
    }

    return (
      <View>
        <TouchableNativeFeedback
          onPress={() => item.onPress.bind(this)(rowData)}
          delayPressIn={0}
        >
          <View style={[styles.themeItem, {
            backgroundColor: this.props.modeInfo.backgroundColor
          }]}>
            {icon}
            <Text style={[styles.themeName, { color: this.props.modeInfo.titleTextColor }]}>
              {rowData.text}
            </Text>
          </View>
        </TouchableNativeFeedback>
      </View>
    );
  }


  render = () => {
    // console.log('navigationDrawer.js rendered');
    return (
      <View style={styles.container} {...this.props}>
        <ListView
          ref="themeslistview"
          dataSource={this.state.psnid !== '' ? this.state.dataSource : this.state.dataSource.cloneWithRows(ListItems.slice(2))}
          renderRow={this.renderRow}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="always"
          renderHeader={this.renderHeader}
          enableEmptySections={true}
          style={{ flex: 2, backgroundColor: this.props.modeInfo.backgroundColor }}
        />
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  header: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: standardColor,
    height: 180,
  },
  userInfo: {
    flex: 4
  },
  trophyRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginLeft: 5,
    marginTop: -60,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    //marginLeft: 8,
    paddingTop: -10,
  },
  menuContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingLeft: 2,
    paddingRight: 0
  },
  menuText: {
    fontSize: 14,
    color: 'white',
  },
  homeTheme: {
    fontSize: 16,
    marginLeft: 16,
    color: standardColor
  },
  themeItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  themeName: {
    flex: 1,
    fontSize: 16,
    marginLeft: 16,
  },
  themeIndicate: {
    marginLeft: 16,
    width: 20,
    height: 20
  },
  separator: {
    height: 1,
    backgroundColor: '#eeeeee',
  },
  rowSeparator: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    height: 1,
    marginLeft: 4,
  },
  rowSeparatorHide: {
    opacity: 0.0,
  },
  platinum: {
    color: '#fff'
  },
  gold: {
    color: '#fff'
  },
  silver: {
    color: '#fff'
  },
  bronze: {
    color: '#fff'
  },
});


module.exports = navigationDrawer