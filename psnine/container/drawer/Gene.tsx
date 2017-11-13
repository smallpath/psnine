import React, { Component } from 'react'
import {
  RefreshControl,
  FlatList,
  Animated
} from 'react-native'

import { connect } from 'react-redux'
import { getGeneList } from '../../redux/action/gene.js'

declare var global

import TopicItem from '../../component/GeneItem'
import FooterProgress from '../../component/FooterProgress'

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList)

class Gene extends Component<any, any> {
  static navigationOptions = {
    tabBarLabel: '机因',
    drawerLabel: '机因'
  }

  flatlist: any = false
  refreshControl: any = false

  constructor(props) {
    super(props)
    this.state = {
      isRefreshing: false,
      isLoadingMore: false
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.screenProps.modeInfo.themeName !== nextProps.screenProps.modeInfo.themeName) {

    } else if (this.props.screenProps.searchTitle !== nextProps.screenProps.searchTitle) {

    } else if (this.props.geneType !== nextProps.geneType) {
      this._onRefresh(undefined, nextProps.geneType)
    } else {
      this.setState({
        isRefreshing: false,
        isLoadingMore: false
      }, () => {
        // this.props.community.topicPage === 1 && this.flatlist.getNode().scrollToOffset({ offset: 1, animated: true })
        // if (item.topicPage > 1) {
        //   const max = item.topics.length / item.topicPage
        //   const target = max * (item.topicPage - 1)
        //   setTimeout(() => this.flatlist.getNode().scrollToIndex({ index: target, viewPosition: 1, viewOffset: 50, animated: true }))
        //   // console.log(this.contentOffset + 50)
        // }
      })
    }
  }

  componentWillMount() {
    const { gene: geneReducer } = this.props
    const { registerAfterEach, searchTitle } = this.props.screenProps
    if (geneReducer.genePage === 0) {
      this._onRefresh(
        searchTitle
      )
    }
    registerAfterEach({
      index: 3,
      handler: (searchTitle) => {
        this._onRefresh(
          searchTitle
        )
      }
    })
  }

  _onRefresh: any = (title, type = '') => {
    const { dispatch } = this.props

    this.setState({
      isRefreshing: true
    })
    this.flatlist && this.flatlist.getNode().scrollToOffset({ offset: 0, animated: true })
    dispatch(getGeneList(1, {
      type,
      title: typeof title !== 'undefined' ? title : this.props.screenProps.searchTitle
    }))

  }

  _loadMoreData = () => {
    const { gene: geneReducer, dispatch } = this.props
    const { geneType } = this.props.screenProps
    let page = geneReducer.genePage + 1
    dispatch(getGeneList(page, {
      type: geneType,
      title: this.props.screenProps.searchTitle
    }))
  }

  _onEndReached = () => {
    if (this.state.isRefreshing || this.state.isLoadingMore) return

    this.setState({
      isLoadingMore: true
    })

    this._loadMoreData()
  }

  _renderItem = ({ item: rowData }) => {
    const { modeInfo, navigation } = this.props.screenProps
    return <TopicItem {...{
      navigation,
      rowData,
      modeInfo
    }} />
  }

  render() {
    global.log('Gene.js rendered')
    const { gene: geneReducer, geneType } = this.props
    const { modeInfo } = this.props.screenProps

    return (
      <AnimatedFlatList style={{
        flex: 1,
        backgroundColor: modeInfo.background
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
        data={geneReducer.genes}
        keyExtractor={(item) => `${item.id}::${item.views}::${item.count}`}
        renderItem={this._renderItem}
        onEndReached={this._onEndReached}
        onEndReachedThreshold={0.5}
        renderScrollComponent={props => <global.NestedScrollView {...props}/>}
        extraData={modeInfo}
        windowSize={21}
        updateCellsBatchingPeriod={1}
        key={modeInfo.themeName + geneType}
        initialNumToRender={42}
        maxToRenderPerBatch={8}
        disableVirtualization={true}
        viewabilityConfig={{
          minimumViewTime: 1,
          viewAreaCoveragePercentThreshold: 0,
          waitForInteractions: true
        }}
      />
    )
  }

}

function mapStateToProps(state) {
  return {
    gene: state.gene,
    geneType: state.app.geneType
  }
}

export default connect(
  mapStateToProps
)(Gene)