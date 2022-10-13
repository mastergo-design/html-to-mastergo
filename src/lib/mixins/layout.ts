import { TargetProps } from '../index.d';
import { transPx } from './utils';

export const transLayout = (styles: TargetProps) => {
    const result = {} as LayoutMixin;
    result.width = transPx(styles.width);
    result.height = transPx(styles.height);
    result.x = transPx(styles.x);
    result.y = transPx(styles.y);
    return result;
};