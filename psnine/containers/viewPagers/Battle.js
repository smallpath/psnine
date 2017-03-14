import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  Image,
  ToastAndroid,
  Dimensions,
  TouchableNativeFeedback,
  RefreshControl,
  InteractionManager,
  PanResponder
} from 'react-native';

import { connect } from 'react-redux';
import { getBattleList } from '../../actions/battle.js';
import { standardColor, nodeColor, idColor, accentColor  } from '../../config/colorConfig';

import CommunityTopic from '../../components/CommunityTopic';

import { getBattleURL, getGamePngURL } from '../../dao/dao';
import moment from '../../utils/moment';

let toolbarHeight = 56;
let releasedMarginTop = 0;

let getSectionData = (dataBlob, sectionID) => {
  return dataBlob[sectionID];
};
let getRowData = (dataBlob, sectionID, rowID) => {
  return dataBlob[rowID];
};

let dataSource = new ListView.DataSource({
  getRowData: getRowData,
  getSectionHeaderData: getSectionData,
  rowHasChanged: (row1, row2) => row1.id !== row2.id,
  sectionHeaderHasChanged: (s1, s2) => s1 !== s2,
});

class Battle extends Component {
  constructor(props){
      super(props);
  }

  _renderSeparator(sectionID: number, rowID: number, adjacentRowHighlighted: bool) {
    return (
      <View
        key={`${sectionID}-${rowID}`}
        style={{ height: 1,backgroundColor: 'rgba(0, 0, 0, 0.1)',marginLeft:10,marginRight:10}}
        />
    );
  }

  _onRowPressed = (rowData) => {
    const { navigator } = this.props;
    const URL = getBattleURL(rowData.id);
    if (navigator) {
      navigator.push({
        component: CommunityTopic,
        params: {
          URL,
          title: rowData.title,
          rowData
        }
      });
    }
  }


  _renderRow = (rowData,
    sectionID: number | string,
    rowID: number | string,
    highlightRow: (sectionID: number, rowID: number) => void
  ) => {
    // console.log(rowData)

    let TouchableElement = TouchableNativeFeedback;

    return (
      <View rowID={ rowID } style={{              
            marginTop: rowID.indexOf('R0') == -1 ? 0:0,
            marginLeft: 7,
            marginRight: 7,
            backgroundColor: this.props.modeInfo.backgroundColor,
            elevation: 2,
        }}>
        <TouchableElement  
          onPress ={()=>{this._onRowPressed(rowData)}}
          delayPressIn={100}
          background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
          >
          <View style={{ flex: -1, flexDirection: 'row',  padding: 12 }}>
            <View style={{ 
              flex: 1, 
              flexDirection: 'column',
              marginLeft: -2,
              alignSelf: 'center'
              }}>
              <Image
                source={{ uri: rowData.avatar }}
                style={{
                  width: 91,
                  height: 50,
                  alignSelf: 'center',
                }}
                />
              <Text style={{ flex: -1, color: idColor, textAlign: 'center', textAlignVertical: 'center' }}>{rowData.game}</Text>
            </View>

            <View style={{ marginLeft: 10, flex: 2, flexDirection: 'column'}}>
              <Text
                ellipsizeMode={'tail'}
                numberOfLines={1}
                style={{ flex: -1,color: this.props.modeInfo.titleTextColor, fontSize: 15 }}>
                { rowData.title }
              </Text>

              <Text>
                <Text style={{ flex: -1,color: this.props.modeInfo.titleTextColor }} numberOfLines={1}>{rowData.date}</Text>
                <Text style={{ flex: -1, color: this.props.modeInfo.standardTextColor }} numberOfLines={1}> 开始</Text>
              </Text>

              <Text>
                <Text style={{ flex: -1,color: this.props.modeInfo.titleTextColor }} numberOfLines={1}>{rowData.num}</Text>
                <Text style={{ flex: -1,color: this.props.modeInfo.standardTextColor }} numberOfLines={1}> 人招募</Text>
              </Text>

              <View style={{ flex: 1, flexDirection: 'row', justifyContent :'space-between' }}>
                <Text style={{ flex: -1,color: this.props.modeInfo.standardTextColor,textAlign : 'center', textAlignVertical: 'center' }}>{rowData.platform.join(' ')}</Text>
                <Text style={{ flex: -1, color: idColor, marginRight: -60 , textAlignVertical: 'center' }}>{rowData.psnid}</Text>
              </View>

            </View>


            <Image
              source={{ uri: rowData.gameAvatar }}
              style={[styles.avatar,{marginLeft: 10}]}
              />

          </View>
        </TouchableElement>
      </View>
    )
  }

  _renderSectionHeader = (sectionData: string, sectionID: string) => {
    return (
      <View style={{
        //backgroundColor: nodeColor,
        flex: -1, left:0,
        height:25, 
        width:300,
        elevation: 0, 
        marginTop: sectionID == 'day1'? 7: 14,
        marginLeft: 7,
        marginBottom: 7,
        }}>
        <Text numberOfLines={1}
          style={{fontSize: 20, color:idColor,textAlign : 'left', lineHeight:25, marginLeft: 2,marginTop: 2 }}
        >
          {sectionData}
        </Text>
      </View>
    );
  };


  componentWillReceiveProps(nextProps) {
    if(this.props.modeInfo.isNightMode != nextProps.modeInfo.isNightMode ){
      this.props.modeInfo == nextProps.modeInfo;
      dataSource = dataSource.cloneWithRows([]);
      this._onRefresh();
    }
  }

  componentWillMount() {
    const { dispatch } = this.props;
    const ref = this
    let currentScrolling = false;
    const setMarginTop = this.props.setMarginTop
    this.panResponder = PanResponder.create({  

        onStartShouldSetPanResponderCapture: (e, gesture) =>{ 
          return true; 
        },

        onMoveShouldSetPanResponderCapture:(e, gesture) =>{ 
          let shouldSet = Math.abs(gesture.dy) >=4;
          return shouldSet; 
        },

        onPanResponderGrant: (e, gesture) => {
          if (currentScrolling === false) {
            currentScrolling = true;
            this.refreshControl._nativeRef.setNativeProps({
              enabled: false,
            });
            this.listView.setNativeProps({
              scrollEnabled: false,
            });
          }
        },
        onPanResponderMove: (e, gesture) => {
          let dy = gesture.dy;
          let vy = gesture.vy;
          if(dy < 0){
            dy = dy + setMarginTop(null, null, true);
            if(-dy <= toolbarHeight && dy <= 0){
              setMarginTop(dy)
            } else {
              setMarginTop(-toolbarHeight)
              if (currentScrolling === true) {
                currentScrolling = false;
                this.refreshControl._nativeRef.setNativeProps({
                  enabled: true,
                });
                this.listView.setNativeProps({
                  scrollEnabled: true,
                });
              }
            }
          }else{
            dy = dy + setMarginTop(null, null, true);
            if(-dy <= toolbarHeight && dy <= 0){ 
              setMarginTop(dy)
            } else {
              setMarginTop(0)
              if (currentScrolling === true) {
                currentScrolling = false;
                // dispatch(changeScrollType(false))
                this.refreshControl._nativeRef.setNativeProps({
                  enabled: true,
                });
                this.listView.setNativeProps({
                  scrollEnabled: true,
                });
              }
            }
          }
        }, 
        onPanResponderRelease: (e, gesture) => {
          // console.log('onPanResponderRelease\n======')
          const releasedMarginTop = setMarginTop(null, null, true)
          if (releasedMarginTop === 0 || releasedMarginTop === -toolbarHeight) {
            if (currentScrolling === true) {
              currentScrolling = false;
              // dispatch(changeScrollType(false))
                this.refreshControl._nativeRef.setNativeProps({
                  enabled: true,
                });
                this.listView.setNativeProps({
                  scrollEnabled: true,
                });
            }
          }
        },
        onPanResponderTerminationRequest : (evt, gesture) => {  
          // console.log('onPanResponderTerminationRequest')
          return true;
        },
        onPanResponderTerminate: (evt, gesture) => {  
          // console.log('onPanResponderTerminate')
        },
        onShouldBlockNativeResponder: (evt, gesture) => {  
          // console.log('onShouldBlockNativeResponder')
          return false;
        },
        onPanResponderReject: (evt, gesture) => {  
          // console.log('onPanResponderReject')
          return false;
        },
        onPanResponderEnd: (evt, gesture) => {  
          // console.log('onPanResponderEnd')
          let dy = gesture.dy;
          let vy = gesture.vy;
          
          setMarginTop(null, true)

          const releasedMarginTop = setMarginTop(null, null, true)
          if (releasedMarginTop === 0 || releasedMarginTop === -toolbarHeight) {
            if (currentScrolling === true) {
              currentScrolling = false;
              // dispatch(changeScrollType(false))
                this.refreshControl._nativeRef.setNativeProps({
                  enabled: true,
                });
                this.listView.setNativeProps({
                  scrollEnabled: true,
                });
            }
          }
        },

    });
  }

  componentDidMount = () => {
    const { battle: battleReducer } = this.props;
    // if (battleReducer.battles.length == 0)
      this._onRefresh();
  }

  _onRefresh = (type = '') => {
    const { battle: battleReducer, dispatch } = this.props;

    dispatch(getBattleList());
  }

  render(){
    const { battle: battleReducer } = this.props;
    let data = battleReducer.battles;

    let keys = Object.keys(data);
    let NUM_SECTIONS = keys.length;

    let dataBlob = {};
    let sectionIDs = [];
    let rowIDs = [];

    for (let i = 0; i < NUM_SECTIONS; i++) {
      let sectionName = keys[i];
      let localName = sectionName;
      sectionIDs.push(sectionName);
      dataBlob[sectionName] = localName;
      rowIDs[i] = [];
      let rows = data[sectionName];
      let NUM_ROWS = rows.length;

      for (let j = 0; j < NUM_ROWS; j++) {
        let rowName = 'S' + i + ', R' + j;
        rowIDs[i].push(rowName);
        dataBlob[rowName] = rows[j];
      }
    }

    dataSource = dataSource.cloneWithRowsAndSections(dataBlob, sectionIDs, rowIDs);
    // console.log('Community.js rendered');
    return (
        <ListView
          refreshControl={
            <RefreshControl
              refreshing={false}
              onRefresh={this._onRefresh}
              colors={[standardColor]}
              ref={ ref => this.refreshControl = ref}
              progressBackgroundColor={this.props.modeInfo.backgroundColor}
              />
          }
          {...this.panResponder.panHandlers}
          ref={listView=>this.listView=listView}
          style={{backgroundColor: this.props.modeInfo.brighterLevelOne}}
          pageSize = {32}
          removeClippedSubviews={false}
          enableEmptySections={true}
          dataSource={ dataSource }
          renderSectionHeader = {this._renderSectionHeader}
          renderRow={this._renderRow}
          />
    )
  }

}

const styles = StyleSheet.create({
  avatar: {
    width: 50,
    height: 50,
  }
});


function mapStateToProps(state) {
    return {
      battle: state.battle,
    };
}

export default connect(
  mapStateToProps
)(Battle);
