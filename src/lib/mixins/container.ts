import { TargetProps } from '../index.d';
import {
  transLayout,
  transBase,
  transScene,
  transBlend,
  transGeometry,
  transRectangleCorner,
} from './index';
import { getNumber } from './utils';

export const transContainer = (styles: TargetProps, name: string) => {
  const result = {} as DefaultContainerMixin;
  Object.assign(result, transLayout(styles));
  Object.assign(result, transBase(name));
  Object.assign(result, transScene());
  Object.assign(result, transBlend());
  Object.assign(result, transGeometry(styles));
  Object.assign(result, transRectangleCorner(styles));
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
 */
const transAutoLayout = (styles: TargetProps): Partial<AutoLayout> => {
  const result = {} as AutoLayout;
  if (styles.display !== 'flex') {
    return {}
  } else {
    const isHorizontal = styles.flexDirection === 'row';
    result.flexMode = isHorizontal ? 'HORIZONTAL' : 'VERTICAL';
    result.itemSpacing = getNumber(isHorizontal ? styles.rowGap : styles.columnGap);
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

  return result;
}

export const transFrameContainer = (styles: TargetProps) => {
  const result = {} as FrameContainerMixin;
  Object.assign(result, transAutoLayout(styles));
  result.clipsContent = false;
  return result;
}