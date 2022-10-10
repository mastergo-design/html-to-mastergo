/**
 * 转换的目标类型
 */
export type TargetNode = FrameNode | TextNode;

/**
 * 支持的属性
 */
export interface TargetProps {
    width: string;
    height: string;
}