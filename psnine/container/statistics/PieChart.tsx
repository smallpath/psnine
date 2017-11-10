import React from 'react'
import {
  StyleSheet,
  View, processColor
} from 'react-native'
import Values from 'values.js'

import { PieChart } from 'react-native-charts-wrapper'

export default class PieChartScreen extends React.Component<any, any> {

  constructor(props) {
    super(props)

    const target = props.value.map(item => {
      if (typeof item.value !== 'undefined') return item
      return {
        ...item,
        value: 0
      }
    })
    this.games = target.reduce((prev, curr) => prev + curr.value, 0) + ' ' + props.suffix
    this.state = {
      legend: {
        enabled: true,
        textSize: 10,
        textColor: processColor(props.modeInfo.standardTextColor),
        form: 'CIRCLE',
        position: 'RIGHT_OF_CHART',
        wordWrapEnabled: true
      },
      selectedEntry: !props.ignore ? (
        props.selectedEntry ? props.selectedEntry + ' 平均' : this.games
      ) : '',
      data: {
        dataSets: [{
          values: target,
          label: '',
          config: {
            colors: props.colors || [
              '#C0FF8C',
              '#FFF78C', '#FFD08C', '#8CEAFF',
              '#FF8C9D'].map(item => processColor(new Values(item).shade(25).hexString())),
            valueTextSize: 16,
            valueTextColor: processColor(props.modeInfo.titleTextColor),
            sliceSpace: 3,
            selectionShift: 13,
            valueFormatter: '##'
          }
        }]
      },
      description: {
        text: '',
        textSize: 15,
        textColor: processColor('darkgray')
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
        <PieChart
          style={styles.chart}
          logEnabled={true}
          chartBackgroundColor={processColor(modeInfo.backgroundColor)}
          chartDescription={this.state.description}
          data={this.state.data}
          legend={this.state.legend}
          entryLabelColor={processColor(modeInfo.titleTextColor)}
          entryLabelTextSize = {15}
          rotationEnabled={false}
          drawSliceText={true}
          usePercentValues={false}
          centerText={this.state.selectedEntry}
          centerTextRadiusPercent={100}
          holeRadius={40}
          holeColor={processColor('#f0f0f0')}
          transparentCircleRadius={45}
          transparentCircleColor={processColor('#f0f0f088')}
          maxAngle={360}
          onSelect={this.handleSelect}
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
