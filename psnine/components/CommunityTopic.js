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
  RefreshControl,
  WebView,
  KeyboardAvoidingView,
  TouchableHighlight,
  InteractionManager,
  ActivityIndicator,
  StatusBar,
  FlatList,
  ScrollView
} from 'react-native';

import HTMLView from './htmlToView';
import CommentList from './CommentList'
import { connect } from 'react-redux';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { standardColor, nodeColor, idColor, accentColor  } from '../config/colorConfig';

import { getTopicAPI, getTopicContentAPI } from '../dao/dao'

let screen = Dimensions.get('window');

let toolbarActions = [
  {title: '回复', iconName: 'md-create', show: 'always'},
  {title: '收藏', iconName: 'md-star' ,show: 'always'},
  {title: '感谢', iconName: 'md-thumbs-up', show: 'never'},
  {title: '分享', show: 'never' },
];
let title = "TOPIC";
let WEBVIEW_REF = `WEBVIEW_REF`;

class CommunityTopic extends Component {

  constructor(props){
    super(props);
    this.state = {
      data: false,
      isLoading: true,
      mainContent: false
    }
  }

  _onActionSelected = (index) => {
    switch(index){
      case 0 :
        return;
      case 1 :
        // return this.refs[WEBVIEW_REF].reload();
      case 2 :
        return;
      case 3 :
        return;
    }
  }

  componentWillMount = () => {
    InteractionManager.runAfterInteractions(() => {
      const data =  getTopicAPI(this.props.URL).then(data => {
        this.setState({
          data,
          mainContent: data.contentInfo.html,
          isLoading: false
        })
      })
    });
  }

  renderHeader = () => {
    const { data: { titleInfo } } = this.state

    const nodeStyle = { flex: -1, color: this.props.modeInfo.standardTextColor,textAlign : 'center', textAlignVertical: 'center' }
    const textStyle = { flex: -1, color: this.props.modeInfo.standardTextColor,textAlign : 'center', textAlignVertical: 'center' }
    const isNotGene = this.props.type !== 'gene'
    const shouldRenderAvatar = isNotGene && !!(this.props.rowData && this.props.rowData.avatar)
    return (
      <View key={'header'} style={{
            flex: 1,              
            backgroundColor: this.props.modeInfo.backgroundColor,
            elevation: 1,
            margin: 5,
            marginBottom: 0,
            marginTop: 0
        }}>
        <TouchableNativeFeedback  
          useForeground={true}
          delayPressIn={100}
          background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
          >
          <View style={{ flex: 1, flexDirection: 'row', justifyContent:'center', alignItems: 'center' ,padding: 5 }}>
            { shouldRenderAvatar && <Image
              source={{ uri: this.props.rowData.avatar.replace('@50w.png', '@75w.png') }}
              style={{ width: 75, height: 75}}
              />
            }

            <View style={{ flex: 1, flexDirection: 'column', padding: 5}}>
              <HTMLView
                value={titleInfo.title}
                modeInfo={ this.props.modeInfo }
                stylesheet={styles}
                onLinkPress={(url) => console.log('clicked link: ', url)}
                imagePaddingOffset={shouldRenderAvatar ? 30 + 75 + 10 : 30}
              />

              <View style={{ flex: 1.1, flexDirection: 'row', justifyContent :'space-between' }}>
                <Text selectable={false} style={{ flex: -1, color: idColor,textAlign : 'center', textAlignVertical: 'center' }}>{titleInfo.psnid}</Text>
                <Text selectable={false} style={textStyle}>{titleInfo.date}</Text>
                <Text selectable={false} style={textStyle}>{titleInfo.reply}</Text>
              </View>
            </View>

          </View>
        </TouchableNativeFeedback>
      </View>
    )
  }

  renderContent = () => {
    const content = this.state.mainContent
    const html = this.props.type !== 'gene' ? content : content.replace('<div>', '<div align="center">')
    const emptyHTML = this.props.type !== 'gene' ? '<div></div>' : '<div align="center"></div>'
    return html !== emptyHTML ? (
      <View key={'content'} style={{             
            elevation: 1,
            margin: 5,
            marginTop: 0,
            backgroundColor: this.props.modeInfo.backgroundColor,
            padding: 10
        }}>
        <HTMLView
          value={html}
          modeInfo={ this.props.modeInfo }
          shouldShowLoadingIndicator={true}
          stylesheet={styles}
          imagePaddingOffset={30}
          onLinkPress={(url) => console.log('clicked link: ', url)}
        />
      </View>
    ) : undefined
  }

  renderGameTable = () => {
    const { data: { contentInfo : { gameTable } } } = this.state
    const list = []
    for (const rowData of gameTable) {
      list.push(
        <View key={ rowData.id } style={{              
              backgroundColor: this.props.modeInfo.backgroundColor
          }}>
          <TouchableNativeFeedback
            onPress ={()=>{

            }}
            useForeground={true}
            delayPressIn={100}
            background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
            >
            <View pointerEvents='box-only' style={{ flex: 1, flexDirection: 'row',  padding: 12 }}>
              <Image
                source={{ uri: rowData.avatar }}
                style={[styles.avatar, { width: 91 }]}
                />                

              <View style={{ marginLeft: 10, flex: 1, flexDirection: 'column'}}>
                <Text
                  ellipsizeMode={'tail'}
                  numberOfLines={3}
                  style={{ flex: 2.5,color: this.props.modeInfo.titleTextColor, }}>
                  {rowData.title}
                </Text>

                <View style={{ flex: 1.1, flexDirection: 'row', justifyContent :'space-between' }}>
                  <Text selectable={false} style={{ flex: -1, color: idColor,textAlign : 'center', textAlignVertical: 'center' }}>{rowData.platform}</Text>
                  <Text selectable={false} style={{ flex: -1, color: this.props.modeInfo.standardTextColor,textAlign : 'center', textAlignVertical: 'center' }}>{rowData.region}</Text>
                  <Text selectable={false} style={{ flex: -1, color: this.props.modeInfo.standardTextColor,textAlign : 'center', textAlignVertical: 'center' }}>{
                    rowData.platium + rowData.gold + rowData.selver + rowData.bronze
                  }</Text>
                </View>

              </View>

            </View>
          </TouchableNativeFeedback>
        </View>
      )
    }
    return (
      <View style={{elevation: 1, margin: 5, marginTop: 0, backgroundColor:this.props.modeInfo.backgroundColor }}>
        { list }
      </View>
    )
  }

  renderComment = () => {
    const { data: { commentList } } = this.state
    const list = []
    let readMore = null
    for (const rowData of commentList) {
      if (rowData.isGettingMoreComment === false) {
        list.push(
          <View key={ rowData.id } style={{              
                backgroundColor: this.props.modeInfo.backgroundColor,
                borderBottomWidth: 1,
                borderBottomColor: this.props.modeInfo.brighterLevelOne
            }}>
            <TouchableNativeFeedback  
              onPress ={()=>{
                
              }}
              useForeground={true}
              delayPressIn={100}
              background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
              >
              <View style={{ flex: 1, flexDirection: 'row',  padding: 12 }}>
                <Image
                  source={{ uri: rowData.img }}
                  style={styles.avatar}
                  />

                <View style={{ marginLeft: 10, flex: 1, flexDirection: 'column'}}>
                  <HTMLView
                    value={rowData.content}
                    modeInfo={ this.props.modeInfo }
                    stylesheet={styles}
                    onLinkPress={(url) => console.log('clicked link: ', url)}
                    imagePaddingOffset={30 + 75 + 10}
                  />

                  <View style={{ flex: 1.1, flexDirection: 'row', justifyContent :'space-between' }}>
                    <Text selectable={false} style={{ flex: -1, color: idColor ,textAlign : 'center', textAlignVertical: 'center' }}>{rowData.psnid}</Text>
                    <Text selectable={false} style={{ flex: -1, color: this.props.modeInfo.standardTextColor,textAlign : 'center', textAlignVertical: 'center' }}>{rowData.date}</Text>
                  </View>

                </View>

              </View>
            </TouchableNativeFeedback>
          </View>
        )
      } else {
        readMore = (
          <View key={ 'readmore' } style={{              
                backgroundColor: this.props.modeInfo.backgroundColor,
                elevation: 1
            }}>
            <TouchableNativeFeedback  
              onPress ={()=>{
                this._readMore(`${this.props.URL}/comment?page=1`)
              }}
              useForeground={true}
              delayPressIn={100}
              background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
              >
              <View pointerEvents='box-only' style={{ flex: 1, flexDirection: 'row',  padding: 12 }}>

                <View style={{ flex: 1, flexDirection: 'column', justifyContent:'center', alignItems: 'center'}}>
                  <Text style={{ flex: 2.5,color: accentColor}}>{'阅读更多评论'}</Text>

                </View>

              </View>
            </TouchableNativeFeedback>
          </View>
        )
      }
    }
    return list.length !== 0 ?(
      <View>
        { readMore &&<View style={{elevation: 1, margin: 5, marginTop: 0, marginBottom: 5, backgroundColor:this.props.modeInfo.backgroundColor }}>{ readMore }</View> } 
        <View style={{elevation: 1, margin: 5, marginTop: 0, backgroundColor:this.props.modeInfo.backgroundColor }}>
          { list }
        </View>
      </View>
    ) : undefined
  }

  _readMore = (URL) => {
    this.props.navigator.push({
      component: CommentList,
      params: {
        URL
      }
    })
  }

  renderPage() {
    const { data: { contentInfo: { page } } } = this.state
    const list = [] 
    for (const item of page) {
      const thisJSX = (
        <TouchableNativeFeedback key={item.url} onPress={() => {
            if (this.state.isLoading === true) {
              return
            }
            this.setState({
              isLoading: true
            })
            getTopicContentAPI(item.url).then(data => {
              this.setState({
                mainContent: data.contentInfo.html,
                isLoading: false
              })
            })
          }}>
          <Text style={{color: idColor}}>{item.text}</Text>
        </TouchableNativeFeedback>
      )
      list.push(thisJSX)
    }
    return list.length !== 0 ? (
      <View style={{elevation: 1,margin: 5, marginTop: 0, marginBottom: 0, backgroundColor:this.props.modeInfo.backgroundColor}}>
        <View style={{
            elevation: 2,
            margin: 5,
            backgroundColor:this.props.modeInfo.backgroundColor,
            padding: 5
          }}>
          { list }
        </View>
      </View>
    ) : undefined
  }

  render() {
    // console.log('CommunityTopic.js rendered');
    return ( 
          <View 
            style={{flex:1, backgroundColor: this.props.modeInfo.backgroundColor}}
            onStartShouldSetResponder={() => false}
            onMoveShouldSetResponder={() => false}
            >
              <Ionicons.ToolbarAndroid
                navIconName="md-arrow-back"
                overflowIconName="md-more"                 
                iconColor={this.props.modeInfo.isNightMode ? '#000' : '#fff'}
                title={`No.${this.props.rowData.id}`}
                style={[styles.toolbar, {backgroundColor: this.props.modeInfo.standardColor}]}
                actions={toolbarActions}
                onIconClicked={() => {
                  this.props.navigator.pop()
                }}
                onActionSelected={this._onActionSelected}
              />
              { this.state.isLoading && (
                  <ActivityIndicator
                    animating={this.state.isLoading}
                    style={{
                      flex: 999,
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                    color={accentColor}
                    size="large"
                  />
              )}
              { !this.state.isLoading && <FlatList style={{
                flex: -1,
                backgroundColor: this.props.modeInfo.standardColor
              }}
                data={
                  [
                    this.state.data.titleInfo,
                    this.state.data.contentInfo.page,
                    this.state.data.contentInfo.html,
                    this.state.data.contentInfo.gameTable,
                    this.state.data.commentList
                  ]
                }
                keyExtractor={(item, index) => item.id || index}
                renderItem={({ item, index }) => {
                  switch (index) {
                    case 0:
                      return this.renderHeader()
                    case 1:
                      return this.renderPage()
                    case 2:
                      return this.renderContent()
                    case 3:
                      return this.renderGameTable()
                    case 4:
                      return this.renderComment()
                  }
                  return <Text>{index}</Text>
                }}
                >
                {/*{ !this.state.isLoading && this.renderHeader() }
                { !this.state.isLoading && this.state.data.contentInfo.page.length !== 0 && this.renderPage() }
                { !this.state.isLoading && this.renderContent() }
                { !this.state.isLoadding && this.state.data.contentInfo.gameTable 
                      && this.state.data.contentInfo.gameTable.length !== 0 && this.renderGameTable()}
                { !this.state.isLoading && this.renderComment() }*/}
              </FlatList>
              }
              {/*{ !this.state.isLoading && <ScrollView style={{
                flex: -1,
                backgroundColor: this.props.modeInfo.standardColor
              }}>
                { !this.state.isLoading && this.renderHeader() }
                { !this.state.isLoading && this.state.data.contentInfo.page.length !== 0 && this.renderPage() }
                { !this.state.isLoading && this.renderContent() }
                { !this.state.isLoadding && this.state.data.contentInfo.gameTable 
                      && this.state.data.contentInfo.gameTable.length !== 0 && this.renderGameTable()}
                { !this.state.isLoading && this.renderComment() }
              </ScrollView>
              }*/}
          </View>
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
    backgroundColor: standardColor,
    height: 56,
    elevation: 4,
  },
  selectedTitle:{
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


export default CommunityTopic