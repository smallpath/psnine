import React, { Component } from 'react'
import {
  Image,
  Dimensions,
  PixelRatio,
  Text,
  Platform
} from 'react-native'

const { width } = Dimensions.get('window')

// ios scale inline images automatically while android doesn't
const pixelRate = Platform.OS === 'ios' ? 1 : PixelRatio.get()

export default props => {
  const width = Number(props.attribs.width) || Number(props.attribs['data-width']) || 0
  const height = Number(props.attribs.height) || Number(props.attribs['data-height']) || 0

  const imgStyle = {
    width,
    height
  }
  let src = props.attribs.src
  if (/^(.*?):\/\//.exec(src)) {} else {
    src = 'http://psnine.com' + src
  }
  const source = {
    uri: src,
    width,
    height,
    imagePaddingOffset: props.imagePaddingOffset
  }

  return (
    <Text onLongPress={props.linkPressHandler}>
      <InlineImage
        source={source}
        style={imgStyle}
        isLoading={props.isLoading}
        alignCenter={props.alignCenter}
        modeInfo={props.modeInfo}
        linkPressHandler={props.linkPressHandler} />
    </Text>
  )
}

export interface IProps {
  source: any
  style: any
  isLoading: any
  alignCenter: any
  modeInfo: any
  linkPressHandler: any
}

export interface State {
  width: number,
  height: number,
  alignCenter: boolean
}

class InlineImage extends Component<IProps, State> {
  maxWidth: number = width
  mounted: boolean = false
  constructor(props) {
    super(props)
    const maxWidth = width - this.props.source.imagePaddingOffset
    this.maxWidth = maxWidth * pixelRate
    this.state = {
      width: this.props.style.width * pixelRate,
      height: this.props.style.height * pixelRate,
      alignCenter: this.props.alignCenter || false
    }
  }

  componentWillUnmount() {
    this.mounted = false
  }

  componentDidMount() {
    this.mounted = true
    if (this.props.style.width !== 0 && this.props.style.height !== 0) {
      return
    }
    Image.getSize(this.props.source.uri, (w, h) => {
      if (this.mounted !== false) {
        this.setState({
          width: w * pixelRate,
          height: h * pixelRate
        })
      }
    }, () => { })
  }

  render() {
    const finalSize: any = {}
    // console.log(this.state.width, this.maxWidth)
    if (this.state.width > this.maxWidth) {
      finalSize.width = this.maxWidth
      let ratio = this.maxWidth / this.state.width
      finalSize.height = this.state.height * ratio
    }
    let source: any = {}
    if (!finalSize.width || !finalSize.height) {
      source = Object.assign(source, this.props.source, this.state)
    } else {
      source = Object.assign(source, this.props.source, finalSize)
    }
    return (
      <Image
        resizeMode={'contain'}
        resizeMethod={'scale'}
        onError={() => {}}
        key={`${source.width}:${source.height}`}
        source={source}
        style={{
          width: source.width,
          height: source.height
        }}/>
    )
  }
}
