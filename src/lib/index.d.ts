
export declare function htmlToMG(html: HTMLElement, options?: OptionalSettings): Promise<TargetNode | null>
export declare function postProcess(TargetNode): Promise<TargetNode>
export declare function renderToMasterGo(root: TargetNode): Promise<ValidNode | null>

export type ValidNode = (FrameNode | TextNode | RectangleNode | PenNode) & { [key: string]: any }

/**
 * 额外的属性
 */
interface PlusAttributes {
  /**
   * 图层下标
   */
  index: number
}

/**
 * FrameNode定义的覆盖层
 */
export interface IFrameNode extends Omit<FrameNode, 'children'>, PlusAttributes {
  type: 'FRAME'
  children: Array<TargetNode>
}

/**
 * RectangleNode定义的覆盖层
 */
export interface IRectangleNode extends RectangleNode, PlusAttributes {
  type: 'RECTANGLE'
}

/**
 * TextNode定义的覆盖层
 */
export interface ITextNode extends TextNode, PlusAttributes {
  type: 'TEXT'
  textStyles: Array<TextSegStyle>
}

/**
 * svg图层数据
 */
export interface ISvgNode extends LayoutMixin, PlusAttributes {
  type: 'PEN'
  content: string
}

/**
 * 转换的目标类型
 */
export type TargetNode = IFrameNode | ITextNode | IRectangleNode | ISvgNode

/**
 * 向下传递的属性
 */
export interface PassTargetProps {
  // 坐标。注意，这俩是计算出来的，css里并没有
  x: string
  y: string
}

/**
 * 支持的属性
 */
export interface TargetProps extends PassTargetProps {

  visibility: string

  width: string
  height: string
  background: string
  backgroundColor: string
  borderColor: string

  // 描边
  border: string
  borderWidth: string
  borderTop: string
  borderTopWidth: string
  borderBottom: string
  borderBottomWidth: string
  borderLeft: string
  borderLeftWidth: string
  borderRight: string
  borderRightWidth: string
  borderStyle: string

  //混合
  opacity: string
  boxShadow: string
  mixBlendMode: string
  // 背景图片的混合模式 目前画布没这个能力
  backgroundBlendMode: string
  filter: string | 'none'
  backdropFilter: string | 'none'

  backgroundImage: string
  backgroundSize: string
  backgroundRepeat: string
  objectFit: string
  top: string
  left: string
  right: string
  bottom: string
  inset: string
  position: string
  transform: string
  transformOrigin: string

  // 文字属性
  color: string
  textAlign: string
  verticalAlign: string
  lineHeight: string
  fontSize: string
  fontFamily: string
  fontStyle: string
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
  borderTopLeftRadius: string
  borderTopRightRadius: string
  borderBottomLeftRadius: string
  borderBottomRightRadius: string

  // 内边距
  padding: string
  paddingTop: string
  paddingRight: string
  paddingBottom: string
  paddingLeft: string

  // flex
  display: string
  flexDirection: string
  gap: string
  columnGap: string
  rowGap: string
  alignItems: string
  justifyContent: string
  flexWrap: string

  // 外边距
  margin: string
  marginTop: string
  marginRight: string
  marginBottom: string
  marginLeft: string

  //剪裁
  overflow: string
  //盒模型
  boxSizing: 'border-box' | 'content-box'
  //额外属性
  isPesudo: boolean
  //填充颜色
  fill: string
  //描边颜色
  stroke: string
  // z轴权重
  zIndex: string | 'auto'
  
  /********************** 自定义属性，css不存在，只解析中用到 ******************** */
  /**
   * 文字自适应模式
   */
  textAutoResize: TextNode['textAutoResize']
  /**
   * 文字是否折行
   */
  isTextWrapped: boolean | undefined
}

/**
 * 处理元素类型
 */
export enum ExtraNodeType {
  PESUDO = 'PESUDO',
  INPUT = 'INPUT',
}

/**
 * 解析设置
 */
export type OptionalSettings = {
  /**
   * 是否导出完整尺寸
   * 当图层带有非overflow: visible属性时，是否开启剪裁, 默认为false
   */
  absoluteBounds?: boolean
}

export {}