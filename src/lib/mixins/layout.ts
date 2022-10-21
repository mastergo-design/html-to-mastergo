import { TargetProps } from '../index.d';
import { transPx } from './utils';

export const transLayout = (styles: TargetProps) => {
    const result = {} as LayoutMixin;
    result.width = styles.width === 'auto' ? 0 : (transPx(styles.width) + transPx(styles.marginLeft) + transPx(styles.marginLeft));
    result.height = styles.height === 'auto' ? 0 : (transPx(styles.height) + transPx(styles.marginTop) + transPx(styles.marginBottom));
    result.x = transPx(styles.x);
    result.y = transPx(styles.y);
    return result;
};