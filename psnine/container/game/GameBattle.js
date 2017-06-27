import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ListView,
  Image,
  Picker,
  Dimensions,
  TouchableNativeFeedback,
  RefreshControl,
  InteractionManager,
  Modal,
  Slider,
  FlatList
} from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

import MyDialog from '../../components/Dialog'

import { connect } from 'react-redux';
import { standardColor, nodeColor, idColor } from '../../constants/colorConfig';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { getGameMapperAPI } from '../../dao';

import TopicItem from '../shared/BattleItem'
import FooterProgress from '../shared/FooterProgress'

let toolbarActions = [
  // { title: '跳页', iconName: 'md-map', show: 'always' },
];

class GameTopic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      list: [],
      numberPerPage: 60,
      numPages: 1,
      commentTotal: 1,
      currentPage: 1,
      isRefreshing: true,
      isLoadingMore: false,
      modalVisible: false,
      sliderValue: 1
    }
  }

  onNavClicked = (rowData) => {
    const { navigation } = this.props;
    navigation.goBack();
  }

  componentWillMount = async () => {
    const { params } = this.props.navigation.state
    this.fetchMessages(params.URL, 'jump');
  }

  fetchMessages = (url, type = 'down') => {
    this.setState({
      [type === 'down' ? 'isLoadingMore' : 'isRefreshing'] : true
    }, () => {
      InteractionManager.runAfterInteractions(() => {
        getGameMapperAPI(url).then(data => {
          this.setState({
            list: data,
            isLoadingMore: false,
            isRefreshing: false
          });
        })
      })
    })
  }

  _onRefresh = () => {
    const { URL } = this.props.navigation.state.params;
    if (this.state.isLoadingMore || this.state.isRefreshing) return
    this.fetchMessages(URL);
  }


  onActionSelected = (index) => {
    switch (index) {
      case 0:
        this.setState({
          modalVisible: true
        })
        return
    }
  }

  _renderItem = ({ item: rowData, index }) => {
    const { modeInfo } = this.props.screenProps
    const { ITEM_HEIGHT } = this
    const { navigation } = this.props
    return <TopicItem {...{
      navigation,
      rowData,
      modeInfo,
    }} />
  }

  sliderValue = 1
  render() {
    const { modeInfo } = this.props.screenProps
    const { params } = this.props.navigation.state
    // console.log('Message.js rendered');
    return (
      <View
        style={{ flex: 1, backgroundColor: modeInfo.backgroundColor }}
        onStartShouldSetResponder={() => false}
        onMoveShouldSetResponder={() => false}
      >
        <Ionicons.ToolbarAndroid
          navIconName="md-arrow-back"
          overflowIconName="md-more"
          iconColor={modeInfo.isNightMode ? '#000' : '#fff'}
          title={'约战'}
          style={[styles.toolbar, { backgroundColor: modeInfo.standardColor }]}
          titleColor={modeInfo.isNightMode ? '#000' : '#fff'}
          actions={toolbarActions}
          onIconClicked={this.onNavClicked}
          onActionSelected={this.onActionSelected}
        />
        <FlatList style={{
          flex: 1,
          backgroundColor: modeInfo.backgroundColor
        }}
          ref={flatlist => this.flatlist = flatlist}
          refreshControl={
            <RefreshControl
              refreshing={this.state.isRefreshing}
              onRefresh={this._onRefresh}
              colors={[modeInfo.accentColor]}
              progressBackgroundColor={modeInfo.backgroundColor}
              ref={ref => this.refreshControl = ref}
            />
          }
          ListFooterComponent={() => <FooterProgress isLoadingMore={this.state.isLoadingMore} modeInfo={modeInfo} />}
          data={this.state.list}
          keyExtractor={(item, index) => item.id}
          renderItem={this._renderItem}
          onEndReached={this._onEndReached}
          onEndReachedThreshold={0.5}
          extraData={modeInfo}
          windowSize={21}
          updateCellsBatchingPeriod={1}
          initialNumToRender={42}
          maxToRenderPerBatch={8}
          disableVirtualization={false}
          contentContainerStyle={styles.list}
          getItemLayout={(data, index) => (
            {length: this.ITEM_HEIGHT, offset: this.ITEM_HEIGHT * index, index}
          )}
          viewabilityConfig={{
            minimumViewTime: 1,
            viewAreaCoveragePercentThreshold: 0,
            waitForInteractions: true
          }}
        />
        {this.state.modalVisible && (
          <MyDialog modeInfo={modeInfo}
            modalVisible={this.state.modalVisible}
            onDismiss={() => { this.setState({ modalVisible: false }); this.isValueChanged = false }}
            onRequestClose={() => { this.setState({ modalVisible: false }); this.isValueChanged = false }}
            renderContent={() => (
              <View style={{
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: modeInfo.backgroundColor,
                paddingVertical: 20,
                paddingHorizontal: 40,
                elevation: 4,
                opacity: 1
              }} borderRadius={2}>
                <Text style={{ alignSelf: 'flex-start', fontSize: 18, color: modeInfo.titleTextColor }}>选择页数: {
                  this.isValueChanged ? this.state.sliderValue : this.state.currentPage
                }</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Text style={{color: modeInfo.standardTextColor}}>{this.state.currentPage}</Text>
                  <Slider
                    maximumValue={this.state.numPages}
                    minimumValue={1}
                    maximumTrackTintColor={modeInfo.accentColor}
                    minimumTrackTintColor={modeInfo.standardTextColor}
                    thumbTintColor={modeInfo.accentColor}
                    style={{
                      paddingHorizontal: 90,
                      height: 50
                    }}
                    value={this.state.currentPage}
                    onValueChange={(value) => {
                      this.isValueChanged = true
                      this.setState({
                        sliderValue: Math.round(value)
                      })
                    }}
                  />
                  <Text style={{color: modeInfo.standardTextColor}}>{this.state.numPages}</Text>
                </View>
                <TouchableNativeFeedback onPress={() => {
                    this.setState({
                      modalVisible: false
                    }, () => {
                      const currentPage = this.state.currentPage
                      const targetPage = params.URL.split('=').slice(0, -1).concat(this.state.sliderValue).join('=')
                      this.fetchMessages(targetPage, 'jump');
                    })
                  }}>
                  <View style={{ alignSelf: 'flex-end', paddingHorizontal: 8, paddingVertical: 5 }}>
                    <Text style={{color: '#009688'}}>确定</Text>
                  </View>
                </TouchableNativeFeedback>
              </View>
            )} />
        )}
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
  selectedTitle: {
    //backgroundColor: '#00ffff'
    //fontSize: 20
  },
  avatar: {
    width: 50,
    height: 50,
  },
  a: {
    fontWeight: '300',
    color: idColor, // make links coloured pink
  },
});


export default GameTopic;
