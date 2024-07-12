import type { TargetProps } from '../index.d';
import {
  transLayout,
  transBase,
  transScene,
  transBlend,
  transGeometry,
  transRectangleCorner,
  transConstraints,
} from './index';
import { getNumber } from '../helpers';
import { options } from '../helpers/config'

// 可能会存x和y不同的方式 例如 'scroll hidden'
const overFlowEnum = ['hidden', 'scroll', 'auto', 'clip', 'overlay']

export const transContainer = (styles: TargetProps, parentStyles: TargetProps, name: string) => {
  const result = {} as DefaultContainerMixin;
  Object.assign(result, transLayout(styles, 'FRAME', parentStyles));
  Object.assign(result, transBase(name, styles));
  Object.assign(result, transScene(styles));
  Object.assign(result, transBlend(styles));
  Object.assign(result, transGeometry(styles, 'FRAME'));
  Object.assign(result, transRectangleCorner(styles));
  Object.assign(result, transConstraints(styles, parentStyles));
  return result;
}

const translateAlign = (cssAlign: string): AutoLayout['mainAxisAlignItems'] => {
  switch (cssAlign) {
    case 'flex-start':
      return 'FLEX_START';
    case 'flex-end':
      return 'FLEX_END';
    case 'center':
      return 'CENTER';
    case 'space-between':
      return 'SPACING_BETWEEN';
    default:
      return 'FLEX_START';
  }
}

/**
 * 子元素统一采用绝对定位
 * 
 */
const transAutoLayout = (styles: TargetProps): Partial<AutoLayout> => {
  const result = {} as AutoLayout;
  if (!['inline-flex', 'flex'].includes(styles.display)) {
    // 如果有padding则加自动布局 没有则不加
    if (getNumber(styles.paddingTop) || getNumber(styles.paddingBottom) || getNumber(styles.paddingLeft) || getNumber(styles.paddingRight)) {
      result.flexMode = 'VERTICAL'
    } else {
      return result
    }
  } else {
    const isHorizontal = styles.flexDirection === 'row';
    result.flexMode = isHorizontal ? 'HORIZONTAL' : 'VERTICAL';
    result.flexWrap = styles.flexWrap === 'wrap'? 'WRAP' : 'NO_WRAP';
    result.itemSpacing = getNumber(isHorizontal ? styles.rowGap : styles.columnGap);
    result.crossAxisSpacing = getNumber(isHorizontal ? styles.columnGap : styles.rowGap)
    result.mainAxisAlignItems = translateAlign(styles.justifyContent);
    result.crossAxisAlignItems = translateAlign(styles.alignItems) as AutoLayout['crossAxisAlignItems'];
    if (isHorizontal) {
      if (styles.width) result.mainAxisSizingMode = 'FIXED';
      if (styles.height) result.crossAxisSizingMode = 'FIXED';
    } else {
      if (styles.width) result.crossAxisSizingMode = 'FIXED';
      if (styles.height) result.mainAxisSizingMode = 'FIXED';
    }
  }

  result.paddingTop = getNumber(styles.paddingTop);
  result.paddingRight = getNumber(styles.paddingRight);
  result.paddingBottom = getNumber(styles.paddingBottom);
  result.paddingLeft = getNumber(styles.paddingLeft);

  // 描边是否包含在布局计算中
  result.strokesIncludedInLayout = styles.boxSizing === 'border-box'? true : false

  return result;
}

export const transFrameContainer = (styles: TargetProps) => {
  const result = {} as FrameContainerMixin;
  Object.assign(result, transAutoLayout(styles));
  if (options.absoluteBounds) {
    //完整尺寸
    result.clipsContent = false
  } else {
    //超出剪裁
    result.clipsContent = overFlowEnum.some(situation => styles.overflow.includes(situation));
  }
  return result;
}