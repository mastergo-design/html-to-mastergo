import type { TargetProps } from '../index.d';
import { getNumber } from '../helpers/utils';

/**
 * 
 * @param styles css样式
 * @param size 宽度或高度
 * @returns 
 */
const convertCorner = (borderRadius: TargetProps['borderRadius'], size: number) => {
  //px
  const pxMatches = borderRadius?.match(/^(\d+px)/)
  if (pxMatches) {
    return getNumber(pxMatches[0])
  }

  //百分比 百分比圆角计算为宽高乘百分比后的以r1 r2为半径的椭圆的弧度,默认只按正方形算,
  const percentMatches = borderRadius?.match(/^(\d+%)/);
  if (percentMatches) {
    const percent = getNumber(percentMatches[0])
    // 保留两位小数
    return parseFloat((size * percent / 100).toFixed(2))
  }
  return 0
}

/**
 * 普通圆角
 */
export const transCorner = (styles: TargetProps) => {
  const result = {} as CornerMixin;
  result.cornerRadius = convertCorner(styles.borderRadius, getNumber(styles.height))
}

/**
 * 类矩形圆角
 */
export const transRectangleCorner = (styles: TargetProps) => {
  const result = {} as RectangleCornerMixin;
  result.topLeftRadius = convertCorner(styles.borderTopLeftRadius, getNumber(styles.height)) || 0;
  result.topRightRadius = convertCorner(styles.borderTopRightRadius, getNumber(styles.height)) || 0;
  result.bottomLeftRadius = convertCorner(styles.borderBottomLeftRadius, getNumber(styles.height)) || 0;
  result.bottomRightRadius = convertCorner(styles.borderBottomRightRadius, getNumber(styles.height)) || 0;
  return result;
}