/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  ListView,
  Image,
  DrawerLayoutAndroid,
  ToolbarAndroid,
  ToastAndroid,
  BackAndroid,
  TouchableOpacity,
  Dimensions,
  TouchableNativeFeedback,
  RefreshControl,
} from 'react-native';

let DRAWER_REF = 'drawer';
let DRAWER_WIDTH_LEFT = 100;
let toolbarActions = [
  {title: '搜索', show: 'always'},
  {title: '全部', show: 'never'},
  {title: '新闻', show: 'never'},
  {title: '攻略', show: 'never'},
  {title: '测评', show: 'never'},
  {title: '心得', show: 'never'},
  {title: 'Plus', show: 'never'},
  {title: '二手', show: 'never'},
  {title: '开箱', show: 'never'},
  {title: '游列', show: 'never'},
  {title: '活动', show: 'never'},
];

let title = "PSNINE";

import NavigatorDrawer from '../components/NavigatorDrawer';
import SegmentedView from '../components/SegmentedView';
import { fetchTopics } from '../dao/dao';
import moment from 'moment';
moment().format();

moment.locale('en', {
    relativeTime : {
        future: "后 %s",
        past:   "%s前",
        s:  "秒",
        m:  "1分钟",
        mm: "%d 分钟",
        h:  "1小时",
        hh: "%d小时",
        d:  "1天",
        dd: "%d天",
        M:  "1月",
        MM: "%d月",
        y:  "1年",
        yy: "%d年"
    }
});

let navigationView = ( 
        <View style={{flex: 1, backgroundColor: '#fff'}}> 
            <Text style={{margin: 10, fontSize: 15, textAlign: 'left'}}>I'm in the Drawer!</Text> 
        </View> );

class Psnine extends Component {
  constructor(props){
    super(props);
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      index:0,
      page:0,
      refreshing: false,
      dataSource: ds.cloneWithRows([
        'John', 'Joel', 'James', 'Jimmy', 'Jackson', 'Jillian', 'Julie', 'Devin'
      ]),
      rowCache: [],
    }
  }
  _renderSegmentedView(){
    return (
      <SegmentedView
          titles={["社区","游戏","Store","约战","机因"]}
          index={this.state.index}
          style={styles.segmentedView}
          stretch
          duration={500}
          barPosition='bottom'
          underlayColor='#000'
          barColor='#fff'
          onPress={index => this.setState({ index })}
      />
    )
  }

  _renderNavigationView(){
    return (<NavigatorDrawer/>)
  }

  componentDidMount() {
    this.fetchTopics();
  }

 _onRefresh() { 
  this.setState({refreshing: true}); 
  this.fetchTopics().then( this.setState({refreshing: false}));
}

  fetchTopics(){
    return fetchTopics().then(topics =>{ 
      let ds = this.state.dataSource.cloneWithRows(topics.data);
      this.setState({
          page:1,
          dataSource: ds,
          rowCache: [...this.state.rowCache,...topics.data]
      });
    })
  }
 _renderSeparator(sectionID: number, rowID: number, adjacentRowHighlighted: bool) { 
   return ( 
     <View 
      key={`${sectionID}-${rowID}`} 
      style={{ height: adjacentRowHighlighted ? 4 : 1, backgroundColor: adjacentRowHighlighted ? '#3B5998' : '#CCCCCC', }} 
      /> 
      ); 
    }
  _renderRow(rowData){

    let uri;
    if(rowData.profilepicture == ''){    
      let path = rowData.avatar.toString().replace('\\','');
      uri = `http://photo.d7vg.com/avatar/${path}.png@50w.png`;
    }else{
      uri = `http://photo.d7vg.com/avaself/${rowData.psnid}.png@50w.png`;
    }
    let time = parseInt(rowData.date);
    time*=1000;
    let date = new Date(time);
    let fromNow = moment(date).fromNow();
    let TouchableElement = TouchableNativeFeedback;
    return (
      <View>

        <View style={{flex: 1,flexDirection: 'row', alignItems: 'center', padding: 10}}>
          <Image 
            source={{uri: uri}}
            style={styles.avatar}
          />

          <View style={{marginLeft: 10,flex: 1,flexDirection: 'column',margin: 0}}>
            <Text 
              ellipsizeMode={'head'}
              numberOfLines={3}
              style={{color: 'black',}}>
              {rowData.title}
            </Text>

            <View style={{flex: 1,flexDirection: 'row', justifyContent: 'center',alignItems:'flex-end',paddingTop:5,}}>
              <Text style={{flex: 1,flexDirection: 'row'}}>{rowData.psnid}</Text>
              <Text style={{flex: 1,flexDirection: 'row'}}>{fromNow}</Text>
              <Text style={{flex: 1,flexDirection: 'row'}}>{rowData.views}浏览</Text>
            </View>

          </View>

        </View>

      </View>
    )
  }
  _onEndReached(){
    if(!this)
      return;

    if(this.state.refreshing == true)
      return;

    this.setState({
      refreshing: true
    });
    fetchTopics(this.state.page+1).then(topics =>{ 
      console.log(typeof this.state.dataSource);
      let pre = this.state.rowCache;
      let mergedArr = [...pre,...topics.data];
      let ds = this.state.dataSource.cloneWithRows(mergedArr);
      this.setState({
          page: this.state.page+1,
          dataSource: ds,
          refreshing: false,
          rowCache: mergedArr,
      });
    }).catch(err=>{
      console.log(err);
      this.setState({
          refreshing: false
      });
    })

  }
  render() {
    return ( 
      <DrawerLayoutAndroid 
            ref={DRAWER_REF}
            drawerWidth={Dimensions.get('window').width - DRAWER_WIDTH_LEFT} 
            drawerPosition={DrawerLayoutAndroid.positions.Left} 
            renderNavigationView={this._renderNavigationView}> 
                <View style={styles.container}> 
                  <ToolbarAndroid
                    navIcon={require('image!ic_menu_white')}
                    title={title}
                    style={styles.toolbar}
                    actions={toolbarActions}
                    onIconClicked={()=> this.refs[DRAWER_REF].openDrawer()}
                  />
                  {this._renderSegmentedView()}
                  <ListView
                    refreshControl={ 
                      <RefreshControl 
                        refreshing={this.state.refreshing} 
                        onRefresh={this._onRefresh.bind(this)} 
                      />
                    }
                    onEndReached={this._onEndReached.bind(this)}
                    dataSource={this.state.dataSource}
                    renderRow={this._renderRow}
                    renderSeparator={this._renderSeparator}
                  />
                </View> 
      </DrawerLayoutAndroid> 
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#F5FCFF',
  },
  toolbar: {
    backgroundColor: '#00a2ed',
    height: 56,
  },
  segmentedView: {
    backgroundColor: '#F5FCFF',
  },
  selectedTitle:{
    //backgroundColor: '#00ffff'
    //fontSize: 20
  },
  avatar: {
    width: 50,
    height: 50,
  }
});


module.exports = Psnine;
