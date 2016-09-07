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
} from 'react-native';

import { connect } from 'react-redux';
import { getBattleList } from '../../actions/battle.js';
import { standardColor, nodeColor, idColor, accentColor  } from '../../config/config';

import CommunityTopic from '../../components/CommunityTopic';

import { getBattleURL, getGamePngURL } from '../../dao/dao';
import moment from '../../utils/moment';

let getSectionData = (dataBlob, sectionID) => {
  return dataBlob[sectionID];
};
let getRowData = (dataBlob, sectionID, rowID) => {
  return dataBlob[rowID];
};

const dataSource = new ListView.DataSource({
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

    let uri;
    if (rowData.profilepicture == '') {
      let path = rowData.avatar.toString().replace('\\', '');
      uri = `http://photo.d7vg.com/avatar/${path}.png@50w.png`;
    } else {
      uri = `http://photo.d7vg.com/avaself/${rowData.psnid}.png@50w.png`;
    }
    let time = parseInt(rowData.startdate);
    time *= 1000;
    let date = new Date(time);
    let startTime = moment(date).format('HH:mm');

    let title = rowData.cnname == '' ? rowData.title : rowData.cnname;

    let TouchableElement = TouchableNativeFeedback;

    return (
      <View rowID={ rowID } style={{              
            marginTop: rowID.indexOf('R0') == -1 ? 0:0,
            marginLeft: 7,
            marginRight: 7,
            backgroundColor: '#FFFFFF',
            elevation: 2,
        }}>
        <TouchableElement  
          onPress ={()=>{this._onRowPressed(rowData)}}
          delayPressIn={100}
          background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
          >
          <View style={{ flex: 1, flexDirection: 'row',  padding: 12 }}>
            <Image
              source={{ uri: getGamePngURL(rowData.gid) }}
              style={{
                width: 91,
                height: 50,
                alignSelf: 'center',
              }}
              />

            <View style={{ marginLeft: 10, flex: 1, flexDirection: 'column'}}>
              <Text
                ellipsizeMode={'tail'}
                numberOfLines={1}
                style={{ flex: -1,color: 'black', fontSize: 15 }}>
                { title }
              </Text>

              <Text>
                <Text style={{ flex: -1,color: 'black' }} numberOfLines={1}>{startTime}</Text>
                <Text style={{ flex: -1 }} numberOfLines={1}> 开始</Text>
              </Text>

              <Text>
                <Text style={{ flex: -1,color: 'black' }} numberOfLines={1}>{rowData.num}</Text>
                <Text style={{ flex: -1 }} numberOfLines={1}> 人招募</Text>
              </Text>

              <View style={{ flex: 1, flexDirection: 'row', justifyContent :'space-between' }}>
                <Text style={{ flex: -1,textAlign : 'center', textAlignVertical: 'center' }}>{rowData.platform.split(',').join(' ')}</Text>
                <Text style={{ flex: -1, color: idColor, marginRight: -60 , textAlignVertical: 'center' }}>{rowData.psnid}</Text>
              </View>

            </View>


            <Image
              source={{ uri: uri }}
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
        width:200,
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
      if (localName == 'day1'){
        localName = '今天  ' + moment().format('YYYY年MM月DD日');
      }else if(localName == 'day2'){
        localName = '明天  '  + moment().add(1,'days').format('YYYY年MM月DD日');
      }else if(localName == 'day3'){
        localName = '后天  ' + moment().add(2,'days').format('YYYY年MM月DD日');
      }else{
        localName = moment().add(parseInt(localName.replace('day','')),'days').format('YYYY年MM月DD日');
      }
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
              />
          }
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
