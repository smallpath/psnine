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

import NavigatorDrawer from '../components/NavigatorDrawer';
import SegmentedView from '../components/SegmentedView';

import Community from './Community';
import Gene from './Gene';

import { changeSegmentIndex } from '../actions/app';


let title = "PSNINE";

let communityActions = [
  { title: '搜索', icon: require('image!ic_search_white') , show: 'always'},
  { title: '全部', show: 'never' },
  { title: '新闻', show: 'never' },
  { title: '攻略', show: 'never' },
  { title: '测评', show: 'never' },
  { title: '心得', show: 'never' },
  { title: 'Plus', show: 'never' },
  { title: '二手', show: 'never' },
  { title: '开箱', show: 'never' },
  { title: '游列', show: 'never' },
  { title: '活动', show: 'never' },
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
  { title: '搜索', icon: require('image!ic_search_white') , show: 'always'},
  { title: '全部', show: 'never' },
  { title: '图文类', show: 'never' },
  { title: '音乐类', show: 'never' },
  { title: '影视类', show: 'never' },
  { title: '视频类', show: 'never' },
];

let toolbarActions = [communityActions,gameActions,rankActions,battleActions,geneActions]

let titlesArr = ["社区", "游戏", "排行", "约战", "机因"];

const ds = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2,
});

class Toolbar extends Component {
  constructor(props) {
    super(props);

    this.state = {
      segmentedIndex: 0,
    }

  }

  _renderSegmentedView = () =>{
    return (
      <SegmentedView
        {...{navigator:this.props.navigator, toolbarDispatch: this.props.dispatch}} 
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

  render() {
    const { app: appReducer } = this.props;
    console.log('Toolbar.js rendered');
    return (
      <View style={styles.container}>
        <ToolbarAndroid
          navIcon={require('image!ic_menu_white') }
          title={title}
          style={styles.toolbar}
          titleColor="white"
          overflowIcon={require('image!ic_more_white')}
          actions={toolbarActions[appReducer.segmentedIndex]}
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
    backgroundColor: '#00a2ed',
    height: 56,
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

