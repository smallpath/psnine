import React from 'react'
import {
  StyleSheet,
  Text,
  View, processColor,
  ScrollView
} from 'react-native'
import update from 'immutability-helper'

import {LineChart} from 'react-native-charts-wrapper'
import { getTrophyList } from '../../utils/statistics'

getTrophyList('secondlife_xhm', undefined).then((data) => {
  console.log(Object.keys(data))
})

export default class LineChartScreen extends React.Component<any, any> {

  constructor() {
    super()

    this.state = {
      data: {},
      legend: {
        enabled: true,
        textColor: processColor('blue'),
        textSize: 12,
        position: 'BELOW_CHART_RIGHT',
        form: 'SQUARE',
        formSize: 14,
        xEntrySpace: 10,
        yEntrySpace: 5,
        formToTextSpace: 5,
        wordWrapEnabled: true,
        maxSizePercent: 0.5,
        custom: {
          colors: [processColor('red'), processColor('blue'), processColor('green')],
          labels: ['Company X', 'Company Y', 'Company Dashed']
        }
      },
      marker: {
        enabled: true,
        backgroundTint: processColor('teal'),
        markerColor: processColor('#F0C0FF8C'),
        textColor: processColor('white')
      }
    }
  }

  componentDidMount() {
    this.setState(
      update(this.state, {
        data: {
          $set: {
            dataSets: [{
              values: [{y: 100}, {y: 110}, {y: 105}, {y: 115}],
              label: 'Company X',
              config: {
                lineWidth: 2,
                drawCircles: false,
                highlightColor: processColor('red'),
                color: processColor('red'),
                drawFilled: true,
                fillColor: processColor('red'),
                fillAlpha: 60,
                valueTextSize: 15,
                valueFormatter: '##.000',
                dashedLine: {
                  lineLength: 20,
                  spaceLength: 20
                }
              }
            }, {
              values: [{y: 90}, {y: 130}, {y: 100}, {y: 105}],
              label: 'Company Y',
              config: {
                lineWidth: 1,
                drawCubicIntensity: 0.4,
                circleRadius: 5,
                drawHighlightIndicators: false,
                color: processColor('blue'),
                drawFilled: true,
                fillColor: processColor('blue'),
                fillAlpha: 45,
                circleColor: processColor('blue')
              }
            }, {
              values: [{y: 110}, {y: 105}, {y: 115}, {y: 110}],
              label: 'Company Dashed',
              config: {
                color: processColor('green'),
                drawFilled: true,
                fillColor: processColor('green'),
                fillAlpha: 50
              }
            }]
          }
        },
        xAxis: {
          $set: {
            valueFormatter: ['Q1', 'Q2', 'Q3', 'Q4']
          }
        }
      })
    )
  }

  handleSelect(event) {
    let entry = event.nativeEvent
    if (!entry) {
      this.setState({...this.state, selectedEntry: null})
    } else {
      this.setState({...this.state, selectedEntry: JSON.stringify(entry)})
    }
  }

  render() {
    return (
      <ScrollView style={{flex: 1}}>

        <View style={{ height: 800}}>
          <Text> selected entry</Text>
          <Text> {this.state.selectedEntry}</Text>
        </View>

        <View style={styles.container}>
          <LineChart
            style={styles.chart}
            data={this.state.data}
            description={{text: ''}}
            legend={this.state.legend}
            marker={this.state.marker}
            xAxis={this.state.xAxis}
            drawGridBackground={false}
            borderColor={processColor('teal')}
            borderWidth={1}
            drawBorders={true}

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

      </ScrollView>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    height: 400,
    backgroundColor: '#F5FCFF'
  },
  chart: {
    flex: 1
  }
})
