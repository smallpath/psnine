import React, { Component } from 'react';
import {
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

import NavigatorDrawer from './NavigatorDrawer';
import SegmentedView from './SegmentedView';

import Community from './viewPagers/Community';
import Gene from './viewPagers/Gene';

import { changeSegmentIndex, changeCommunityType, changeGeneType } from '../actions/app';

import { standardColor } from '../config/config';


let title = "PSNINE";

let communityActions = [
  { title: '搜索', icon: require('image!ic_search_white'), value: '', show: 'always'},
  { title: '全部', value: '', show: 'never' },
  { title: '新闻', value: 'news',show: 'never' },
  { title: '攻略', value: 'guide',show: 'never' },
  { title: '测评', value: 'review',show: 'never' },
  { title: '心得', value: 'plus',show: 'never' },
  { title: 'Plus', value: 'exp',show: 'never' },
  { title: '开箱', value: 'openbox',show: 'never' },
  { title: '游列', value: 'gamelist',show: 'never' },
  { title: '活动', value: 'event',show: 'never' },
];

let gameActions = [
  { title: '搜索', icon: require('image!ic_search_white') , show: 'always'},
];

let rankActions = [
  { title: '搜索', icon: require('image!ic_search_white') , show: 'always'},
];

let battleActions = [
  { title: '搜索', icon: require('image!ic_search_white') , show: 'always'},
];

let geneActions = [
  { title: '搜索', icon: require('image!ic_search_white') ,value: '', show: 'always'},
  { title: '全部', value: 'all', show: 'never' },
  { title: '图文类',value: 'photo', show: 'never' },
  { title: '音乐类',value: 'music', show: 'never' },
  { title: '影视类',value: 'movie', show: 'never' },
  { title: '视频类',value: 'video', show: 'never' },
];

let toolbarActions = [communityActions,gameActions,rankActions,battleActions,geneActions]

let titlesArr = ["社区", "游戏", "排行", "约战", "机因"];

const ds = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2,
});

class Toolbar extends Component {
  constructor(props) {
    super(props);
  }

  _renderSegmentedView = () =>{
    return (
      <SegmentedView
        {...{
            communityType: this.props.app.communityType, 
            geneType: this.props.app.geneType,
            navigator:this.props.navigator, 
            toolbarDispatch: this.props.dispatch
        }} 
        titles={titlesArr}
        index={0}
        style={styles.segmentedView}
        stretch
        duration={200}
        restWidth={10}
        barPosition='bottom'
        underlayColor='#000'
        barColor='#fff'
        titleWidth={Dimensions.get('window').width/titlesArr.length}
        />
    )
  }

  componentWillReceiveProps(nextProps) {
    this.props.app = nextProps.app;
  }

  componentDidMount = () => {
    //const { app: appReducer,dispatch } = this.props;
    //dispatch(changeSegmentIndex(appReducer.segmentedIndex));
  }

  onActionSelected = (index) => {
    const { segmentedIndex } = this.props.app;
    const { dispatch } = this.props;
    if(segmentedIndex == 0){
      let type = toolbarActions[segmentedIndex][index].value;
      dispatch(changeCommunityType(type))
    }else if(segmentedIndex == 4){
      let type = toolbarActions[segmentedIndex][index].value;
      dispatch(changeGeneType(type))
    }
  }

  render() {
    const { app: appReducer } = this.props;
    // console.log('Toolbar.js rendered');
    return (
      <View style={styles.container}>
        <ToolbarAndroid
          navIcon={require('image!ic_menu_white') }
          title={title}
          style={styles.toolbar}
          titleColor="white"
          overflowIcon={require('image!ic_more_white')}
          actions={toolbarActions[appReducer.segmentedIndex]}
          onActionSelected={this.onActionSelected}
          onIconClicked={this.props._callDrawer() }
          />
        {this._renderSegmentedView() }
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
    backgroundColor: standardColor,
    height: 56,
    elevation: 4,
  },
  segmentedView: {
    backgroundColor: '#F5FCFF',
  },
  selectedTitle: {
    //backgroundColor: '#00ffff'
    //fontSize: 20
  },
  avatar: {
    width: 50,
    height: 50,
  }
});

function mapStateToProps(state) {
    return {
      app: state.app,
    };
}

export default connect(
  mapStateToProps
)(Toolbar);

