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
import { standardColor } from '../constants/colorConfig';

import Icon from 'react-native-vector-icons/Ionicons';

import { safeLogout } from '../dao/logout';
import { safeSignOn } from '../dao/signon';
import { fetchUser } from '../dao';

const items = [
  "个人主页", "我的游戏", "我的收藏", "系统选项", "设置", "关于"
];

const iconNameArr = [
  'md-home',
  'md-game-controller-b',
  'md-analytics',
  'md-appstore',
  'md-basket',
  'md-options',
  'ios-add',
  'md-help-circle'
]

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
      dataSource: dataSource.cloneWithRows(items),
    }
  }

  componentWillMount() {
    this.checkLoginState();
  }

  checkLoginState = async () => {
    const psnid = await AsyncStorage.getItem('@psnid');

    if (!psnid == null)
      return;

    const userInfo = await fetchUser(psnid)
    await AsyncStorage.setItem('@userInfo', JSON.stringify(userInfo));

    this.setState({
      psnid,
      userInfo,
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
    if (psnid == '') {
      navigation.navigate('Login', {
        setLogin: this.setLogin
      })
    } else {
      global.toast && global.toast('您已登录, 请先退出', 2000);
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

  switch = () => {
    const { closeDrawer, switchModeOnRoot } = this.props;
    closeDrawer();
    switchModeOnRoot();
  }

  renderHeader = () => {
    const { navigation, closeDrawer, switchModeOnRoot } = this.props;
    const { iconObj: icon } = this.state
    let toolActions = [];
    let Touchable = TouchableWithoutFeedback;

    toolActions.push(
      <TouchableNativeFeedback
        key={'changeStyle'}
        onPress={this.switch}
      >
        <View style={{
          flexDirection: 'column',
          justifyContent: 'center',
          marginLeft: this.state.psnid == '' ? 90 : this.state.userInfo.isSigned ? 55 : 20,
        }}>
          {this.props.modeInfo.isNightMode &&
            <Icon name="md-sunny" size={20} style={{ marginLeft: 6 }} color='#fff' /> ||
            <Icon name="md-moon" size={20} style={{ marginLeft: 6 }} color='#fff' />}
          <Text style={[styles.menuText, { marginTop: 5 }]}>
            {this.props.modeInfo.isNightMode ? '日间' : '夜间'}
          </Text>
        </View>
      </TouchableNativeFeedback>
    );

    let rows = [];

    if (this.state.psnid != '') {
      rows.push(
        <View key={'trophy'} style={styles.trophyRow}>
          <TouchableNativeFeedback>
            <View style={styles.menuContainer}>
              {/*<Image
                  source={require('../img/ic_favorites_white.png')}
                  style={{width: 30, height: 30}} />*/}
              <Text style={styles.platinum}>
                {this.state.userInfo.platinum}
              </Text>
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback>
            <View style={styles.menuContainer}>
              {/*<Image
                source={require('../img/ic_download_white.png')}
                style={{width: 30, height: 30}} /> */}
              <Text style={styles.gold}>
                {this.state.userInfo.gold}
              </Text>
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback>
            <View style={styles.menuContainer}>
              {/*<Image
                source={require('../img/ic_download_white.png')}
                style={{width: 30, height: 30}} />*/}
              <Text style={styles.silver}>
                {this.state.userInfo.silver}
              </Text>
            </View>
          </TouchableNativeFeedback>
          <TouchableNativeFeedback>
            <View style={styles.menuContainer}>
              {/*<Image
                source={require('../img/ic_download_white.png')}
                style={{width: 30, height: 30}} />*/}
              <Text style={styles.bronze}>
                {this.state.userInfo.bronze}
              </Text>
            </View>
          </TouchableNativeFeedback>
        </View>);

      rows.push(<View key={'rows'} style={styles.row}>
        <Touchable>
          <View style={styles.menuContainer}>
            <Icon name="md-text" size={20} color='#fff' />
            <Text style={styles.menuText}>
              帖子
                </Text>
          </View>
        </Touchable>
        <Touchable
          onPress={() => {
            if (this.state.psnid == '') {
              return;
            }

            closeDrawer();

            navigation.navigate('Message', {
              psnid: this.state.psnid
            });
          }}
        >
          <View style={styles.menuContainer}>
            <Icon name="md-notifications" size={20} color='#fff' />
            <Text style={styles.menuText}>
              消息
                </Text>
          </View>
        </Touchable>
        <Touchable>
          <View style={styles.menuContainer}>
            <Icon name="ios-people" size={20} color='#fff' />
            <Text style={styles.menuText}>
              关注
                </Text>
          </View>
        </Touchable>
        <Touchable>
          <View style={styles.menuContainer}>
            <Icon name="md-star" size={20} color='#fff' />
            <Text style={styles.menuText}>
              收藏
                </Text>
          </View>
        </Touchable>
      </View>);


      if (this.state.userInfo.isSigned == false) {
        toolActions.push(
          <TouchableNativeFeedback
            key={'sign'}
            onPress={this.pressSign}
          >
            <View style={{ flexDirection: 'column', justifyContent: 'center', marginLeft: 20 }}>
              <Icon name="md-log-in" size={20} style={{ marginLeft: 6 }} color='#fff' />
              <Text style={[styles.menuText, { marginTop: 5 }]}>
                签到
                </Text>
            </View>
          </TouchableNativeFeedback>
        )
      }

      toolActions.push(
        <TouchableNativeFeedback
          onPress={this.pressLogout}
          key={'exitApp'}
        >
          <View style={{ flexDirection: 'column', justifyContent: 'center', marginLeft: 20 }}>
            <Icon name="md-log-out" size={20} style={{ marginLeft: 6 }} color='#fff' />
            <Text style={[styles.menuText, { marginTop: 5 }]}>
              退出
              </Text>
          </View>
        </TouchableNativeFeedback>
      )
    }

    return (
      <View style={[styles.header, {
        height: this.state.psnid == '' ? 120 : 180,
        backgroundColor: this.props.modeInfo.standardColor,
      }]}>

        <View style={styles.userInfo}>
          <View style={{ flexDirection: 'row', alignItems: 'center', }}>
            <View style={{ flexDirection: 'column', alignItems: 'center', }}>
              <Touchable onPress={this.pressLogin}>
                <View style={{ flexDirection: 'column', alignItems: 'center', }}>
                  <Image
                    source={this.state.userInfo.avatar}
                    style={{ width: 70, height: 70, marginRight: 8 }} />
                  <Text style={[styles.menuText, { marginTop: 5 }]}>
                    {this.state.psnid == '' ? '请登录' : this.state.psnid}
                  </Text>
                </View>
              </Touchable>
            </View>
            <View style={{ flexDirection: 'row', marginLeft: 0, marginTop: 0 }}>
              {toolActions}
            </View>
          </View>
        </View>

        {rows}

      </View>
    );
  }

  onSelectItem = (sectionID, rowID) => {
    const { navigation, closeDrawer } = this.props;
    closeDrawer();
    let URL;
    if (sectionID == 's1') {
      let index = parseInt(rowID);
      index = this.state.psnid == '' ? index + 2 : index;
      switch (index) {
        case 0:
          if (this.state.psnid == '') {
            global.toast && global.toast('未登录', 2000);
            return;
          }

          URL = getHomeURL(this.state.psnid);
          navigation.navigate('Home', {
            URL,
            title: this.state.psnid
          });
          break;
        case 1:
          if (this.state.psnid == '') {
            global.toast && global.toast('未登录', 2000);
            return;
          }

          URL = getMyGameURL(this.state.psnid);

          navigation.navigate('MyGame', {
            URL,
            title: this.state.psnid
          });
          break;
        case 2:
          URL = 'http://psnine.com/my/fav?page=1'

          navigation.navigate('Favorite', {
            URL,
            title: '收藏'
          });
          break;

        case 4:

          break;
        case 5:
          navigation.navigate('About');
          break;

      }

    }
  }

  renderRow = (rowData, sectionID, rowID, highlightRow) => {
    let iconName = iconNameArr[rowID]
    const icon = <Icon name={iconName} size={25} style={{ marginLeft: 6 }} color='#03a9f4' />
    if (this.state.psnid == '' && rowID == 4 || this.state.psnid != '' && rowID == 6) {
      return (
        <View style={{ marginTop: 6 }}>
          <View
            style={{ backgroundColor: 'rgba(0,0,0,0.1)', height: 1, }}
          />
          <View>
            <View style={[styles.themeItem, {
              padding: 6, paddingLeft: 10, backgroundColor: this.props.modeInfo.backgroundColor
            }]}>
              <Text style={[styles.themeName, { fontSize: 13, color: this.props.modeInfo.standardTextColor }]}>
                {rowData}
              </Text>
            </View>
          </View>
        </View>
      )
    }

    return (
      <View>
        <TouchableNativeFeedback
          onPress={() => this.onSelectItem(sectionID, rowID)}
          delayPressIn={0}
        >
          <View style={[styles.themeItem, {
            backgroundColor: this.props.modeInfo.backgroundColor
          }]}>
            {icon}
            <Text style={[styles.themeName, { color: this.props.modeInfo.titleTextColor }]}>
              {rowData}
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
          dataSource={this.state.psnid != '' ? this.state.dataSource : this.state.dataSource.cloneWithRows(items.slice(2))}
          renderRow={this.renderRow}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="always"
          renderHeader={this.renderHeader}
          style={{ flex: 1, backgroundColor: this.props.modeInfo.backgroundColor }}
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
    flex: 4,
    margin: 20,
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