import type { TargetNode, TargetProps, PassTargetProps } from './index.d';
import { getStyles } from './getStyles';
import { transformText } from './transformText';
import { transformRect } from './transformRect';
import { transformFrame } from './transformFrame';
import { transformSvg } from './transformSvg';
import { transPx } from './mixins/utils';

const isInline = (display: string) => {
    return display === 'inline' || display === 'inline-block' || display === 'inline-flex';
}

/**
 * 处理Element节点
 */
const processOneElement = (element: Element, styles: TargetProps) => {
    // 先判空
    if (styles.display === 'none') return null;
    // 所有元素都可能要走这个逻辑
    if (styles.width === 'auto' || styles.height === 'auto') {
        const range = document.createRange();
        range.selectNode(element);
        const rect = range.getBoundingClientRect();
        styles.width = `${rect.width}px`;
        styles.height = `${rect.height}px`;
        range.detach();
    }
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
    Array().reduce.call(element.childNodes, ({ xOffset, yOffset }: any, node) => {
        const extra = {} as PassTargetProps;
        extra.x = `${(xOffset)}px`;
        extra.y = `${(yOffset)}px`;
        let child;
        if (node.nodeType === Node.ELEMENT_NODE) {
            const childStyles = getStyles(node as Element);
            child = processOneElement(node as Element, {
                ...childStyles,
                ...extra,
            });
            // inline的情况横向布局
            if (isInline(childStyles.display)) {
                xOffset += child?.width || 0;
            } else {
                yOffset += child?.height || 0;
            }
        }
        if (node.nodeType === Node.TEXT_NODE) {
            child = transformText(node as Text, {
                ...styles,
                ...extra,
            });
        }
        if (child && child.type) {
            result.children.push(child);
        }
        return { xOffset, yOffset };
    }, { // 初始值以frame的左上padding为准
        xOffset: transPx(styles.paddingLeft),
        yOffset: transPx(styles.paddingTop),
    })

    return result;
}

const htmlToMG = (html: Element): TargetNode | null => {
    if (!getComputedStyle) throw new Error('getComputedStyle is not defined');
    const result = processOneElement(html, getStyles(html) as TargetProps);
    console.log(result);
    return result;
}

export { htmlToMG }