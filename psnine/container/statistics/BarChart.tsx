import React from 'react'
import {
  StyleSheet,
  Text,
  View, processColor,
  ScrollView
} from 'react-native'
import update from 'immutability-helper'

import { BarChart } from 'react-native-charts-wrapper'

const config =  {
  lineWidth: 2,
  drawCircles: false,
  highlightColor: processColor('red'),
  color: processColor('red'),
  drawFilled: true,
  fillColor: processColor('red'),
  fillAlpha: 60,
  valueTextSize: 15,
  valueFormatter: '##'
}

export default class BarChartScreen extends React.Component<any, any> {

  constructor(props) {
    super(props)
    // console.log(props.value)
    this.state = {
      legend: {
        enabled: true,
        textSize: 14,
        form: 'SQUARE',
        formSize: 14,
        xEntrySpace: 10,
        yEntrySpace: 5,
        formToTextSpace: 5,
        wordWrapEnabled: true,
        maxSizePercent: 0.5
      },
      data: {
        dataSets: [{
          values: props.value.map(item => ({ y: item.value })),
          label: 'Bar dataSet',
          config: {
            color: processColor('teal'),
            barSpacePercent: 40,
            barShadowColor: processColor('lightgrey'),
            highlightAlpha: 90,
            highlightColor: processColor('red')
          }
        }]
      },
      xAxis: {
        valueFormatter: props.value.map(item => item.label),
        granularity : 1,
        granularityEnabled: true,
        position: 'BOTTOM'
      }
    }
  }
  games: any
  handleSelect = () => {

  }

  render() {
    const { modeInfo } = this.props
    return (
      <View style={{height: 250}}>
        <BarChart
          style={styles.chart}
          data={this.state.data}
          xAxis={this.state.xAxis}
          animation={{durationX: 2000}}
          legend={this.state.legend}
          gridBackgroundColor={processColor('#ffffff')}
          drawBarShadow={false}
          drawValueAboveBar={true}
          drawHighlightArrow={true}
          onSelect={this.handleSelect.bind(this)}
        />
      </View>
    )
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
