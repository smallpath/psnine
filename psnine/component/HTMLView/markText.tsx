import React, { Component } from 'react'
import {
  Text
} from 'react-native'

interface IProps {
  forceMark: boolean
  text: string
  backgroundColor: string
  color: string
}

interface State {
  show: boolean
}

export default class InlineImage extends Component<IProps, State> {
  mounted = false
  constructor(props) {
    super(props)
    let show = false
    if (this.props.forceMark) show = true
    this.state = {
      show
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.forceMark !== nextProps.forceMark) {
      this.setState({
        show: nextProps.forceMark ? true : false
      })
    }
  }

  componentWillUnmount() {
    this.mounted = false
  }

  componentDidMount() {
    this.mounted = true
  }

  render() {
    const finalSize: any = {}
    const isShow = this.state.show
    const { text = '', backgroundColor, color } = this.props
    return (
      <Text onPress={() => this.setState({ show: !isShow })} style={{
        color: isShow ? backgroundColor : color,
        backgroundColor: color
      }}>
        {text}
      </Text>
    )
  }
}
