import { TargetProps } from '../index.d';
import {
    transLayout,
    transBase,
    transScene,
    transBlend,
    transRectangleCorner,
} from './index';
import { transPx } from './utils';

export const transContainer = (styles: TargetProps, name: string) => {
    const result = {} as DefaultContainerMixin;
    const layout = transLayout(styles);
    Object.assign(result, layout);
    Object.assign(result, transBase(name));
    Object.assign(result, transScene());
    Object.assign(result, transBlend());
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

const transAutoLayout = (styles: TargetProps) => {
    const result = {} as AutoLayout;
    if (styles.display !== 'flex') return result;
    // wrap现在不支持
    if (styles.flexWrap === 'wrap') return result;

    const isHorizontal = styles.flexDirection === 'row';
    result.flexMode = isHorizontal ? 'HORIZONTAL' : 'VERTICAL';
    result.itemSpacing = transPx(isHorizontal ? styles.rowGap : styles.columnGap);
    result.mainAxisAlignItems = translateAlign(styles.justifyContent);
    result.crossAxisAlignItems = translateAlign(styles.alignItems) as AutoLayout['crossAxisAlignItems'];
    if (isHorizontal) {
        if (styles.width) result.mainAxisSizingMode = 'FIXED';
        if (styles.height) result.crossAxisSizingMode = 'FIXED';
    } else {
        if (styles.width) result.crossAxisSizingMode = 'FIXED';
        if (styles.height) result.mainAxisSizingMode = 'FIXED';
    }
    result.paddingTop = transPx(styles.paddingTop);
    result.paddingRight = transPx(styles.paddingRight);
    result.paddingBottom = transPx(styles.paddingBottom);
    result.paddingLeft = transPx(styles.paddingLeft);

    return result;
}

export const transFrameContainer = (styles: TargetProps) => {
    const result = {} as FrameContainerMixin;
    Object.assign(result, transAutoLayout(styles));
    result.clipsContent = false;
    return result;
}