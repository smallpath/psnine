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
  Animated,
  Easing,
  PanResponder,
  TouchableHighlight,
} from 'react-native';

import { connect } from 'react-redux';

import NavigatorDrawer from './NavigatorDrawer';
import SegmentedView from './SegmentedView';

import Community from './viewPagers/Community';
import Gene from './viewPagers/Gene';

import NewBattle from '../components/new/NewBattle';
import NewGene from '../components/new/NewGene';
import NewTopic from '../components/new/NewTopic';

import { changeSegmentIndex, changeCommunityType, changeGeneType } from '../actions/app';

import { standardColor, accentColor } from '../config/config';

let title = "PSNINE";
let isMounted = false;
let indexWithFloatButton = [0,3,4];
let indexWithoutFloatButton = [1,2];

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
  { title: '火星', value: 'mars',show: 'never'},
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

let titlesArr = ["社区", "问答", "游戏",  "约战", "机因"];

const ds = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2,
});

let clamp = (value,min, max) => {
  return Math.min(Math.max(value, min), max);
};


let toolbarHeight = 56;
let releasedMarginTop = 0;

class Toolbar extends Component {


  constructor(props) {
    super(props);

    this.state = {
      rotation: new Animated.Value(1),
      scale: new Animated.Value(1),
      opacity: new Animated.Value(1),
      marginTop: new Animated.Value(0),
      openTopicVal: new Animated.Value(0),
      openBattleVal: new Animated.Value(0),
      openGeneVal: new Animated.Value(0),
    }
  }

  _renderSegmentedView = () =>{
    return (
      <SegmentedView
        {...{
            communityType: this.props.app.communityType, 
            geneType: this.props.app.geneType,
            navigator:this.props.navigator, 
            toolbarDispatch: this.props.dispatch,
            segmentedIndex: this.props.app.segmentedIndex,
        }} 
        titles={titlesArr}
        index={0}
        style={styles.segmentedView}
        stretch
        switchTo={this.switchTo}
        scrollTo={this.scrollTo}
        duration={200}
        restWidth={10}
        barPosition='bottom'
        underlayColor='#000'
        barColor='#fff'
        titleStyle={{ fontSize:15 }}
        titleWidth={Dimensions.get('window').width/titlesArr.length}
        moveUpResponders = {this.panResponder}
        />
    )
  }

  componentWillReceiveProps(nextProps) {
    this.props.app = nextProps.app;
  }

  onActionSelected = (index) => {
    const { segmentedIndex } = this.props.app;
    const { dispatch } = this.props;
    if(segmentedIndex == 0){
      let type = toolbarActions[segmentedIndex][index].value;
      dispatch(changeCommunityType(type));
    }else if(segmentedIndex == 4){
      let type = toolbarActions[segmentedIndex][index].value;
      dispatch(changeGeneType(type));
    }
  }

  componentDidMount() {
        //this.parallelFadeIn(1);
  }

  componentWillMount() {
        this.panResponder = PanResponder.create({  

            onStartShouldSetPanResponderCapture: (e, gesture) =>{ 
              // console.log('1');
              return false; 
            },

            onMoveShouldSetPanResponderCapture:(e, gesture) =>{ 
              let shouldSet = Math.abs(gesture.dy) >=4;
              // console.log('2');
              return shouldSet; 
            },

            onPanResponderGrant:(e, gesture) => {
              // console.log('3');

            },
            onPanResponderMove: (e, gesture) => {
              // console.log(`====>${gesture.vy} ${gesture.vy<=5}`);
              let dy = gesture.dy;
              let vy = gesture.vy;
              if(dy < 0){
                dy = dy + releasedMarginTop;
                if(-dy <= toolbarHeight){
                  if(dy>0)
                    return;
                  this.state.marginTop.setValue(dy); 
                }
              }else{
                dy = dy + releasedMarginTop;
                if(-dy <= toolbarHeight){
                  if(dy>0)
                    return;
                  this.state.marginTop.setValue(dy); 
                }
              }
            }, 
            onPanResponderRelease: (e, gesture) => {

            },
            onPanResponderTerminationRequest : (evt, gesture) => {  
              // console.log('6');
              return true;
            },
            onPanResponderTerminate: (evt, gesture) => {  
              
            },
            onShouldBlockNativeResponder: (evt, gesture) => {  
              // console.log('8');
              return true;
            },
            onPanResponderReject: (evt, gesture) => {  
              // console.log('9');
              return false;
            },
            onPanResponderEnd: (evt, gesture) => {  
              let dy = gesture.dy;
              let vy = gesture.vy;
              
              this.state.marginTop.flattenOffset();

              let value = this.state.marginTop._value;
              let duration = 50; 

              if(vy<0){

                if(value <= -toolbarHeight/2 || -vy >= 2.0e-7){

                  Animated.timing(this.state.marginTop,{
                    toValue: -toolbarHeight,
                    duration,
                    easing: Easing.linear,
                  }).start();

                  releasedMarginTop = -toolbarHeight;

                }else{

                  Animated.timing(this.state.marginTop,{
                    toValue: 0,
                    duration,
                    easing: Easing.linear,
                  }).start();

                  releasedMarginTop = 0;
                }

              }else{

                if(value >= -toolbarHeight/2 || vy >= 2.0e-7){

                  Animated.timing(this.state.marginTop,{
                    toValue: 0,
                    duration,
                    easing: Easing.linear,
                  }).start();

                  releasedMarginTop = 0;

                }else{

                  Animated.timing(this.state.marginTop,{
                    toValue: -toolbarHeight,
                    duration,
                    easing: Easing.linear,
                  }).start();

                  releasedMarginTop = -toolbarHeight;
                }

              }

            },

        });
  }


  parallelFadeOut = (toValue) => {
    let spring = Animated.spring;
    let timing = Animated.timing;
    Animated.parallel(['opacity','rotation','scale'].map(property => {
        if(property == 'rotation' || property == 'scale'){
          return spring(this.state[property], {
                      toValue: toValue,
                      easing: Easing.elastic(2),
                 });
        }else if(property == 'opacity'){
          return timing(this.state[property], {
                      toValue: toValue,
                      delay: 200,
                      duration: 0,
                 });
        }
    })).start();
  }

  parallelFadeIn = (toValue) => {
    let spring = Animated.spring;
    let timing = Animated.timing;
    Animated.parallel(['opacity','rotation','scale'].map(property => {
        if(property == 'rotation' || property == 'scale'){
          return spring(this.state[property], {
                      toValue: toValue,
                      easing: Easing.elastic(2),
                 });
        }else if(property == 'opacity'){
          return timing(this.state[property], {
                      toValue: toValue,
                      duration: 0,
                 });
        }
    })).start();
  }

  switchTo = (fromIndex,toIndex) => {
    if (indexWithFloatButton.indexOf(fromIndex) != -1 && indexWithoutFloatButton.indexOf(toIndex) !=-1){
      
      this.parallelFadeOut(0);

    }else if(indexWithoutFloatButton.indexOf(fromIndex) != -1 && indexWithFloatButton.indexOf(toIndex) !=-1){
      
      this.parallelFadeIn(1);

    }else if(indexWithoutFloatButton.indexOf(fromIndex) != -1 && indexWithoutFloatButton.indexOf(toIndex) !=-1){

    }else if(indexWithFloatButton.indexOf(fromIndex) != -1 && indexWithFloatButton.indexOf(toIndex) !=-1){
      
      let value = this.state.rotation._value;
      if(fromIndex < toIndex)
        targetValue = value - 1/4;
      else
        targetValue = value + 1/4;
      Animated.timing(this.state.rotation, {
            toValue: targetValue,
            easing: Easing.elastic(2),
      }).start();

    }
    
  }

  scrollTo = (fromIndex,toIndex, value) => {
    if (isMounted == false){
      isMounted = true;
      return;
    }

    if (indexWithFloatButton.indexOf(fromIndex) != -1 && indexWithoutFloatButton.indexOf(toIndex) !=-1){
      
      if (fromIndex < toIndex){

        this.state.opacity.setValue(1-value);
        this.state.rotation.setValue(1-value);
        this.state.scale.setValue(1-value);

      }else{

        this.state.opacity.setValue(value);
        this.state.rotation.setValue(1-value);
        this.state.scale.setValue(value);

      }

    }else if(indexWithoutFloatButton.indexOf(fromIndex) != -1 && indexWithFloatButton.indexOf(toIndex) !=-1){
      
      if (fromIndex < toIndex){

        this.state.opacity.setValue(value);
        this.state.rotation.setValue(1-value);
        this.state.scale.setValue(value);

      }else{

        this.state.opacity.setValue(1-value);
        this.state.rotation.setValue(1-value);
        this.state.scale.setValue(1-value);

      }

    }else if(indexWithoutFloatButton.indexOf(fromIndex) != -1 && indexWithoutFloatButton.indexOf(toIndex) !=-1){

    }else if(indexWithFloatButton.indexOf(fromIndex) != -1 && indexWithFloatButton.indexOf(toIndex) !=-1){
      this.state.rotation.setValue((1-value)/4);
    }

  }

  addDefaultBackAndroidListener = () =>{
    const { navigator: _navigator } = this.props;
    let backPressClickTimeStamp = 0;
    BackAndroid.addEventListener('hardwareBackPress', function () {
      if (_navigator && _navigator.getCurrentRoutes().length > 1) {
        _navigator.pop();
        return true;
      }else{
        let timestamp = new Date();
          if(timestamp - backPressClickTimeStamp>2000){
            backPressClickTimeStamp = timestamp;
          ToastAndroid.show('再按一次退出程序',2000);
            return true;
          }else{
            return false;
          }
      }
    });
  }

  addSwitchBackListener = (AnimatedValue) =>{
    let config = {tension: 30, friction: 7};

    BackAndroid.addEventListener('hardwareBackPress', () => {
      if(AnimatedValue._value != 1)
        return true;

      Animated.spring(AnimatedValue, {toValue: 0, ...config}).start(()=>{
        BackAndroid.clearAllListeners();
        this.addDefaultBackAndroidListener();
      });

      return true;
    });
    
  }

  pressNew = () => {
    const { segmentedIndex } = this.props.app;
    if (segmentedIndex == 1 || segmentedIndex == 2)
      return;


    const { navigator: _navigator } = this.props;

    let config = {tension: 30, friction: 7};

    switch (segmentedIndex) {
      case 0 : 
        BackAndroid.clearAllListeners();
        BackAndroid.addEventListener('hardwareBackPress', ()=>true);

        setTimeout(() => {
            Animated.spring(this.state.openTopicVal, {toValue: 1, ...config}).start(()=>{
              this.addSwitchBackListener(this.state.openTopicVal);
            });
        }, 0);
        
        break;

      case 1 : 

        break;
      case 3 : 
        BackAndroid.clearAllListeners();
        BackAndroid.addEventListener('hardwareBackPress', ()=>true);

        setTimeout(() => {
          Animated.spring(this.state.openBattleVal, {toValue: 1, ...config}).start(()=>{
            this.addSwitchBackListener(this.state.openBattleVal);
          });
        }, 0);

        break;
      case 4 : 
        BackAndroid.clearAllListeners();
        BackAndroid.addEventListener('hardwareBackPress', ()=>true);
        
        setTimeout(() => {
          Animated.spring(this.state.openGeneVal, {toValue: 1, ...config}).start(()=>{
            this.addSwitchBackListener(this.state.openGeneVal);
          });
        }, 0);

        break;
        
    }


  }

  render() {
    const { app: appReducer } = this.props;
    const { segmentedIndex } = this.props.app;
    // console.log('Toolbar.js rendered');
    return (
      <Animated.View 
        style={[styles.container,{
          marginTop: this.state.marginTop,
        }]} 
      >
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
          <Animated.View 
            ref={float=>this.float=float}
            collapsable ={true}
            style={{
              width: 56,
              height: 56,
              borderRadius: 30,
              backgroundColor: accentColor,
              position:'absolute',
              bottom: 16,
              right: 16,
              elevation: 6 ,
              zIndex: 1,
              opacity: this.state.opacity,

              transform: [{
                          scale: this.state.scale,                        
                        },{
                          rotateZ: this.state.rotation.interpolate({
                            inputRange: [0,1],
                            outputRange: ['0deg', '360deg']
                          }),
                        }]
          }}>
          
          <TouchableNativeFeedback 
            onPress={this.pressNew}
            //delayPressIn={0}
            //activeOpacity={1}
            //underlayColor={accentColor}
            background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
            // onPressIn={()=>{
            //   this.float.setNativeProps({
            //     style :{
            //     elevation: 6,
            //   }});
            // }}
            // onPressOut={()=>{
            //   this.float.setNativeProps({
            //     style :{
            //     elevation: 12,
            //   }});
            // }}
            style={{
              width: 56,
              height: 56,
              borderRadius: 30,
              flex:1,
              zIndex: 1,
              backgroundColor: accentColor,
            }}>
            <View style={{borderRadius: 30,}}>
              <Image source={require('image!ic_add_white')}
                    style={{
                      left:0,
                      top:0,
                  }}
              />
            </View>
          </TouchableNativeFeedback>
          </Animated.View>
          <NewTopic 
              addDefaultBackAndroidListener={this.addDefaultBackAndroidListener}
              openVal={this.state.openTopicVal} 
              marginTop={this.state.marginTop}
          />
          <NewBattle 
              addDefaultBackAndroidListener={this.addDefaultBackAndroidListener}
              openVal={this.state.openBattleVal} 
              marginTop={this.state.marginTop}
          />
          <NewGene
              addDefaultBackAndroidListener={this.addDefaultBackAndroidListener} 
              openVal={this.state.openGeneVal} 
              marginTop={this.state.marginTop}
          />
      </Animated.View>
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
    height: toolbarHeight,
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

