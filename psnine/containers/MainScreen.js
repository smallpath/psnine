import React, { Component, PropTypes } from 'react';
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
  InteractionManager,
} from 'react-native';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
	getTopicList,
	changeTopicListRefreshing,
	changeTopicListLoadingMore,
  changePageNumberToDefault,
  changePageNumberIncreasing,
} from '../actions/mainScreen.js';

import NavigatorDrawer from '../components/NavigatorDrawer';
import SegmentedView from '../components/SegmentedView';
import Topic from './Topic';

import { getTopicURL } from '../dao/dao';
import moment from '../utils/moment';

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
const ds = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
});

class MainScreen extends Component {
  constructor(props){
    super(props);

    this.state = {

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

 _renderSeparator(sectionID: number, rowID: number, adjacentRowHighlighted: bool) { 
   return ( 
     <View 
      key={`${sectionID}-${rowID}`} 
      style={{ height: adjacentRowHighlighted ? 4 : 1, backgroundColor: adjacentRowHighlighted ? '#3B5998' : '#CCCCCC', }} 
      /> 
      ); 
    }


	_onRowPressed = (rowData)=>{
		const { navigator } = this.props;
		const URL = getTopicURL(rowData.id);
		console.log("打开WebView",URL);
		if(navigator) {
			navigator.push({
			    component: Topic,
			    params: {
            URL,
			    	rowData
			    }
			});
		}
	}

  _renderRow = (rowData,    
    sectionID: number | string,
    rowID: number | string,
    highlightRow: (sectionID: number, rowID: number) => void
    )=>{

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
      <View rowID={ rowID }>
        <TouchableElement  onPress={()=>this._onRowPressed(rowData)}>
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
        </TouchableElement>
      </View>
    )
  }

  componentWillReceiveProps (nextProps) {

    // Object.keys(nextProps.mainScreen).forEach((item,index)=>{
    //   if(item!='topics') 
    //     console.log('153-->',item,nextProps.mainScreen[item])

    // });

    this.props.mainScreen = nextProps.mainScreen;
  
  }


  componentDidMount = ()=> {
    this._onRefresh();
  }

  _onRefresh = () => { 
    const { mainScreen:reducer, dispatch } = this.props;

    if(reducer.isLoadingMore || reducer.isRefreshing)
      return;

    dispatch(getTopicList(1));

    // Object.keys(reducer).forEach((item,index)=>{
    //   if(item!='topics') 
    //     console.log('187-->',item,reducer[item])

    // });
  }

  _loadMoreData = () => {

		const { mainScreen:reducer, dispatch } = this.props;

    // Object.keys(reducer).forEach((item,index)=>{
    //   if(item!='topics') 
    //     console.log('198-->',item,reducer[item])

    // });

		let page = reducer.topicPage + 1;
		dispatch(getTopicList(page));

  }

  _onEndReached = () => { 
    const { mainScreen:reducer } = this.props;

    if(reducer.isLoadingMore || reducer.isRefreshing)
      return;

		InteractionManager.runAfterInteractions(() => {
			  this._loadMoreData();
    });

  }

  render(){
    const { mainScreen:reducer } = this.props;
    return (
      <View style={styles.container}> 
        <ToolbarAndroid
          navIcon={require('image!ic_menu_white')}
          title={title}
          style={styles.toolbar}
          actions={toolbarActions}
          onIconClicked={this.props._callDrawer()}
        />
        {this._renderSegmentedView()}
        <ListView
          refreshControl={ 
            <RefreshControl 
              refreshing={reducer.isRefreshing || reducer.isLoadingMore } 
              onRefresh={this._onRefresh} 
            />
          }
          pageSize = {32}
          removeClippedSubviews={false} 
          onEndReached={this._onEndReached}
          onEndReachedThreshold={10}
          dataSource={ ds.cloneWithRows(reducer.topics) }
          renderRow={this._renderRow}
          renderSeparator={this._renderSeparator}
        />
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

// MainScreen.propTypes = {
//   topics: PropTypes.object,
//   segmentedIndex: PropTypes.number,
//   topicPage: PropTypes.number,
//   isRefreshing: PropTypes.bool,
//   isLoadingMore: PropTypes.bool,
//   indicatorShouldShow: PropTypes.bool,
// };

const dataSource = new ListView.DataSource({
  rowHasChanged: (r1, r2) => r1 !== r2,
});

export default MainScreen;
