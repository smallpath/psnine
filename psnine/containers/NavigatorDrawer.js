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
} from '../dao/dao';
import { standardColor } from '../config/colorConfig';

import CommunityTopic from '../components/CommunityTopic';
import Deal from '../components/Deal';
import GeneTopic from '../components/GeneTopic';
import HappyPlusOne from '../components/HappyPlusOne';
import Store from '../components/Store';
import Rank from '../components/Rank';
import About from '../components/About';

import Login from './authPagers/Login';
import Message from './authPagers/Message';
import Home from './authPagers/Home';
import MyGame from './authPagers/MyGame';

import { safeLogout } from '../dao/logout';
import { safeSignOn } from '../dao/signon';
import { fetchUser } from '../dao/dao';

let signIcon = require('../img/ic_assignment_blue.png');

let imageSrc = [
  require('../img/home.png'),
  require('../img/ic_game_blue.png'),
  require('../img/ic_rank_blue.png'),
  require('../img/ic_plus_blue.png'),
  require('../img/ic_store_blue.png'),
  require('../img/ic_business_blue.png'),
  '',
  require('../img/ic_setting_blue.png'),
  require('../img/ic_about_blue.png'),
];

let imageArr = imageSrc.slice(0);

let items = [
              "个人中心","我的游戏","排行","游惠","Store","闲游","系统选项","设置","关于"
];

class NavigatorDrawer extends Component {
  constructor(props){
      super(props);
      let dataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      });
      this.state = {
          psnid: '',
          userInfo : {
            avatar: require('../img/comment_avatar.png'),
            platinum: '白',
            gold: '金',
            silver: '银',
            bronze: '铜',
            isSigned: true,
          },
          dataSource:dataSource.cloneWithRows(items),
      }
  }

  componentWillMount(){
    this.checkLoginState();
  }

  checkLoginState = async () =>{
    const psnid = await AsyncStorage.getItem('@psnid');

    if(psnid==null)
      return;
    
    if(psnid=='')
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

  pressLogin = () =>{
    const { navigator, closeDrawer} = this.props;
    const { psnid } = this.state;
    closeDrawer();
    if (psnid == ''){
      navigator.push({
        component: Login,
        params: {
          setLogin: this.setLogin,
        },
        withoutAnimation: false,
      })
    }else{
      ToastAndroid.show('您已登录, 请先退出', 2000);
    }
  }

  pressLogout = async () =>{
    const { navigator, closeDrawer} = this.props;
    closeDrawer();
    await safeLogout(this.state.psnid);
    this.setState({
      psnid:'',          
      userInfo : {
        avatar: require('../img/comment_avatar.png'),
        platinum: '白',
        gold: '金',
        silver: '银',
        bronze: '铜',
      },
    });
    ToastAndroid.show('登出成功', 2000);
  }

  setLogin = (psnid,userInfo) => {
    this.setState({
      psnid,
      userInfo,
    })
  }

  pressSign = async () => {
    const { navigator, closeDrawer} = this.props;
    closeDrawer();
    let data = await safeSignOn(this.state.psnid);
    this.setState({
      userInfo: Object.assign({},this.state.userInfo,{ isSigned: true }),
    });

    ToastAndroid.show(data,2000);
  }

  switch = () => {
    const { navigator, closeDrawer, switchModeOnRoot} = this.props;
    closeDrawer();
    switchModeOnRoot();
  }

  renderHeader = () => {
      const { navigator, closeDrawer, switchModeOnRoot} = this.props;
      //let avatar = 
      let toolActions = [];
      let Touchable = TouchableWithoutFeedback;

      toolActions.push(<TouchableNativeFeedback
                        key={'changeStyle'}
                        onPress={this.switch}
                        >
                        <View style={{
                          flexDirection: 'column',  
                          justifyContent: 'center',
                          marginLeft: this.state.psnid == '' ? 90 : this.state.userInfo.isSigned ? 55 : 20,
                        }}>
                          <Image source={require('../img/ic_assignment_white.png')}            
                                  style={{width: 20, height: 20}} />
                          <Text style={[styles.menuText,{marginTop:5}]}>
                            {this.props.modeInfo.isNightMode ? '日间' : '夜间'}
                          </Text>
                        </View>
                      </TouchableNativeFeedback>);

      let rows = [];

      if(this.state.psnid != ''){
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
                <Image
                  source={require('../img/ic_favorites_white.png')}
                  style={{width: 30, height: 30}} />
                <Text style={styles.menuText}>
                  帖子
                </Text>
              </View>
            </Touchable>
            <Touchable
              onPress={()=>{
                if(this.state.psnid == ''){
                  return;
                }

                closeDrawer();
                  
                navigator.push({
                  component: Message,
                  params: {
                    psnid: this.state.psnid,
                  }
                });
              }}
              >
              <View style={styles.menuContainer}>
              <Image
                source={require('../img/ic_message_white_small.png')}
                style={{width: 30, height: 30,}} />
                <Text style={styles.menuText}>
                  消息
                </Text>
              </View>
            </Touchable>
            <Touchable>
              <View style={styles.menuContainer}>
              <Image
                source={require('../img/ic_download_white.png')}
                style={{width: 30, height: 30}} />
                <Text style={styles.menuText}>
                  关注
                </Text>
              </View>
            </Touchable>
            <Touchable>
              <View style={styles.menuContainer}>
              <Image
                source={require('../img/ic_download_white.png')}
                style={{width: 30, height: 30}} />
                <Text style={styles.menuText}>
                  收藏
                </Text>
              </View>
            </Touchable>
          </View>);
        

        if(this.state.userInfo.isSigned == false){
          toolActions.push(<TouchableNativeFeedback
                            key={'sign'}
                            onPress={this.pressSign}
                            >
                            <View style={{flexDirection: 'column',  justifyContent: 'center',marginLeft: 20}}>
                              <Image source={require('../img/ic_assignment_white.png')}            
                                      style={{width: 20, height: 20}} />
                              <Text style={[styles.menuText,{marginTop:5}]}>
                                签到
                              </Text>
                            </View>
                          </TouchableNativeFeedback>)
        }

        toolActions.push(<TouchableNativeFeedback
                     onPress={this.pressLogout}
                     key={'exitApp'}
                    // onShowUnderlay={highlightRowFunc}
                    // onHideUnderlay={highlightRowFunc}
                    >
                    <View style={{flexDirection: 'column',  justifyContent: 'center',marginLeft: 20}}>
                      <Image source={require('../img/ic_exit_white.png')}            
                              style={{width: 20, height: 20}} />
                      <Text style={[styles.menuText,{marginTop:5}]}>
                        退出
                      </Text>
                    </View>
                  </TouchableNativeFeedback>)
        }  

      return (
      <View style={[styles.header, {
        height: this.state.psnid == '' ? 120: 180,
        backgroundColor: this.props.modeInfo.standardColor,
      }]}>

        <View style={styles.userInfo}>
            <View style={{flexDirection: 'row',  alignItems: 'center',}}>
                <View style={{flexDirection: 'column',  alignItems: 'center', }}>
                  <Touchable onPress={this.pressLogin}>
                    <View style={{flexDirection: 'column',  alignItems: 'center', }}>
                      <Image
                        source={this.state.userInfo.avatar}
                        style={{width: 70, height: 70, marginRight: 8}} />
                      <Text style={[styles.menuText,{marginTop: 5}]}>
                        {this.state.psnid == '' ? '请登录': this.state.psnid}
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

  onSelectItem = (sectionID,rowID)=>{
    const { navigator, closeDrawer} = this.props;
    closeDrawer();
    let URL;
    if(sectionID == 's1'){
      let index = parseInt(rowID);
      index = this.state.psnid == '' ? index +2 : index;
      switch (index) {
        case 0:
            if(this.state.psnid == ''){
              ToastAndroid.show('未登录',2000);
              return;
            }

            URL = getHomeURL(this.state.psnid);

            navigator.push({
              component: HappyPlusOne,
              params: {
                URL,
                title: this.state.psnid,
              }
            });
            break;
        case 1:
            if(this.state.psnid == ''){
              ToastAndroid.show('未登录',2000);
              return;
            }

            URL = getMyGameURL(this.state.psnid);

            navigator.push({
              component: MyGame,
              params: {
                URL,
                title: this.state.psnid,
              }
            });
            break;
        case 2:
            URL = getRankURL();

            navigator.push({
              component: HappyPlusOne,
              params: {
                URL,
                title: '排行',
              }
            });
            break;

        case 3:
            URL = getHappyPlusOneURL();

            navigator.push({
              component: HappyPlusOne,
              params: {
                URL,
                title: '游惠',
              }
            });
            break;
        case 4:
            URL = getStoreURL();
            navigator.push({
              component: Store,
              params: {
                URL,
                title: 'Store',
              }
            });
            break;
        case 5:
            URL = getDealURL();
            //URL = 'http://120.55.124.66/user/smallpath';
            navigator.push({
              component: Deal,
              params: {
                URL,
                title: '闲游',
              }
            });
            break;
        case 7:

            break;
        case 8:
            navigator.push({
              component: About,
              params: {

              }
            });
            break;

      }

    }
  }

  renderRow = (rowData, sectionID, rowID, highlightRow) => {
    let icon = imageArr[rowID];
    if ( this.state.psnid == '' &&  rowID == 4  || this.state.psnid != '' && rowID == 6){
      return (
        <View style={{marginTop: 6}}>
          <View 
            style={{backgroundColor: 'rgba(0,0,0,0.1)', height: 1, }}
          />
          <View>
            <View style={[styles.themeItem,{
              padding: 6, paddingLeft: 10,backgroundColor: this.props.modeInfo.brighterLevelOne
            }]}>
              <Text style={[styles.themeName,{ fontSize:13 ,color: this.props.modeInfo.standardTextColor}]}>
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
           onPress={()=>this.onSelectItem(sectionID,rowID)}
           delayPressIn={0}
          // onShowUnderlay={highlightRowFunc}
          // onHideUnderlay={highlightRowFunc}
          >
          <View style={[styles.themeItem,{
            backgroundColor: this.props.modeInfo.brighterLevelOne
          }]}>
            <Image source={icon} style={styles.themeIndicate}/>
            <Text style={[styles.themeName,{color: this.props.modeInfo.titleTextColor}]}>
              {rowData}
            </Text>
          </View>
        </TouchableNativeFeedback>
      </View>
    );
  }


  render = () => {
    // console.log('NavigatorDrawer.js rendered');
    if (this.state.psnid == ''){
      imageArr = imageSrc.slice(2);
    }else{
      imageArr = imageSrc.slice(0);
    }
    return (
      <View style={styles.container} {...this.props}>
        <ListView
          ref="themeslistview"
          dataSource={this.state.psnid != '' ? this.state.dataSource : this.state.dataSource.cloneWithRows(items.slice(2))}
          renderRow={this.renderRow}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps="always"
          renderHeader={this.renderHeader}
          style={{flex:1, backgroundColor: this.props.modeInfo.brighterLevelOne}}
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
    marginLeft: 25,
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
    flex:1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 0,
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
    padding: 6,
  },
  themeName: {
    flex: 1,
    fontSize: 16,
    marginLeft: 16,
  },
  themeIndicate: {
    marginLeft: 16,
    width: 30,
    height: 30,
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


module.exports = NavigatorDrawer