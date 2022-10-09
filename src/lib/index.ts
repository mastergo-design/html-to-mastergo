import type { TargetNode, TargetProps } from './index.d';
import { getStyles } from './getStyles';
import { transformElement } from './transformElement';
import { transformText } from './transformText';


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
    let result = {} as TargetNode;

    /**
     * 处理当前图层属性
     */
    const styles = getStyles(element);
    result = transformElement(element);

    /**
     * 递归处理子图层
     */
    if (element.childNodes) {
        ((result as FrameNode).children as Array<TargetNode>) = [];
        // 临时添加appendChild方法
        (result as FrameNode).appendChild = (child: TargetNode) => {
            ((result as FrameNode).children as Array<TargetNode>).push(child);
        };
        element.childNodes.forEach(node => {
            if (node.nodeType === Node.ELEMENT_NODE) {
                const child = processOneElement(node as Element);
                if (child) {
                    (result as FrameNode).appendChild(child);
                }
            }
            if (node.nodeType === Node.TEXT_NODE) {
                const child = processOneText(node as Text, styles);
                if (child) {
                    (result as FrameNode).appendChild(child);
                }
            }
        });
        // 删除appendChild方法
        delete (result as any).appendChild;
    }

    return result;
}

export const htmlToMG = (html: Element): TargetNode => {
    return processOneElement(html);
}