/**
 * FrameNode定义的覆盖层
 */
export interface IFrameNode extends FrameNode {
    type: 'FRAME';
    children: Array<SceneNode>;
}

/**
 * RectangleNode定义的覆盖层
 */
export interface IRectangleNode extends RectangleNode {
    type: 'RECTANGLE';
}

/**
 * 转换的目标类型
 */
export type TargetNode = IFrameNode | TextNode | IRectangleNode;

/**
 * 支持的属性
 */
export interface TargetProps {
    width: string;
    height: string;
    backgroundColor: string;
    borderColor: string;
    borderWidth: string;
    borderStyle: string;
}