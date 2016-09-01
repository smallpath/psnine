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
import { getTopicList } from '../../actions/community.js';
import { standardColor, nodeColor, idColor  } from '../../config/config';

import CommunityTopic from '../../components/CommunityTopic';

import { getTopicURL, fetchMessages } from '../../dao/dao';
import moment from '../../utils/moment';

const ds = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2,
});

class Message extends Component {
    constructor(props){
        super(props);
        this.state = {
            messages: [],
        }
    }

  _onRowPressed = (rowData) => {
    // const { navigator } = this.props;
    // const URL = getTopicURL(rowData.id);
    // if (navigator) {
    //   navigator.push({
    //     component: CommunityTopic,
    //     params: {
    //       URL,
    //       title: rowData.title,
    //       rowData
    //     }
    //   });
    // }
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
    let time = parseInt(rowData.date);
    time *= 1000;
    let date = new Date(time);
    let fromNow = moment(date).fromNow();

    let TouchableElement = TouchableNativeFeedback;

    return (
      <View rowID={ rowID } style={{              
            marginTop: 7,
            backgroundColor: '#FFFFFF',
            elevation: 1,
        }}>
        <TouchableElement  
          onPress ={()=>{this._onRowPressed(rowData)}}
          delayPressIn={0}
          background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
          >
          <View style={{ flex: 1, flexDirection: 'row',  padding: 12 }}>
            <Image
              source={{ uri: uri }}
              style={styles.avatar}
              />

            <View style={{ marginLeft: 10, flex: 1, flexDirection: 'column'}}>
              <Text
                ellipsizeMode={'tail'}
                numberOfLines={3}
                style={{ flex: 2.5,color: 'black', }}>
                {rowData.content}
              </Text>

              <View style={{ flex: 1.1, flexDirection: 'row', justifyContent :'space-between' }}>
                <Text style={{ flex: -1, color: idColor,textAlign : 'center', textAlignVertical: 'center' }}>{rowData.psnid}</Text>
                <Text style={{ flex: -1,textAlign : 'center', textAlignVertical: 'center' }}>{fromNow}</Text>
              </View>

            </View>

          </View>
        </TouchableElement>
      </View>
    )
  }

  componentDidMount = async () => {
      this.fetchMessages();
  }

  async fetchMessages () {
    const data = await fetchMessages(this.props.psnid);
    console.log(data);
    this.setState({
        messages: data.data,
    });
  }

  render(){
    // console.log('Message.js rendered');
    return (
        <ListView
          pageSize = {32}
          removeClippedSubviews={false}
          enableEmptySections={true}
          dataSource={ ds.cloneWithRows(this.state.messages) }
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


// function mapStateToProps(state) {
//     return {
//       community: state.community,
//     };
// }

// export default connect(
//   mapStateToProps
// )(Community);

export default Message;
