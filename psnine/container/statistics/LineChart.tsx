import React from 'react'
import {
  StyleSheet,
  Text,
  View, processColor,
  ScrollView
} from 'react-native'
import update from 'immutability-helper'

import { LineChart } from 'react-native-charts-wrapper'

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

export default class LineChartScreen extends React.Component<any, any> {

  constructor(props) {
    super(props)

    const dataSets = props.xAxis ? props.value.map(item => ({
      values: item.y.reduce((prev, curr) => {
        prev.total += curr
        prev.arr.push(prev.total)
        return prev
      }, { total: 0, arr: [] }).arr,
      label: item.label,
      config
    })) : [{
      values: props.value,
      label: '',
      config
    }]
    // console.log(dataSets)
    this.state = {
      data: {
        dataSets
      },
      xAxis: {
        valueFormatter: props.xAxis || props.value.map(item => item.label),
        granularity : 1,
        granularityEnabled: true,
        position: 'BOTTOM'
      },
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
  games: any
  handleSelect = () => {

  }

  render() {
    const { modeInfo } = this.props
    return (
      <View style={{height: 250}}>
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
