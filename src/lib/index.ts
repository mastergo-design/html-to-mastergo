import type { TargetNode, TargetProps, PassTargetProps, IFrameNode } from './index.d';
import { getStyles } from './getStyles';
import { transformText } from './transformText';
import { transformRect } from './transformRect';
import { transformFrame } from './transformFrame';
import { transformSvg } from './transformSvg';
import { getNumber } from './mixins/utils';
import { getBoundingClientRect } from './helpers/bound'

const isInline = (display: string) => {
  return display?.includes('inline')
}

/**
 * 处理Element节点
 */
const processOneElement = (element: Element, styles: TargetProps, parent?: IFrameNode) => {
  // 先判空
  if (styles.display === 'none') return null;

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

  // svg
  if (element.tagName === 'svg') return transformSvg(element, styles);
  // 无子图层则当做矩形处理
  if (!element.hasChildNodes()) return transformRect(element, styles);

  /**
   * 处理当前图层属性
   */
  const result = transformFrame(element, styles);

  /**
   * 递归处理子图层
   */
  result.children = [];
  element.childNodes.forEach((node) => {
    let child;
    if (node.nodeType === Node.ELEMENT_NODE) {
      const childStyles = getStyles(node as Element);
      child = processOneElement(node as Element, {
        ...childStyles,
      }, result);
    }
    if (node.nodeType === Node.TEXT_NODE) {
      //文字节点无法获取getComputedStyle，延用父元素的
      child = transformText(node as Text, {
        ...styles,
      });
    }
    if (child && child.type) {
      result.children.push(child);
    }
  })

  return result;
}

const htmlToMG = (html: Element): TargetNode | null => {
  if (!getComputedStyle) throw new Error('getComputedStyle is not defined');
  const result = processOneElement(html, getStyles(html) as TargetProps);
  console.log('转换结果', result);
  return result;
}

export { htmlToMG }