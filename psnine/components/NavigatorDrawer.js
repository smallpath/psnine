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
  TouchableHighlight,
} from 'react-native';

class NavigatorDrawer extends Component {
  constructor(props){
      super(props);
      var dataSource = new ListView.DataSource({
        rowHasChanged: (row1, row2) => row1 !== row2,
      });
      this.state = {
          isLoading: false,
          dataSource:dataSource.cloneWithRows([
              "我的游戏","我的消息","设置"
          ]),
      }
  }
 renderSeparator(sectionID: number, rowID: number, adjacentRowHighlighted: bool) { 
   return ( 
     <View 
      key={`${sectionID}-${rowID}`} 
      style={{ height: adjacentRowHighlighted ? 4 : 1, backgroundColor: adjacentRowHighlighted ? '#3B5998' : '#CCCCCC', }} 
      /> 
      ); 
    }

  renderHeader(){
      let TouchableElement = TouchableHighlight;
      if (Platform.OS === 'android') {
        TouchableElement = TouchableNativeFeedback;
      }
      return (
      <View style={styles.header}>
        <View style={styles.userInfo}>
          <TouchableElement>
            <View style={{flexDirection: 'row', alignItems: 'center', padding: 16}}>
              <Image
                source={require('image!comment_avatar')}
                style={{width: 40, height: 40, marginLeft: 8, marginRight: 8}} />
              <Text style={styles.menuText}>
                请登录
              </Text>
            </View>
          </TouchableElement>
          <View style={styles.trophyRow}>
            <TouchableElement>
              <View style={styles.menuContainer}>
              {/*<Image
                  source={require('image!ic_favorites_white')}
                  style={{width: 30, height: 30}} />*/}
                <Text style={styles.menuText}>
                  白
                </Text>
              </View>
            </TouchableElement>
            <TouchableElement>
              <View style={styles.menuContainer}>
              {/*<Image
                source={require('image!ic_download_white')}
                style={{width: 30, height: 30}} /> */}
                <Text style={styles.menuText}>
                  金
                </Text>
              </View>
            </TouchableElement>
            <TouchableElement>
              <View style={styles.menuContainer}>
              {/*<Image
                source={require('image!ic_download_white')}
                style={{width: 30, height: 30}} />*/}
                <Text style={styles.menuText}>
                  银
                </Text>
              </View>
            </TouchableElement>
            <TouchableElement>
              <View style={styles.menuContainer}>
              {/*<Image
                source={require('image!ic_download_white')}
                style={{width: 30, height: 30}} />*/}
                <Text style={styles.menuText}>
                  铜
                </Text>
              </View>
            </TouchableElement>
          </View>
          <View style={styles.row}>
            <TouchableElement>
              <View style={styles.menuContainer}>
                <Image
                  source={require('image!ic_favorites_white')}
                  style={{width: 30, height: 30}} />
                <Text style={styles.menuText}>
                  帖子
                </Text>
              </View>
            </TouchableElement>
            <TouchableElement>
              <View style={styles.menuContainer}>
              <Image
                source={require('image!ic_download_white')}
                style={{width: 30, height: 30}} />
                <Text style={styles.menuText}>
                  关注
                </Text>
              </View>
            </TouchableElement>
            <TouchableElement>
              <View style={styles.menuContainer}>
              <Image
                source={require('image!ic_download_white')}
                style={{width: 30, height: 30}} />
                <Text style={styles.menuText}>
                  收藏
                </Text>
              </View>
            </TouchableElement>
          </View>
        </View>
        <TouchableElement 
            //onPress={() => this.props.onSelectItem(null)}
            >
          <View style={styles.themeItem}>
            <Image
              source={require('image!home')}
              style={{width: 30, height: 30, marginLeft: 10}} />
            <Text style={styles.homeTheme}>
              签到
            </Text>
          </View>
        </TouchableElement>
      </View>
      );
  }  

  renderRow(rowData, sectionID, rowID, highlightRow) {
    let TouchableElement = TouchableHighlight;
    if (Platform.OS === 'android') {
      TouchableElement = TouchableNativeFeedback;
    }
    var icon = true ? require('image!ic_menu_arrow') : require('image!ic_menu_follow');
    return (
      <View>
        <TouchableElement
          // onPress={() => this.props.onSelectItem(theme)}
          // onShowUnderlay={highlightRowFunc}
          // onHideUnderlay={highlightRowFunc}
          >
          <View style={styles.themeItem}>
            <Text style={styles.themeName}>
              {rowData}
            </Text>
            <Image source={icon} style={styles.themeIndicate}/>
          </View>
        </TouchableElement>
      </View>
    );
  }

  render() {
    return (
      <View style={styles.container} {...this.props}>
        <ListView
          ref="themeslistview"
          dataSource={this.state.dataSource}
          renderRow={this.renderRow}
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps={true}
          showsVerticalScrollIndicator={false}
          renderHeader={this.renderHeader}
          // renderSeparator={this.renderSeparator}
          style={{flex:1, backgroundColor: 'white'}}
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
  },
  userInfo: {
    flex: 4,
    backgroundColor: '#00a2ed',
  },
  trophyRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 0,
  },
  row: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  menuContainer: {
    flex:1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  menuText: {
    fontSize: 14,
    color: 'white',
  },
  homeTheme: {
    fontSize: 16,
    marginLeft: 16,
    color: '#00a2ed'
  },
  themeItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  themeName: {
    flex: 1,
    fontSize: 16,
    marginLeft: 16,
  },
  themeIndicate: {
    marginRight: 16,
    width: 16,
    height: 16,
  },
  separator: {
    height: 1,
    backgroundColor: '#eeeeee',
  },
  scrollSpinner: {
    marginVertical: 20,
  },
  rowSeparator: {
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    height: 1,
    marginLeft: 4,
  },
  rowSeparatorHide: {
    opacity: 0.0,
  },
});


module.exports = NavigatorDrawer