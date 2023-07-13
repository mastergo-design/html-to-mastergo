import { TargetNode, TargetProps, ExtraNodeType, OptionalSettings } from './index.d';
import { getStyles } from './getStyles';
import { transformText } from './transformText';
import { transformRect } from './transformRect';
import { transformFrame } from './transformFrame';
import { transPseudo } from './transPseudo'
import { transformSvg } from './transformSvg';
import { getBoundingClientRect, getPesudoElts, PesudoElt, sortByZIndex, isTextWrapped, createPesudoText, PesudoInputText, isTextArea, isInput, isSvg, clearTransformAndTransition, getNumber } from './helpers'
import { updateOptions } from './helpers/config'
import { render as renderToMasterGo } from './render'
import { postProcess } from './postProcess'

const modifiedElements: CallableFunction[] = []

// 如果元素经过transform 此时x y和 width height 会发生改变 这里计算会有错误，需要先重置一下transform
const preProcess = async (styles: TargetProps, element: HTMLElement) => {
  const resetOriginalTransformAndTransition = await clearTransformAndTransition(styles, element)
  modifiedElements.push(resetOriginalTransformAndTransition);
}

/**
 * 处理Element节点
 */
const processOneElement = async (element: HTMLElement, styles: TargetProps, parentStyles: TargetProps) => {
  // 先判空
  if (styles.display === 'none') return null;

  await preProcess(styles, element)

  // 包围盒
  const bound = getBoundingClientRect(element)
  // 所有元素都可能要走这个逻辑
  if (styles.width === 'auto' || styles.height === 'auto') {
    const range = document.createRange();
    range.selectNode(element);
    const rect = range.getBoundingClientRect();
    styles.width = `${rect.width}px`;
    styles.height = `${rect.height}px`;
    range.detach();
  }

  styles.x = `${bound.left}px`
  styles.y = `${bound.top}px`
  styles.width = `${bound.width}px`
  styles.height = `${bound.height}px`

  // svg
  if (isSvg(element)) return transformSvg(element, styles, parentStyles);

  // 判断一下是否是输入框
  let textNode: PesudoInputText | null = null
  if (isInput(element) || isTextArea(element)) {
    // 输入框增加超出剪裁
    styles.overflow = 'hidden'
    textNode = createPesudoText(element as HTMLInputElement | HTMLTextAreaElement, styles)
  }

  // 取伪元素
  const pseudoElts = getPesudoElts(element)

  // 无子图层则当做矩形处理
  if (!element.hasChildNodes() && pseudoElts.length === 0 && !textNode) {
    return transformRect(element, styles, parentStyles);
  }

  /**
   * 处理当前图层属性
   */
  const result = transformFrame(element, styles, parentStyles);
  /**
   * 递归处理子图层
   * textArea不应该有childNodes https://github.com/facebook/react/pull/11639
   */
  result.children = [];
  let childNodes: (ChildNode | PesudoElt | PesudoInputText)[] = element.tagName !== 'TEXTAREA'? Array.from(element.childNodes ?? []) : []
  
  // 合并伪元素数组和输入框文字
  childNodes = childNodes.concat(pseudoElts as any).concat(textNode!)
  const convertedChildren = (await Promise.allSettled(childNodes.map(async (childNode) => {
    let child;
    if (!childNode) {
      return null
    }
    if (childNode.nodeType === Node.ELEMENT_NODE) {
      const childStyles = getStyles(childNode as Element);
      child = await processOneElement(childNode as HTMLElement, {
        ...childStyles,
      }, styles);
    } else if (childNode.nodeType === Node.TEXT_NODE) {
      //文字节点无法获取getComputedStyle，延用父元素的
      // 获取文字的实际包围盒
      const range = document.createRange();
      range.selectNode(childNode);
      const rect = range.getBoundingClientRect();
      // 判断文字是否折行
      const textWrapped = isTextWrapped(range, getNumber(styles.lineHeight))
      range.detach();
      child = transformText(childNode as any, {
        ...styles,
        isTextWrapped: textWrapped,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        // x和y为当前元素的bounding的x和y减去父节点的x和y
        x: `${rect.x - bound.x}px`,
        y: `${rect.y - bound.y}px`,
        left: `${rect.left}px`,
        right: `${rect.right}px`,
        top: `${rect.top}px`,
        bottom: `${rect.bottom}px`,
      }, styles);
    } else if ((childNode as PesudoElt).nodeType === ExtraNodeType.PESUDO) {
      // 伪元素
      child = transPseudo((childNode as PesudoElt).type, (childNode as PesudoElt).styles as TargetProps, styles)
    } else if (childNode.nodeType === ExtraNodeType.INPUT) {
      // 输入框文字按文字处理
      child = transformText(childNode.node, childNode.styles, Object.assign(childNode.styles, {isChildNodeStretched: styles.isChildNodeStretched}))
    }
    return child
  })))
  result.children = convertedChildren.filter(item => item?.status === 'fulfilled' && !!item?.value).map(item => (item as PromiseFulfilledResult<TargetNode>).value)
  //子元素排序
  result.children?.length && sortByZIndex(result.children as any)

  return result;
}

const htmlToMG = async (html: HTMLElement, options?: OptionalSettings): Promise<TargetNode | null> => {
  options && updateOptions(options)
  if (!getComputedStyle) throw new Error('getComputedStyle is not defined');
  try {
    // 收集被修改的元素数组
    console.log('转换前：', html);
    const result = await processOneElement(html, getStyles(html) as TargetProps, null as any);
    modifiedElements.forEach((clear) => {
      clear()
    })
    modifiedElements.length = 0
    console.log('转换结果', result);
    return result;
  } catch (error) {
    console.error('转换出错', error)
  }
  return null
}

export { htmlToMG, postProcess, renderToMasterGo }