import type { TargetNode, TargetProps, PassTargetProps } from './index.d';
import { getStyles } from './getStyles';
import { transformText } from './transformText';
import { transformRect } from './transformRect';
import { transformFrame } from './transformFrame';
import { transPx } from './mixins/utils';

/**
 * 处理Text节点
 * note: Text的样式只能由上层传入
 */
const processOneText = (text: Text, styles: TargetProps) => {
    if (!text.textContent) return {} as TargetNode;

    // 处理文本属性
    const result = transformText(text, styles);

    return result;
}

/**
 * 处理Element节点
 */
const processOneElement = (element: Element, extraStyles: PassTargetProps) => {
    const styles = {
        ...getStyles(element),
        ...extraStyles,
    };
    // 无子图层则当做矩形处理
    if (!element.hasChildNodes()) return transformRect(element.tagName, styles);

    /**
     * 处理当前图层属性
     */
    const result = transformFrame(element.tagName, styles);

    /**
     * 递归处理子图层
     */
    result.children = [];
    element.childNodes.forEach(node => {
        const extra = {} as PassTargetProps;
        extra.x = `${(transPx(styles.paddingLeft) + (result.x || 0))}px`;
        extra.y = `${(transPx(styles.paddingTop) + (result.y || 0))}px`;
        let child;
        if (node.nodeType === Node.ELEMENT_NODE) {
            child = processOneElement(node as Element, extra);
        }
        if (node.nodeType === Node.TEXT_NODE) {
            child = processOneText(node as Text, styles);
        }
        if (child && child.type) {
            result.children.push(child);
        }
    });

    return result;
}

export const htmlToMG = (html: Element): TargetNode => {
    const result = processOneElement(html, {} as PassTargetProps);
    console.log(result);
    return result;
}