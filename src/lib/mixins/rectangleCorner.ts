import { TargetProps } from '../index.d';
import { transPx } from './utils';

export const transRectangleCorner = (styles: TargetProps) => {
    const result = {} as RectangleCornerMixin;
    result.topLeftRadius = transPx(styles.borderTopLeftRadius) || 0;
    result.topRightRadius = transPx(styles.borderTopRightRadius) || 0;
    result.bottomLeftRadius = transPx(styles.borderBottomLeftRadius) || 0;
    result.bottomRightRadius = transPx(styles.borderBottomRightRadius) || 0;
    return result;
}