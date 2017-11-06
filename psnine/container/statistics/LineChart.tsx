import React from 'react'
import {
  StyleSheet,
  Text,
  View, processColor,
  ScrollView
} from 'react-native'
import update from 'immutability-helper'

import { LineChart } from 'react-native-charts-wrapper'

export default class LineChartScreen extends React.Component<any, any> {

  constructor(props) {
    super(props)
    const { modeInfo } = props
    const config =  {
      lineWidth: 2,
      drawCircles: false,
      highlightColor: processColor(modeInfo.accentColor),
      color: processColor(modeInfo.accentColor),
      drawFilled: true,
      fillColor: processColor(modeInfo.accentColor),
      fillAlpha: 150
    }

    const dataSets = props.xAxis ? props.value.map((item, index) => {
        return {
          values: item.y.reduce((prev, curr) => {
            prev.total += curr
            prev.arr.push(prev.total)
            return prev
          }, { total: 0, arr: [] }).arr,
          label: item.label,
          config: Object.assign({}, config, {
            highlightColor: processColor(modeInfo.backgroundColorArrMapper[index]),
            color: processColor(modeInfo.backgroundColorArrMapper[index]),
            fillColor: processColor(modeInfo.backgroundColorArrMapper[index]),
            fillAlpha: 255,
            valueFormatter: '##'
          })
        }
      }).reverse() : [{
        values: props.value,
        label: '奖杯数',
        config
      }]
    const xAxis: any = {
      valueFormatter: props.xAxis || props.value.map(item => item.label),
      granularity : 1,
      granularityEnabled: true,
      position: 'BOTTOM',
      drawGridLines: false
    }
    if (props.xAxis) {
      xAxis.labelRotationAngle = 15
    }
    this.state = {
      data: {
        dataSets
      },
      xAxis,
      yAxis: {
        left: {
          axisMinimum: 0
        },
        right: {
          axisMinimum: 0
        }
      },
      legend: {
        enabled: true,
        textColor: processColor(modeInfo.standardTextColor),
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
          chartDescription={{text: ''}}
          legend={this.state.legend}
          marker={this.state.marker}
          xAxis={this.state.xAxis}
          yAxis={this.state.yAxis}
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
