import type { TargetNode, TargetProps, IFrameNode } from './index.d';
import { getStyles } from './getStyles';
import { transformText } from './transformText';
import { transformRect } from './transformRect';


/**
 * 处理Text节点
 * note: Text的样式只能由上层传入
 */
const processOneText = (text: Text, styles: TargetProps) => {
    if (!text.textContent) return;
    let result = {} as TextNode;

    // 处理文本属性
    result = transformText(text, styles);

    return result;
}

/**
 * 处理Element节点
 */
const processOneElement = (element: Element) => {
    const styles = getStyles(element);
    // 无子图层则当做矩形处理
    if (!element.hasChildNodes()) return transformRect(element.tagName, styles);
    const result = {} as IFrameNode;

    /**
     * 处理当前图层属性
     */

    /**
     * 递归处理子图层
     */
    result.children = [];
    element.childNodes.forEach(node => {
        if (node.nodeType === Node.ELEMENT_NODE) {
            const child = processOneElement(node as Element);
            if (child) {
                result.children.push(child);
            }
        }
        if (node.nodeType === Node.TEXT_NODE) {
            const child = processOneText(node as Text, styles);
            if (child) {
                result.children.push(child);
            }
        }
    });

    return result;
}

export const htmlToMG = (html: Element): TargetNode => {
    const result = processOneElement(html);
    console.log(result);
    return result;
}