import React from 'react'
import {
  StyleSheet,
  View,
  processColor
} from 'react-native'
import { BubbleChart } from 'react-native-charts-wrapper'

class BubbleChartScreen extends React.Component<any, any> {

  constructor(props) {
    super(props)

    const { modeInfo } = props
    const temp = props.value.weekLoc.sort((a, b) => {
      const day = a.x - b.x
      return day || (a.y - b.y)
    })
    const valueFormatter = props.value.daysMapper.slice()
    valueFormatter.unshift()
    valueFormatter.push(props.value.daysMapper[0])
    const isX = item => item.x === 6
    const values = [...temp.filter(isX), ...temp.filter(item => item.x !== 6)]
    this.state = {
      data: {
        dataSets: [{
          values,
          label: '奖杯数比例',
          config: {
            color: processColor(modeInfo.deepColor),
            highlightCircleWidth: 2,
            drawValues: false,
            valueTextColor: processColor(modeInfo.titleTextColor)
          }
        }]
      },
      legend: {
        enabled: true,
        textSize: 14,
        form: 'CIRCLE',
        wordWrapEnabled: true,
        textColor: processColor(props.modeInfo.standardTextColor)
      },
      xAxis: {
        valueFormatter,
        position: 'BOTTOM',
        drawGridLines: false,
        granularityEnabled: true,
        granularity: 1,
        textColor: processColor(props.modeInfo.standardTextColor)
        // avoidFirstLastClipping: true
        // labelCountForce: true,
        // labelCount: 12
      },
      yAxis: {
        left: {
          axisMinimum: 0,
          axisMaximum: 23,
          textColor: processColor(props.modeInfo.standardTextColor)
        },
        right: {
          axisMinimum: 0,
          axisMaximum: 23,
          textColor: processColor(props.modeInfo.standardTextColor)
        }
      }
    }
  }

  handleSelect = () => {
  }

  render() {
    // console.log(this.state.data.dataSets[0].values.filter(item => item.x === 6))
    return (
      <View style={{ height: 250 }}>
        <BubbleChart
          style={styles.chart}
          data={this.state.data}
          legend={this.state.legend}
          chartDescription={{text: ''}}
          xAxis={this.state.xAxis}
          yAxis={this.state.yAxis}
          entryLabelColor={processColor(this.props.modeInfo.titleTextColor)}
          onSelect={this.handleSelect}
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5FCFF'
  },
  chart: {
    flex: 1
  }
})

export default BubbleChartScreen