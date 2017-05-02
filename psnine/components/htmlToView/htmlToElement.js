import React from 'react';
import {
  Text,
  View,
  TouchableNativeFeedback
} from 'react-native';
import htmlparser from 'htmlparser2-without-node-native';
import entities from 'entities';

import AutoSizedImage from './image';
import AutoSizedWebview from './webview';

const LINE_BREAK = '\n';
const PARAGRAPH_BREAK = '\n\n';
const BULLET = '\u2022 ';
const inlineElements = ['a','span','em','font','label','b','strong','i','small'];
const lineElements = ['pre', 'p', 'br', 'h1', 'h2', 'h3', 'h4', 'h5']

const Img = props => {
  const width = Number(props.attribs['width']) || Number(props.attribs['data-width']) || 0;
  const height = Number(props.attribs['height']) || Number(props.attribs['data-height']) || 0;

  const imgStyle = {
    width,
    height,
  };
  const source = {
    uri: props.attribs.src,
    width,
    height,
    imagePaddingOffset: props.imagePaddingOffset
  };
  return (
    <AutoSizedImage source={source} style={imgStyle} isLoading={props.isLoading} alignCenter={props.alignCenter} linkPressHandler={props.linkPressHandler} />
  );
};

const Web = props => {
  const width = Number(props.attribs['width']) || Number(props.attribs['data-width']) || 0;
  const height = Number(props.attribs['height']) || Number(props.attribs['data-height']) || 0;

  const imgStyle = {
    width,
    height,
  };

  const value = `<html><head></head><body><${props.name} ` + Object.keys(props.attribs).map(name => `${name}="${props.attribs[name]}"`).join(' ') + '/></body></html>'

  return (
    <AutoSizedWebview value={value} style={imgStyle} url={props.attribs.src} />
  );
};

export default function htmlToElement(rawHtml, opts, done) {
  function domToElement(dom, parent) {
    if (!dom) return null;


    let domLen = dom.length;
    let domTemp = {};

    let getNodeData = function(node){
      let nodeData = null;
      if(node.children.length){
        let nodeChild = node.children[0];
        if(nodeChild && nodeChild.data){
          nodeData = nodeChild.data;
        } else {
          nodeData = getNodeData(nodeChild);
        }
      }
      return nodeData;
    };

    let renderInlineNode = function(index){
      let thisIndex = index + 1;
      if(thisIndex < domLen){
        let nextNode = dom[thisIndex];
        if(inlineElements.includes(nextNode.name)){
          domTemp[thisIndex] = true;
          let linkPressHandler = null;
          if (nextNode.name === 'a' && nextNode.attribs && nextNode.attribs.href) {
            linkPressHandler = () => opts.linkHandler(entities.decodeHTML(nextNode.attribs.href))
          }
          let nodeData = getNodeData(nextNode);
          if (!nodeData && nextNode.children && nextNode.children[0] && nextNode.children[0].name === 'img') {
            // 安卓上不允许text中嵌套图片, 因此将domTemp此位置设置为false, 让这个图片跳出renderInlineNode函数
            // 转而让dom.map函数中处理tag的语句来生成图片, 此时返回一个空字符串做跳过
            domTemp[thisIndex] = false;
            return (
              <Text/>
            )
          }
          return (
            <Text key={index} onPress={linkPressHandler} style={ opts.styles[nextNode.name]}>
              { entities.decodeHTML(nodeData) }
              { renderInlineNode(thisIndex)}
            </Text>
          )
        }
        if (nextNode.type === 'text'){
          domTemp[thisIndex] = true;
          return (
            <Text style={ opts.styles['span'] } onPress={()=>null}>
              { entities.decodeHTML(nextNode.data) }
              { renderInlineNode(thisIndex)}
            </Text>
          )
        }
      }

      return null;
    };

    return dom.map((node, index, list) => {
      if(domTemp[index] === true){
        return;
      }

      if (opts.customRenderer) {
        const rendered = opts.customRenderer(node, index, list, parent, domToElement);
        if (rendered || rendered === null) return rendered;
      }

      if (node.type == 'text' && node.data.trim() !== '') {
        let linkPressHandler = null;
        if (parent && parent.name == 'a' && parent.attribs && parent.attribs.href) {
          linkPressHandler = () => opts.linkHandler(entities.decodeHTML(parent.attribs.href))
        }

        return (
          <Text key={index} onPress={linkPressHandler} style={[{ color: opts.modeInfo.standardTextColor }, parent ? opts.styles[parent.name] : null]}>

              { parent && parent.name == 'pre'? LINE_BREAK : null }
              { parent && parent.name == "li"? BULLET : null }
              { parent && parent.name == 'br'? LINE_BREAK : null }
              { parent && parent.name == 'p' && index < list.length - 1 ? PARAGRAPH_BREAK : null }
              { parent && parent.name == 'h1' || parent && parent.name == 'h2' || parent && parent.name == 'h3' || parent && parent.name == 'h4' || parent && parent.name == 'h5'? PARAGRAPH_BREAK :null }

              { entities.decodeHTML(node.data) }

              { renderInlineNode(index) }

          </Text>
        )
      }

      if (node.type === 'tag') {
        if (node.name === 'img') {
          let linkPressHandler = null;
          if (node.attribs && node.attribs.src) {
            linkPressHandler = () => opts.linkHandler(entities.decodeHTML(node.attribs.src));
          }
          return (
              <Img key={index} attribs={node.attribs} 
                    isLoading={opts.shouldShowLoadingIndicator}
                    linkPressHandler={linkPressHandler}
                    alignCenter={opts.alignCenter}
                    imagePaddingOffset={opts.imagePaddingOffset} />
          );
        } else if (node.name === 'embed' || node.type === 'iframe') {
          return (
            <Web key={index} attribs={node.attribs} name={node.name}/>
          )
        }

        let linkPressHandler = null;
        if (node.name === 'a' && node.attribs && node.attribs.href) {
          linkPressHandler = () => opts.linkHandler(entities.decodeHTML(node.attribs.href));
        }

        let linebreakBefore = null;
        let linebreakAfter = null;
        if (lineElements.includes(node.name)) {
          switch (node.name) {
            case 'pre':
              linebreakBefore = LINE_BREAK;
              break;
            case 'p':
              if (index < list.length - 1) {
                linebreakAfter = PARAGRAPH_BREAK;
              }
              break;
            case 'br':
            case 'h1':
            case 'h2':
            case 'h3':
            case 'h4':
            case 'h5':
              linebreakAfter = LINE_BREAK;
              break;
          }
        }

        let listItemPrefix = null;
        if (node.name == 'li') {
          if (parent.name == 'ol') {
            listItemPrefix = `${index + 1}. `;
          } else if (parent.name == 'ul') {
            listItemPrefix = BULLET;
          }
        }

        let shouldSetLineAfter = false
        if (node.name === 'br') {
          if (node.prev && node.prev.name === 'br') {
            shouldSetLineAfter = true
          }
        }

        const classStyle = {}
        if (node.type === 'tag' && node.name === 'div') {
          const classNameArr = (node.attribs.class || '').split(' ')
          for (const name of classNameArr) {
            switch (name) {
              case 'pd10':
                classStyle.padding = 10;
                break;
              case 't4':
              case 't3':
              case 't2':
              case 't1':
                classStyle.elevation = 1
                classStyle.marginBottom = 2
                classStyle.backgroundColor = opts.modeInfo.brighterLevelOne
                break;
              default: 
                // console.log(name)
                break;
            }
          }
        }

        return (
          <View key={index} onPress={linkPressHandler}  style={[parent ? opts.styles[parent.name] : null, classStyle]}>
            {domToElement(node.children, node)}
            {shouldSetLineAfter && linebreakAfter && <Text key={index} onPress={linkPressHandler} style={parent ? opts.styles[parent.name] : null}>{linebreakAfter}</Text>}
          </View>
        )
      }
    });
  }

  let indexT = 0

  const handler = new htmlparser.DomHandler(function(err, dom) {
    if (err) done(err);
    done(null, domToElement(dom));
  });
  const parser = new htmlparser.Parser(handler);
  parser.write(rawHtml);
  parser.done();
}