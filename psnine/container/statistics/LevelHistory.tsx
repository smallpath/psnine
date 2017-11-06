import React, { Component } from 'react'
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  processColor,
  TouchableNativeFeedback
} from 'react-native'

import TrophyItem from '../../component/TrophyItem'
import Ionicons from 'react-native-vector-icons/Ionicons'

declare var global

import { LineChart } from 'react-native-charts-wrapper'

export default class LevelHistory extends Component<any, any> {
  static navigationOptions = {
     tabBarLabel: '等级历史'
  }
  constructor(props) {
    super(props)
    const { modeInfo } = props.screenProps
    const value = props.screenProps.statsInfo.levelTrophy
    const obj = value.reduce((prev, curr) => {
      const date = new Date(curr.timestamp)
      const month = (date.getUTCMonth() + 1)
      const day = date.getUTCDate()
      const hour = date.getHours()
      const minute = date.getMinutes()
      let str = date.getUTCFullYear() + '-' + (month < 10 ? '0' + month : month) + '-'
        + (day < 10 ? '0' + day : day) + `:${hour}-${minute}`
      prev[str] = curr
      return prev
    }, {})
    const valueFormatter = props.screenProps.statsInfo.minuteArr.slice()//.reverse()
    const dataSets = [{
      label: ``,
      config: {
        lineWidth: 2,
        drawCircles: false,
        highlightColor: processColor(modeInfo.accentColor),
        color: processColor(modeInfo.accentColor),
        drawFilled: true,
        fillColor: processColor(modeInfo.accentColor),
        fillAlpha: 150
      },
      values: valueFormatter.map(item => {
        // console.log(item)
        if (obj[item.replace(/\_suffix/igm, '')]) {
          // console.log(item, 'intter ===>')
          return {
            y: obj[item].level
          }
        }
      })
    }]
    // console.log(dataSets[0].values, value.map(item => item.level))

    this.state = {
      data: [],
      lineData: {
        data: {
          dataSets
        },
        xAxis: {
          valueFormatter,
          position: 'BOTTOM',
          drawGridLines: false,
          granularityEnabled: true,
          granularity: 1,
          labelRotationAngle: 15
          // avoidFirstLastClipping: true
          // labelCountForce: true,
          // labelCount: 12
        },
        legend: {
          enabled: false,
          textColor: processColor('blue'),
          textSize: 12,
          position: 'BELOW_CHART_RIGHT',
          form: 'SQUARE',
          formSize: 14,
          xEntrySpace: 10,
          yEntrySpace: 5,
          formToTextSpace: 5,
          wordWrapEnabled: true,
          maxSizePercent: 0.5
          // custom: {
          //   colors: [processColor('red'), processColor('blue'), processColor('green')],
          //   labels: ['Company X', 'Company Y', 'Company Dashed']
          // }
        },
        marker: {
          enabled: true,
          backgroundTint: processColor('teal'),
          markerColor: processColor('#F0C0FF8C'),
          textColor: processColor('white')
        }
      }
    }
  }

  componentWillMount() {
    this.onValueChanged()
  }

  flatlist: any

  handleImageOnclick = (url) => this.props.navigation.navigate('ImageViewer', {
    images: [
      { url }
    ]
  })

  handleSelect = () => {

  }

  renderItem = ({ item: rowData, index } ) => {
    const { modeInfo, navigation } = this.props.screenProps
    // console.log(index)
    if (index === 0) return (
      <View style={{height: 250}}>
        <LineChart
        style={styles.chart}
        data={this.state.lineData.data}
        chartDescription={{text: ''}}
        legend={this.state.lineData.legend}
        marker={this.state.lineData.marker}
        xAxis={this.state.lineData.xAxis}
        drawGridBackground={false}
        borderColor={processColor('teal')}
        borderWidth={1}
        drawBorders={true}
        yAxis={{
          left: {
            axisMinimum: 0
          },
          right: {
            axisMinimum: 0
          }
        }}
        touchEnabled={true}
        dragEnabled={true}
        scaleEnabled={true}
        scaleXEnabled={true}
        scaleYEnabled={true}
        pinchZoom={true}
        doubleTapToZoomEnabled={true}

        dragDecelerationEnabled={true}
        dragDecelerationFrictionCoef={0.99}

        keepPositionOnRotation={false}
        onSelect={this.handleSelect.bind(this)}
      />
    </View>
    )
    return <TrophyItem {...{
      navigation,
      rowData,
      modeInfo
    }} />
  }

  render() {
    // console.log('GamePage.js rendered');
    const { modeInfo } = this.props.screenProps
    // console.log(this.state.data, 're renred', this.state.data.length)
    return (
      <View
        style={{ flex: 1, backgroundColor: modeInfo.backgroundColor }}
        onStartShouldSetResponder={() => false}
        onMoveShouldSetResponder={() => false}
      >
        <FlatList style={{
          flex: -1,
          backgroundColor: modeInfo.backgroundColor
        }}
          data={this.state.data}
          ref={(list) => this.flatlist = list}
          scrollEnabled={this.state.scrollEnabled}
          keyExtractor={(item, index) => item.href || index}
          renderItem={this.renderItem as any}
          extraData={this.state}
          windowSize={999}
          renderScrollComponent={props => <global.NestedScrollView {...props}/>}
          key={modeInfo.themeName}
          numColumns={modeInfo.numColumns}
          removeClippedSubviews={false}
          disableVirtualization={true}
          viewabilityConfig={{
            minimumViewTime: 3000,
            viewAreaCoveragePercentThreshold: 100,
            waitForInteraction: true
          }}
        >
        </FlatList>
        { !this.state.isLoading && (
          <View style={{
              position: 'absolute',
              right: 16,
              bottom: 16,
              width: 56,
              height: 56,
              borderRadius: 28,
              justifyContent: 'center',
              alignItems: 'center',
              elevation: 6
            }} ref={float => this.float = float}>
            <TouchableNativeFeedback
              background={TouchableNativeFeedback.SelectableBackgroundBorderless()}
              useForeground={false}
              onPress={() => this.setState({ modalVisible: true })}
              onPressIn={() => {
                this.float.setNativeProps({
                  style: {
                    elevation: 12
                  }
                })
              }}
              onPressOut={() => {
                this.float.setNativeProps({
                  style: {
                    elevation: 6
                  }
                })
              }}>
              <View pointerEvents='box-only' style={{
                backgroundColor: modeInfo.accentColor,
                borderRadius: 28, width: 56, height: 56, flex: -1, justifyContent: 'center', alignItems: 'center'
              }}>
                <Ionicons name='md-search' size={24} color={modeInfo.backgroundColor}/>
              </View>
            </TouchableNativeFeedback>
          </View>
        )}
        {this.state.modalVisible && (
          <global.MyDialog modeInfo={modeInfo}
            modalVisible={this.state.modalVisible}
            onDismiss={() => { this.setState({ modalVisible: false }) }}
            onRequestClose={() => { this.setState({ modalVisible: false }) }}
            renderContent={() => (
              <View style={{
                justifyContent: 'center',
                alignItems: 'flex-start',
                backgroundColor: modeInfo.backgroundColor,
                paddingVertical: 20,
                paddingHorizontal: 20,
                elevation: 4,
                opacity: 1,
                borderRadius: 2
              }} >
                {
                  Object.keys(filters).map((kind, index) => {
                    return (
                      <View style={{flexDirection: 'row', padding: 5}} key={index}>
                        <Text style={{color: modeInfo.standardTextColor, textAlignVertical: 'center'}}>{filters[kind].text}: </Text>
                        {
                          filters[kind].value.map((item, inner) => {
                            return (
                              <View key={inner} style={{margin: 2}}>
                                <TouchableNativeFeedback
                                  useForeground={true}
                                  background={TouchableNativeFeedback.SelectableBackgroundBorderless()} onPress={() => {
                                  this.setState({
                                    [kind]: item.value,
                                    modalVisible: false
                                  }, () => {
                                    this.onValueChanged()
                                  })
                                }}>
                                  <View style={{ flex: -1, padding: 4, paddingHorizontal: 6,
                                    backgroundColor: modeInfo[item.value === this.state[kind] ? 'accentColor' : 'standardColor'],
                                    borderRadius: 2 }}>
                                    <Text style={{ color: modeInfo.backgroundColor }}>{item.text}</Text>
                                  </View>
                                </TouchableNativeFeedback>
                              </View>
                            )
                          })
                        }
                      </View>
                    )
                  })
                }
              </View>
            )} />
        )}
      </View>
    )
  }

  isValueChanged = false
  float: any = false

  search = (text) => {
    this.setState({
      modalVisible: false,
      text
    }, () => {
      this.onValueChanged()
    })
  }

  onValueChanged = () => {
    const { ob } = this.state
    const value = this.props.screenProps.statsInfo.levelTrophy
    let data = value.slice()
    switch (ob) {
      case 'date':
        data = data.reverse()
        break
      case 'outdate':
        break
      case 'difficult':
        data = data.sort((a, b) => parseFloat(a.rare) - parseFloat(b.rare))
        break
      case 'easy':
        data = data.sort((b, a) => parseFloat(a.rare) - parseFloat(b.rare))
        break
    }
    this.flatlist && this.flatlist.scrollToOffset({ offset: 0, animated: true })
    this.setState({
      data: [value, ...data]
    })
  }

  goToSearch = async () => {
    await this.setState({ modalVisible: false })
    this.props.screenProps.navigation.navigate('Search', {
      callback: (text) => {
        if (text === this.state.text) return
        this.search(text)
      },
      content: this.state.text,
      placeholder: '搜索游戏',
      shouldSeeBackground: true
    })
  }
}

const filters = {
  ob: {
    text: '排序',
    value: [{
      text: '最新',
      value: 'date'
    }, {
      text: '时间正序',
      value: 'outdate'
    }, {
      text: '难度最高',
      value: 'difficult'
    }, {
      text: '难度最低',
      value: 'easy'
    }]
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  chart: {
    flex: 1
  }
})
