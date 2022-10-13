import type { TargetProps, ITextNode } from './index.d';
import {
    transShape,
} from './mixins';

export const transformText = (text: Text, styles: TargetProps) => {
    const result = {} as ITextNode;

    result.characters = text.textContent || '';
    result.type = 'TEXT';

    // 统一文字颜色和背景色的处理
    styles.backgroundColor = styles.color;
    const shape = transShape(text.textContent || '', styles);
    Object.assign(result, shape);

    return result;
};