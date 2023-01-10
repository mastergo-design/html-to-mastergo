import type { TargetProps } from "../index.d";
import { getNumber, transColor } from '../helpers/utils';

/**
 * 处理特效 
 */
const transEffects = (styles: TargetProps): {effects: Effect[]} => {
  const result = {} as { effects: Effect[] }

  let boxShadow = styles.boxSizing

  if (boxShadow !== 'none') {
    if (boxShadow.startsWith("rgb")) {
      // computed style把rgba放在前面了 类似于 'rgba(0, 0, 255, 0.2) 12px 12px 2px 1px'
      const colorMatch = boxShadow.match(/(rgba?\(.+?\))(.+)/);
      if (colorMatch) {
        boxShadow = (colorMatch[2] + " " + colorMatch[1]).trim();
      }
    }
  }

  // 根据 inset区分内外阴影
  return result
}

export const transBlend = (styles: TargetProps) => {

  return {
    opacity: getNumber(styles.opacity),
    blendMode: 'PASS_THROUGH',
    isMask: false,
  } as BlendMixin;
};