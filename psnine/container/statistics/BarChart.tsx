import React from 'react'
import {
  StyleSheet,
  View, processColor
} from 'react-native'

import { BarChart } from 'react-native-charts-wrapper'

export default class BarChartScreen extends React.Component<any, any> {

  constructor(props) {
    super(props)
    // console.log(props.value)
    const { modeInfo } = props
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
          label: '奖杯数',
          config: {
            color: processColor(modeInfo.deepColor),
            barSpacePercent: 1,
            barShadowColor: processColor(modeInfo.deepColor),
            highlightAlpha: 90,
            highlightColor: processColor(modeInfo.deepColor)
          }
        }],
        config: {
          barSpacePercent: 1
        }
      },
      xAxis: {
        valueFormatter: props.value.map(item => item.label),
        granularity : 1,
        granularityEnabled: true,
        position: 'BOTTOM',
        drawGridLines: false
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
          gridBackgroundColor={processColor(modeInfo.background)}
          chartDescription={{text: ''}}
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
