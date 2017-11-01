import React from 'react'
import {
  StyleSheet,
  Text,
  View, processColor,
  ScrollView
} from 'react-native'
import update from 'immutability-helper'

import { PieChart } from 'react-native-charts-wrapper'

export default class PieChartScreen extends React.Component<any, any> {

  constructor(props) {
    super(props)

    this.games = props.value.reduce((prev, curr) => prev + curr.value, 0) + ' ' + props.suffix
    this.state = {
      legend: {
        enabled: true,
        textSize: 10,
        form: 'CIRCLE',
        position: 'RIGHT_OF_CHART',
        wordWrapEnabled: true
      },
      selectedEntry: !props.ignore ? (
        props.selectedEntry ? props.selectedEntry + ' 平均' : this.games
      ) : '',
      data: {
        dataSets: [{
          values: props.value,
          label: '',
          config: {
            colors: [processColor('#C0FF8C'), processColor('#FFF78C'), processColor('#FFD08C'), processColor('#8CEAFF'), processColor('#FF8C9D')],
            valueTextSize: 16,
            valueTextColor: processColor(props.modeInfo.titleTextColor),
            sliceSpace: 5,
            selectionShift: 13
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
          chartBackgroundColor={processColor(modeInfo.background)}
          chartDescription={this.state.description}
          data={this.state.data}
          legend={this.state.legend}
          entryLabelColor={processColor(modeInfo.standardTextColor)}
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
          maxAngle={350}
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
