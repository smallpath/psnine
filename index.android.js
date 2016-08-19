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

import NavigatorDrawer from './NavigatorDrawer';
import SegmentedView from './SegmentedView';
import { fetchTopics } from './Dao';

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
      dataSource: ds.cloneWithRows([
        'John', 'Joel', 'James', 'Jimmy', 'Jackson', 'Jillian', 'Julie', 'Devin'
      ])
    }
  }
  _renderSegmentedView(){
    return (
      <SegmentedView
          titles={[
            {title:"社区"},
            {title:"游戏"},
            {title:"Store"},
            {title:"约战"},
            {title:"机因"}
          ]}
          index={this.state.index}
          style={styles.segmentedView}
          stretch
          barPosition='bottom'
          underlayColor='#000'
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

  fetchTopics(){
    fetchTopics().then(topics =>{ 
      let ds = this.state.dataSource.cloneWithRows(topics.data);
      console.log(ds);
      this.setState({
          dataSource: ds,
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
    let uri = `http://photo.d7vg.com/avatar/${rowData.avatar}.png@50w.png`;
    let date = rowData.date;
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
              numberOfLines={3}>
              {rowData.title}
            </Text>

            <View style={{flex: 1,flexDirection: 'row',paddingTop:5,}}>
              <Text style={{flex: 1,flexDirection: 'row'}}>{rowData.psnid}</Text>
              <Text style={{flex: 1,flexDirection: 'row'}}>{date}</Text>
              <Text style={{flex: 1,flexDirection: 'row'}}>{rowData.views}浏览</Text>
            </View>

          </View>

        </View>

      </View>
    )
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
                  <ListView
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
    //backgroundColor: '#0000ff',
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

AppRegistry.registerComponent('Psnine', () => Psnine);
