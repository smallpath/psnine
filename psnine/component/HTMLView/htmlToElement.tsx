import React from 'react'
import {
  Text,
  View,
  StyleSheet
} from 'react-native'
import htmlparser from 'htmlparser2-without-node-native'
import entities from 'entities'

import ResizableImgComponent from './resizableImage'
import InlineImgComponent from './inlineImage'
import Web from './webview'
import MarkText from './markText'

const LINE_BREAK = '\n'
const PARAGRAPH_BREAK = '\n\n'
const BULLET = '\u2022 '
const inlineElements = ['a', 'span', 'em', 'font', 'label', 'b', 'strong', 'i', 'small', 'img', 'u']
const blockLevelElements = ['pre', 'p', 'br', 'h1', 'h2', 'h3', 'h4', 'h5', 'blockquote']

export default function htmlToElement(rawHtml, opts, done) {
  function domToElement(dom, parent, inInsideView = true, depth = 0, parentIframe = 0) {

    // debug开关函数
    const log: (...args) => any = () => {}
    // const log = (text, ...args) => console.log(`第${depth}层 ${Array(depth).fill('      ').join('')}${text} ${args.join(' ')}`)
    log('是否在View内', inInsideView)
    // inInsideView为是否为第一层, 是第一层则图片外联并且支持返回View组件, 否则只支持返回Text和内联图片组件
    if (!dom) return null

    let domLen = dom.length
    // 缓存是否已经被内联渲染的对象数组
    let domTemp = {}

    // 获得嵌套标签的子内容, 仅支持其中第一个子组件
    let getNodeData = function (node) {
      let nodeData = null
      if (node.children && node.children.length) {
        let nodeChild = node.children[0]
        if (nodeChild && nodeChild.data) {
          nodeData = nodeChild.data
        } else {
          nodeData = getNodeData(nodeChild)
        }
      }
      return nodeData
    }

    // 向parent递归查找class和style, 最终得到文字应有的样式
    let renderInlineStyle = function (innerParent, styleObj) {
      // p9目前只有span的嵌套, 因此暂时只处理span
      if (innerParent && inlineElements.includes(innerParent.name)) {
        const classNameArr = (innerParent.attribs.class || '').split(' ')
        for (const name of classNameArr) {
          switch (name) {
            case 'font12':
              styleObj.fontSize = 12
              break
            case 'mark':
              styleObj.backgroundColor = opts.modeInfo.backgroundColor
              styleObj.color = opts.modeInfo.reverseModeInfo.backgroundColor
              styleObj.isMark = true
              break
            case 'dd_price_plus':
              styleObj.color = '#ffc926'
              break
            default:
              break
          }
        }
        const styles = (innerParent.attribs.style || '').split(';')
        for (const style of styles) {
          if (!style) continue
          const splited = style.split(':')
          if (splited.length !== 2) continue
          splited[0] = splited[0].replace(/\-([a-z])/, (matched) => matched[1].toUpperCase())
          if (splited[1].includes('px')) {
            splited[1] = parseInt(splited[1], 10)
          } else {
            splited[1] = splited[1].toLowerCase()
          }
          styleObj[splited[0]] = splited[1]
        }
        renderInlineStyle(innerParent.parent, styleObj)
      }
    }

    // 渲染可以被内联的组件
    let renderInlineNode = function (index, result: any[] = [], isInsideView = false) {
      let thisIndex = index + 1
      if (thisIndex < domLen) {
        let nextNode = dom[thisIndex]
        if (domTemp[thisIndex] === true) {
          return result
        }

        if (inlineElements.includes(nextNode.name) || nextNode.type === 'text') {
          // 设置缓存标识
          domTemp[thisIndex] = true
          const isNestedImage = nextNode.name === 'a' && nextNode.children && nextNode.children.length === 1 && nextNode.children[0].name === 'img'
          // console.log(isNestedImage, nextNode.name, (nextNode.children || []).length,
          //   nextNode.children && nextNode.children.length === 1 && nextNode.children[0].name
          //  ,'isNestedImage')
          if (isNestedImage) {
            log('渲染内联组件', isInsideView)
            domTemp[thisIndex] = false
            return result
          }
          result.push(
            <Text key={index}>
            { domToElement([nextNode], nextNode.parent, false, depth + 1) }
            </Text>
          )
        } else if (nextNode.name === 'br') {
          // 内联的换行, 由于内联只存在文字和图片, 因此不用考虑其他标签
          domTemp[thisIndex] = true
          result.push(<Text key={index}>{LINE_BREAK}</Text>)
        }
        if (nextNode.next && nextNode.name !== 'div') {
          const name = nextNode.next.name
          const type = nextNode.next.type
          // console.log(name , type)
          if (type === 'text' || inlineElements.includes(name) || name === 'br') {
            renderInlineNode(thisIndex, result)
          }
        }
      }

      return result
    }

    let renderText = (node, index, innerParent) => {
      if (node.type === 'text' && node.data.trim() !== '') {
        let linkPressHandler: any = null
        // console.log(parent && parent.name === 'a' && parent.attribs && parent.attribs.href, '==>')
        if (innerParent && innerParent.name === 'a' && innerParent.attribs && innerParent.attribs.href) {
          // console.log('???', parent.attribs.href)
          linkPressHandler = () => opts.linkHandler(entities.decodeHTML(innerParent.attribs.href))
        }

        const classStyle: any = {}
        renderInlineStyle(innerParent, classStyle)

        let inlineArr = renderInlineNode(index)
        const content = entities.decodeHTML(node.data)
        const isMark = classStyle.isMark === true
        if (isMark) delete classStyle.isMark
        const text = isMark ? (
          <MarkText {...{
            color: classStyle.color,
            backgroundColor: classStyle.backgroundColor,
            text: content,
            forceMark: opts.forceMark
          }}/>
        ) : content
        return (
          <Text key={index} onPress={linkPressHandler} style={[
            { color: opts.modeInfo.standardTextColor },
            innerParent ? opts.styles[innerParent.name] : null,
            classStyle
          ]}>{innerParent && innerParent.name === 'pre' ? LINE_BREAK : null}
            {innerParent && innerParent.name === 'li' ? BULLET : null}
            {innerParent && innerParent.name === 'br' ? LINE_BREAK : null}
            {innerParent && innerParent.name === 'p' && index < innerParent.length - 1 ? PARAGRAPH_BREAK : null}
            {innerParent && innerParent.name === 'h1' || innerParent && innerParent.name === 'h2' || innerParent && innerParent.name === 'h3'
              || innerParent && innerParent.name === 'h4' || innerParent && innerParent.name === 'h5' ? PARAGRAPH_BREAK : null}

            {text}

            {inlineArr}

          </Text>
        )
      }
      return null
    }

    return dom.map((node, index, list) => {

      if (domTemp[index] === true) {
        return
      }

      if (opts.customRenderer) {
        const rendered = opts.customRenderer(node, index, list, parent, domToElement)
        if (rendered || rendered === null) return rendered
      }
      log('尝试渲染renderText', node.type, node.name, inInsideView)
      const textComponent = renderText(node, index, parent)
      if (textComponent) return textComponent

      if (node.type === 'tag') {
        if (node.name === 'img') {
          let linkPressHandler: any = null
          let shouldForceInlineEmotion = false
          if (parent && parent.name === 'a' && parent.attribs.href) {
            const parentHref = parent.attribs.href
            const imgSrc = node.attribs.src
            const type = imgSrc === parentHref ? 'onImageLongPress' : 'linkHandler'
            linkPressHandler = () => opts[type](entities.decodeHTML(parentHref))
          } else if (node.attribs && node.attribs.src) {
            // 内联p9的默认表情图片
            if (node.attribs.src.includes('//photo.psnine.com/face/')) {
              shouldForceInlineEmotion = true
            }
            linkPressHandler = () => opts.onImageLongPress(entities.decodeHTML(node.attribs.src))
          }

          let ImageComponent = inInsideView ? ResizableImgComponent : InlineImgComponent
          if (shouldForceInlineEmotion) {
            ImageComponent = InlineImgComponent
          }
          if (ImageComponent === ResizableImgComponent) {
              let src = node.attribs.src
              if (/^(.*?):\/\//.exec(src)) {} else {
                src = 'http://psnine.com' + src
              }
              // console.log('pushing', src)
              opts.imageArr.push({ url: src })
              const len = opts.imageArr.length
              linkPressHandler = () => opts.onImageLongPress({
                imageUrls: opts.imageArr,
                index: len - 1
              })
          }
          log('渲染Img标签', '此时是否在View中?', inInsideView, ImageComponent === ResizableImgComponent)
          // console.log(parentIframe)
          return (
            <ImageComponent key={index} attribs={node.attribs}
              isLoading={opts.shouldShowLoadingIndicator}
              linkPressHandler={linkPressHandler}
              alignCenter={opts.alignCenter}
              modeInfo={opts.modeInfo}
              imageArr={opts.imageArr}
              imagePaddingOffset={opts.imagePaddingOffset + parentIframe}
            />
          )
        } else if (node.name === 'embed' || node.name === 'iframe') {
          if (inInsideView) {
            const target = Object.assign({}, node.attribs)
            return (
              <Web key={index} attribs={target}
                linkPressHandler={opts.linkHandler}
                imagePaddingOffset={opts.imagePaddingOffset} modeInfo={opts.modeInfo} name={node.name} />
            )
          } else {
            return (
              <Text style={{
                color: opts.modeInfo.accentColor,
                textDecorationLine: 'underline'
                }} onPress={() => opts.linkHandler(entities.decodeHTML(node.attribs.src))}>
                打开网页
              </Text>
            )
          }
        }

        let linkPressHandler: any = null
        if (node.name === 'a' && node.attribs && node.attribs.href) {
          linkPressHandler = () => opts.linkHandler(entities.decodeHTML(node.attribs.href))
        }

        let linebreakBefore: null | string = null
        let linebreakAfter: null | string = null
        if (blockLevelElements.includes(node.name)) {
          switch (node.name) {
            case 'blockquote':
            case 'pre':
              linebreakBefore = LINE_BREAK
              break
            case 'p':
              if (index < list.length - 1) {
                linebreakAfter = PARAGRAPH_BREAK
              }
              break
            case 'br':
            case 'h1':
            case 'h2':
            case 'h3':
            case 'h4':
            case 'h5':
              linebreakAfter = LINE_BREAK
              break
            default:
              break
          }
        }

        let listItemPrefix: null | string = null
        if (node.name === 'li') {
          if (parent.name === 'ol') {
            listItemPrefix = `${index + 1}. `
          } else if (parent.name === 'ul') {
            listItemPrefix = BULLET
          }
        }

        let shouldSetLineAfter = false

        const classStyle: any = {}
        let isIframe = parentIframe || 0
        if (node.name === 'div') {
          if (node.attribs.align === 'center') {
            classStyle.alignItems = 'center'
            classStyle.justifyContent = 'center'
            classStyle.flex = 1
          }
          if (node.attribs.class) {
            const classNameArr = node.attribs.class.split(' ')
            for (const name of classNameArr) {
              switch (name) {
                case 'ml64':
                  classStyle.paddingLeft = 10
                  classStyle.flex = 5
                  classStyle.flexWrap = 'wrap'
                  break
                case 'pd10':
                  classStyle.padding = 8
                  break
                case 't4':
                case 't3':
                case 't2':
                case 't1':
                  classStyle.maxWidth = opts.modeInfo.width - opts.imagePaddingOffset
                  classStyle.flexDirection = 'row'
                  classStyle.justifyContent = 'center'
                  classStyle.alignItems = 'flex-start'
                  classStyle.elevation = 1
                  classStyle.marginTop = 2
                  classStyle.marginBottom = 2
                  classStyle.backgroundColor = opts.modeInfo.backgroundColor
                  isIframe = 104
                  break
                default:
                  break
              }
            }
          }
        } else if (inlineElements.includes(node.name) === false) {
          switch (node.name) {
            case 'table':
              classStyle.backgroundColor = opts.modeInfo.brighterLevelOne
              // classStyle.minWidth = (opts.modeInfo.width - opts.imagePaddingOffset) / 4 * 3
              // const { width: SCEEN_WIDTH } = Dimensions.get('window')
              classStyle.width = opts.modeInfo.width - opts.imagePaddingOffset - isIframe
              classStyle.minWidth = opts.modeInfo.width - opts.imagePaddingOffset - isIframe
              break
            case 'tr':
              classStyle.flexDirection =  'row'
              classStyle.flexWrap =  'wrap'
              classStyle.justifyContent = 'space-between'
              classStyle.alignItems =  'stretch'
              break
            case 'td':
              classStyle.flex = index === 1 ? 2 : 1
              classStyle.alignItems = 'center'
              classStyle.justifyContent = 'flex-start'
              classStyle.padding = 2
              classStyle.borderWidth = 1
              classStyle.borderColor = opts.modeInfo.backgroundColor
              inInsideView = false
              break
            default:
              // console.log(node.name, node.children.length)
              break
          }
        }

        const flattenStyles: any = StyleSheet.flatten([
          parent ? opts.styles[parent.name] : null,
          classStyle
        ])

        const isNestedImage = inInsideView && node.name === 'a' && node.children
          && node.children.length !== 0 && node.children.some(item => item.name === 'img')
        // log('判断是渲染View还是渲染Text',inInsideView, node.name === 'a' && node.children && node.children.length === 1 && node.children[0].name === 'img',
        //   node.name === 'a' && node.children && node.children.length !==0 && node.children.some(item => item.name === 'img')
        // , 'wow', depth)

        if (inInsideView && (inlineElements.includes(node.name) === false || isNestedImage)) {

          if (node.name === 'br') {
            // P9内容的换行规则
            if (node.prev && ['br'].includes(node.prev.name)) {
              shouldSetLineAfter = true
            }
          }

          if (flattenStyles.fontSize) delete flattenStyles.fontSize
          if (flattenStyles.fontFamily) delete flattenStyles.fontFamily
          if (flattenStyles.fontWeight) delete flattenStyles.fontWeight
          if (node.children && node.children.length === 0) {
            if (node.prev && inlineElements.includes(node.prev.name)) {
              return
            }
            return <Text key={index}>{'\n'}</Text>
          }
          log('渲染View组件', node.name, isNestedImage, depth)
          return (
            <View key={index} style={flattenStyles}>
              {domToElement(node.children, node, inInsideView, depth + 1, isIframe)}
              {
                shouldSetLineAfter && linebreakAfter && (
                  <Text key={index} onPress={linkPressHandler} style={parent ? opts.styles[parent.name] : null}>{linebreakAfter}</Text>
                )
              }
            </View>
          )
        } else {
          log('渲染Text组件', inInsideView, node.name, depth)
          let inlineNode = renderInlineNode(index, [], inInsideView)
          // console.log('???', parent && parent.attribs && parent.attribs.href, parent && parent.name, '====>')
          return (
            <Text key={index} style={flattenStyles}>{domToElement(node.children, node, false, depth + 1, isIframe)}
              {inlineNode.length !== 0 && inlineNode}
            </Text>
          )
        }
      }
    })
  }

  const handler = new htmlparser.DomHandler(function (err, dom) {
    if (err) done(err)
    done(null, domToElement(dom, null, !opts.shouldForceInline))
  })
  const parser = new htmlparser.Parser(handler)
  parser.write(rawHtml)
  parser.done()
}