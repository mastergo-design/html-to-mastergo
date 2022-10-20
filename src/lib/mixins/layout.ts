import { TargetProps } from '../index.d';
import { transPx } from './utils';

export const transLayout = (styles: TargetProps) => {
    const result = {} as LayoutMixin;
    result.width = styles.width === 'auto' ? 0 : transPx(styles.width);
    result.height = styles.height === 'auto' ? 0 : transPx(styles.height);
    result.x = transPx(styles.x);
    result.y = transPx(styles.y);
    return result;
};