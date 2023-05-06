import type { TargetProps, ITextNode } from './index.d';
import {
  transShape,
} from './mixins';
import { getNumber, FONT_WEIGHTS } from './helpers';

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
    let lineHeight = styles.lineHeight === 'normal'?  getNumber(styles.fontSize) * 1.14 : getNumber(styles.lineHeight) 
    // 怪异盒模型 行高需要加上下borderWidth, mg中描边不参与高度计算
    return Math.min(getNumber(styles.height), lineHeight + getNumber(styles.borderTopWidth) + getNumber(styles.borderBottomWidth))
  } else {
    // 标准盒模型
    return getNumber(styles.lineHeight)
  }
}

//TODO: hyperlink
export const transformText = (text: HTMLElement, styles: TargetProps, parentStyles: TargetProps) => {
  if (!text.textContent || styles.display === 'none') {
    // 非输入框
    return null;
  }
  const result = {} as ITextNode;

  const { 
    overflow, 
    textOverflow, 
    whiteSpace, 
    display, 
    webkitBoxOrient, 
    webkitLineClamp, 
    isTextWrapped, 
    textAlign, 
    verticalAlign,
    fontFamily,
    fontSize,
    fontStyle,
    fontWeight,
    letterSpacing,
    textDecorationLine,
    color,
  } = styles

  result.characters = text.textContent || '';
  result.type = 'TEXT';

  // 文字模式 如果文字折行则不使用单行模式
  if (overflow === 'hidden' && textOverflow === 'ellipsis' && ((whiteSpace === 'nowrap') || (display === '-webkit-box' && webkitBoxOrient === 'vertical' && getNumber(webkitLineClamp) > 0))) {
    // 当有截断时，单行截断的文字使用range计算的width会有偏差 这里延用父元素的宽度，不再使用计算的文字宽度
    styles.width = parentStyles.width
    result.textAutoResize = 'TRUNCATE'
  } else if (isTextWrapped) {
    // 文字具有多行
    result.textAutoResize = 'NONE'
  } else {
    result.textAutoResize = 'WIDTH_AND_HEIGHT'
  }
  // 文字片段实际占据行高
  let lineHeight = getNumber(fontSize) * 1.14
  if (styles.lineHeight.endsWith('px')) {
    lineHeight = getNumber(styles.lineHeight)
  }


  //对齐
  result.textAlignHorizontal = transTextAlign(textAlign);
  result.textAlignVertical = transVerticalAlign(verticalAlign);

  //分段样式 默认一段
  result.textStyles = [{
    start: 0,
    end: result.characters.length,
    textStyle: {
      lineHeight: {
        unit: 'PIXELS',
        value: calculateLineHeight(styles),
      },
      fontSize: getNumber(fontSize),
      fontName: {
        family: fontFamily,
        style: transTextStyle(fontStyle, fontWeight as keyof typeof FONT_WEIGHTS),
      },
      letterSpacing: {
        value: getNumber(letterSpacing) || 0,
        unit: 'PIXELS',
      },
      textDecoration: transTextDecoration(textDecorationLine)
    },
  } as TextSegStyle];

  // 统一文字颜色和背景色的处理
  styles.backgroundColor = color;
  const shape = transShape(result.characters || '文字', styles, parentStyles, 'TEXT');
  Object.assign(result, shape);

  return result;
};