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
  ToolbarAndroid,
} from 'react-native';

import { connect } from 'react-redux';
import { getTopicList } from '../../actions/community.js';
import { standardColor, nodeColor, idColor  } from '../../config/colorConfig';

import CommunityTopic from '../../components/CommunityTopic';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { getTopicURL, fetchMessages,  } from '../../dao/dao';
import moment from '../../utils/moment';

const ds = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2,
});

let toolbarActions = [];

class Message extends Component {
    constructor(props){
        super(props);
        this.state = {
            messages: [],
            isLoading: true,
            icon: false
        }
    }

  onNavClicked = (rowData) => {
    const { navigator } = this.props;
    if (navigator) {
      navigator.pop();
    }
  }

  _pressRow = (rowData) => {
    const { navigator } = this.props;
    let URL = rowData.id;
    navigator.push({
      component: CommunityTopic,
      params: {
        URL,
        title: rowData.content,
        rowData
      }
    });
  }


  _renderRow = (rowData,
    sectionID: number | string,
    rowID: number | string,
    highlightRow: (sectionID: number, rowID: number) => void
  ) => {

    let TouchableElement = TouchableNativeFeedback;

    return (
      <View rowID={ rowID } style={{              
            marginTop: 7,
            backgroundColor: this.props.modeInfo.backgroundColor,
            elevation: 1,
        }}>
        <TouchableElement  
          delayPressIn={0}
          background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
          onPress={()=>this._pressRow(rowData)}
          >
          <View pointerEvents='box-only' style={{ flex: 1, flexDirection: 'row',  padding: 12 }}>
            {/*<Image
              source={{ uri: uri }}
              style={styles.avatar}
              />*/}

            <View style={{ marginLeft: 10, flex: 1, flexDirection: 'column'}}>
              <Text
                ellipsizeMode={'tail'}
                numberOfLines={3}
                style={{ flex: 2.5,color: this.props.modeInfo.titleTextColor, }}>
                {rowData.content}
              </Text>

              <View style={{ flex: 1.1, flexDirection: 'row', justifyContent :'space-between' }}>
                <Text style={{ flex: -1, color: idColor,textAlign : 'center', textAlignVertical: 'center' }}>{rowData.from}</Text>
                {/*<Text style={{ flex: -1,color: this.props.modeInfo.titleTextColor,textAlign : 'center', textAlignVertical: 'center' }}>{fromNow}</Text>*/}
              </View>

            </View>

          </View>
        </TouchableElement>
      </View>
    )
  }

  componentWillMount = async () => {
      this.fetchMessages();
  }

  fetchMessages = async () => {
    const data = await fetchMessages(this.props.psnid);
    this.setState({
        messages: data,
        isLoading: false
    });
  }

  render(){
    // console.log('Message.js rendered');
    return (
      <View 
        style={{flex:1,backgroundColor:this.props.modeInfo.backgroundColor}}
        onStartShouldSetResponder={() => false}
        onMoveShouldSetResponder={() => false}
        >
          <Ionicons.ToolbarAndroid
            navIconName="md-arrow-back"
            overflowIconName="md-more"
            iconColor={this.props.modeInfo.isNightMode ? '#000' : '#fff'}
            title={'我的消息'}
            style={[styles.toolbar, {backgroundColor: this.props.modeInfo.standardColor}]}
            actions={toolbarActions}
            onIconClicked={this.onNavClicked}
          />
          <ListView
            refreshControl={
              <RefreshControl
                refreshing={this.state.isLoading}
                onRefresh={this.fetchMessages}
                colors={[standardColor]}
                progressBackgroundColor={this.props.modeInfo.backgroundColor}
                />
            }
            pageSize = {32}
            removeClippedSubviews={false}
            enableEmptySections={true}
            dataSource={ ds.cloneWithRows(this.state.messages) }
            renderRow={this._renderRow}
            />
      </View>     
    )
  }

}

const styles = StyleSheet.create({
  avatar: {
    width: 50,
    height: 50,
  },
  toolbar: {
    backgroundColor: standardColor,
    height: 56,
    elevation: 4,
  },
});


// function mapStateToProps(state) {
//     return {
//       community: state.community,
//     };
// }

// export default connect(
//   mapStateToProps
// )(Community);

export default Message;
