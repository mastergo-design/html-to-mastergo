import type { TargetProps, ITextNode, TargetNode } from './index.d';
import {
  transShape,
} from './mixins';
import { getNumber } from './mixins/utils';

/**
 * 字重map
 */
export const FONT_WEIGHTS = {
  '100': 'Ultralight',
  '200': 'Thin',
  '300': 'Light',
  '400': 'Regular',
  '500': 'Medium',
  '600': 'Regular', // SemiBold处理成Regular
  '700': 'Bold',
  '800': 'Heavy',
} as const

// 水平对齐方式
const transTextAlign = (align: string): TextNode['textAlignHorizontal'] => {
  switch (align) {
    case 'left':
      return 'LEFT';
    case 'center':
      return 'CENTER';
    case 'right':
      return 'RIGHT';
    case 'justify':
      return 'JUSTIFIED';
    default:
      return 'LEFT';
  }
}

//垂直对齐
function transVerticalAlign(align: string): TextNode['textAlignVertical'] {
  switch (align) {
    case 'middle': 
      return 'CENTER'
    case 'bottom':
      return 'BOTTOM'
    default:
      return 'TOP'
  }
}

//文字装饰
function transTextDecoration(decoration: string): TextSegStyle['textStyle']['textDecoration'] {
  switch (decoration) {
    case 'underline':
      return 'UNDERLINE'
    case 'line-through':
      return 'STRIKETHROUGH'
    case 'node':
    default:
      return 'NONE'
  }
}

const transTextStyle = (fontStyle: string, fontWeight: keyof typeof FONT_WEIGHTS) => {
  // 获取字重
  const weight = FONT_WEIGHTS[fontWeight]
  // fontStyle
  let style = 'Regular'
  switch (fontStyle) {
    case 'italic':
      style = 'Italic';
    case 'oblique':
      style = 'Italic';
    default:
      style = 'Regular';
  }
  // mastergo style是 fontweight + style Regular不显示
  return style === 'Italic'? `${weight} ${style}` : weight
}

// 计算在画布中实际行高
function calculateLineHeight(styles: TargetProps) {
  if (styles.boxSizing === 'border-box') {
    // 怪异盒模型 行高需要加上下borderWidth, mg中描边不参与高度计算
    return Math.min(getNumber(styles.height), getNumber(styles.lineHeight) + getNumber(styles.borderTopWidth) + getNumber(styles.borderBottomWidth))
  } else {
    // 标准盒模型
    return getNumber(styles.lineHeight)
  }
}

export const transformText = (text: Text, styles: TargetProps, parentStyles: TargetProps) => {
  if (!text.textContent || styles.display === 'none') return null;
  const result = {} as ITextNode;

  result.characters = text.textContent || '';
  result.type = 'TEXT';

  // 文字默认单行模式
  result.textAutoResize = 'WIDTH_AND_HEIGHT'
  // 文字片段实际占据行高
  const lineHeight = getNumber(styles.lineHeight)
  const height = getNumber(styles.height)
  if (height >= lineHeight * 2) {
    // 文字具有多行
    result.textAutoResize = 'NONE'
  }

  //对齐
  result.textAlignHorizontal = transTextAlign(styles.textAlign);
  result.textAlignVertical = transVerticalAlign(styles.verticalAlign);

  //分段样式 默认一段
  result.textStyles = [{
    start: 0,
    end: result.characters.length,
    textStyle: {
      lineHeight: {
        unit: 'PIXELS',
        value: calculateLineHeight(styles),
      },
      fontSize: getNumber(styles.fontSize),
      fontName: {
        family: styles.fontFamily,
        style: transTextStyle(styles.fontStyle, styles.fontWeight as keyof typeof FONT_WEIGHTS),
      },
      textDecoration: transTextDecoration(styles.textDecorationLine)
    },
  } as TextSegStyle];

  // 统一文字颜色和背景色的处理
  styles.backgroundColor = styles.color;
  const shape = transShape(text.textContent || '文字', styles, parentStyles, 'TEXT');
  Object.assign(result, shape);

  return result;
};