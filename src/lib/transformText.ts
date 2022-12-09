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
  return `${weight} ${style === 'Italic'? style: ''}`
}

export const transformText = (text: Text, styles: TargetProps) => {
  if (!text.textContent) return null;
  const result = {} as ITextNode;

  result.characters = text.textContent || '';
  result.type = 'TEXT';
  result.textAlignHorizontal = transTextAlign(styles.textAlign);
  result.textStyles = [{
    start: 0,
    end: result.characters.length,
    textStyle: {
      lineHeight: {
        unit: 'PIXELS',
        value: getNumber(styles.lineHeight),
      },
      fontSize: getNumber(styles.fontSize),
      fontName: {
        family: styles.fontFamily,
        style: transTextStyle(styles.fontStyle, styles.fontWeight as keyof typeof FONT_WEIGHTS),
      },
    },
  } as any];

  // 统一文字颜色和背景色的处理
  styles.backgroundColor = styles.color;
  const shape = transShape(text.textContent || '文字', styles, 'TEXT');
  Object.assign(result, shape);

  // 文字是单独的图层所以x和y都设置为0
  result.x = 0;
  result.y = 0;

  return result;
};