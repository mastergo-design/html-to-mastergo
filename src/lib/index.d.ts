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
 * TextNode定义的覆盖层
 */
export interface ITextNode extends TextNode {
    type: 'TEXT';
}

/**
 * 转换的目标类型
 */
export type TargetNode = IFrameNode | ITextNode | IRectangleNode;

/**
 * 向下传递的属性
 */
export interface PassTargetProps {
    // 坐标。注意，这俩是计算出来的，css里并没有
    x: string;
    y: string;
}

/**
 * 支持的属性
 */
export interface TargetProps extends PassTargetProps {
    width: string;
    height: string;
    backgroundColor: string;
    borderColor: string;
    borderWidth: string;
    borderStyle: string;

    // 文字颜色
    color: string;

    // 圆角
    borderTopLeftRadius: string;
    borderTopRightRadius: string;
    borderBottomLeftRadius: string;
    borderBottomRightRadius: string;

    // 内边距
    paddingTop: string;
    paddingRight: string;
    paddingBottom: string;
    paddingLeft: string;
}