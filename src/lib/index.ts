import type { TargetNode, TargetProps, IFrameNode } from './index.d';
import { getStyles } from './getStyles';
import { transformText } from './transformText';
import { transformRect } from './transformRect';
import { transformFrame } from './transformFrame';
import { transPseudo } from './transPseudo'
import { transformSvg } from './transformSvg';
import { getBoundingClientRect } from './helpers/bound'
import { getPesudoElts, PesudoElt } from './helpers/utils'

/**
 * 处理Element节点
 */
const processOneElement = async (element: HTMLElement, styles: TargetProps, parentStyles: TargetProps) => {
  // 先判空
  if (styles.display === 'none') return null;

  // 如果元素经过transform 此时x y和 width height 会发生改变 这里计算会有错误，需要先重置一下transform
  if (styles.transform !== 'none') {
    element.style.transform = 'unset';
    element.style.transition = 'unset'
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(1)
      }, 100);
    })
  }
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

  // 取伪元素
  const pseudoElts = getPesudoElts(element)

  // svg
  if (element.tagName === 'svg') return transformSvg(element, styles, parentStyles);
  // 无子图层则当做矩形处理
  if (!element.hasChildNodes() && pseudoElts.length === 0) {
    return transformRect(element, styles, parentStyles);
  }

  /**
   * 处理当前图层属性
   */
  const result = transformFrame(element, styles, parentStyles);

  /**
   * 递归处理子图层
   */
  result.children = [];
  let childNodes: (ChildNode | PesudoElt)[] = Array.from(element.childNodes)
  // 合并伪元素数组
  childNodes = childNodes.concat(pseudoElts as any)
  await Promise.allSettled(childNodes.map(async (node) => {
    let child;
    if (node.nodeType === Node.ELEMENT_NODE) {
      const childStyles = getStyles(node as Element);
      child = await processOneElement(node as HTMLElement, {
        ...childStyles,
      }, styles);
    }
    if (node.nodeType === Node.TEXT_NODE) {
      //文字节点无法获取getComputedStyle，延用父元素的

      // 获取文字的实际包围盒
      const range = document.createRange();
      range.selectNode(node);
      const rect = range.getBoundingClientRect();
      range.detach();

      child = transformText(node as Text, {
        ...styles,
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
    } else if ((node as PesudoElt).nodeType === 'PESUDO') {
      child = transPseudo((node as PesudoElt).type, (node as PesudoElt).styles as TargetProps, styles)
    }
    if (child && child.type) {
      result.children.push(child);
    }
    return true
  }))

  if (styles.transform !== 'none') {
    // 重置回来
    element.style.transform = ''
    element.style.transition = ''
  }
  return result;
}

const htmlToMG = async (html: HTMLElement): Promise<TargetNode | null> => {
  if (!getComputedStyle) throw new Error('getComputedStyle is not defined');
  const result = await processOneElement(html, getStyles(html) as TargetProps, null as any);
  console.log('转换结果', result);
  return result;
}

export { htmlToMG }