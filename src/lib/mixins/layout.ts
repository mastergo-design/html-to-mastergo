import { TargetProps } from '../index.d';
import { transPx } from './utils';

const extractTransform = (transform: string) => {
    const data = (/matrix\((.*)\)/.exec(transform) || [])[1] || '';
    const [a, b, c, d, e, f] = data.split(',').map((item: String) => Number(item));
    return { a, b, c, d, e, f };
}

export const transLayout = (styles: TargetProps) => {
    const result = {} as LayoutMixin;
    result.width = styles.width === 'auto' ? 0 : (transPx(styles.width) + transPx(styles.marginLeft) + transPx(styles.marginLeft));
    result.height = styles.height === 'auto' ? 0 : (transPx(styles.height) + transPx(styles.marginTop) + transPx(styles.marginBottom));
    result.x = transPx(styles.x);
    result.y = transPx(styles.y);
    if (styles.position === 'absolute') result.x = transPx(styles.left);
    if (styles.position === 'absolute') result.y = transPx(styles.top);
    if (styles.transform) {
        const matrix = extractTransform(styles.transform);
        result.x += matrix.e || 0;
        result.y += matrix.f || 0;
    }
    return result;
};