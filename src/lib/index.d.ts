export { htmlToMG } from './index'

/**
 * FrameNode定义的覆盖层
 */
export interface IFrameNode extends Omit<FrameNode, 'children'> {
  type: 'FRAME';
  children: Array<TargetNode>;
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
  textStyles: Array<TextSegStyle>;
}

/**
 * svg图层数据
 */
export interface ISvgNode extends LayoutMixin {
  type: 'PEN';
  content: string;
}

/**
 * 转换的目标类型
 */
export type TargetNode = IFrameNode | ITextNode | IRectangleNode | ISvgNode;

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

  visibility: string;

  width: string;
  height: string;
  backgroundColor: string;
  borderColor: string;

  // 描边
  borderWidth: string;
  borderTopWidth: string
  borderBottomWidth: string
  borderLeftWidth: string;
  borderRightWidth: string
  borderStyle: string;

  //混合
  opacity: string;
  boxShadow: string;

  backgroundImage: string;
  backgroundSize: string;
  backgroundRepeat: string;
  objectFit: string;
  top: string;
  left: string;
  right: string;
  bottom: string;
  inset: string;
  position: string;
  transform: string;

  // 文字属性
  color: string;
  textAlign: string;
  verticalAlign: string
  lineHeight: string;
  fontSize: string;
  fontFamily: string;
  fontStyle: string;
  fontWeight: string
  letterSpacing: string
  whiteSpace: string
  textIndent: string
  /**
   * 装饰线 none | underline | line-through
   */
  textDecorationLine: string

  // 圆角
  borderRadius: string
  borderTopLeftRadius: string;
  borderTopRightRadius: string;
  borderBottomLeftRadius: string;
  borderBottomRightRadius: string;

  // 内边距
  paddingTop: string;
  paddingRight: string;
  paddingBottom: string;
  paddingLeft: string;

  // flex
  display: string;
  flexDirection: string;
  gap: string;
  columnGap: string;
  rowGap: string;
  alignItems: string;
  justifyContent: string;
  flexWrap: string;

  // 外边距
  margin: string;
  marginTop: string;
  marginRight: string;
  marginBottom: string;
  marginLeft: string;

  //剪裁
  overflow: string
  //盒模型
  boxSizing: string
  //额外属性
  isPesudo: boolean
}

/**
 * 处理元素类型
 */
export enum ExtraNodeType {
  PESUDO = 'PESUDO',
  INPUT = 'INPUT',
}