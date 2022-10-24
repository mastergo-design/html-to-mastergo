import type { TargetProps, ITextNode, TargetNode } from './index.d';
import {
    transShape,
} from './mixins';
import { transPx } from './mixins/utils';

const transTextAlign = (align: string): TextNode['textAlignHorizontal'] => {
    switch (align) {
        case 'left':
            return 'LEFT';
        case 'center':
            return 'CENTER';
        case 'right':
            return 'RIGHT';
        case 'justify':
            return 'JUSTIFIED';
        default:
            return 'LEFT';
    }
}

const transTextStyle = (fontStyle: string) => {
    switch (fontStyle) {
        case 'italic':
            return 'Italic';
        case 'oblique':
            return 'Italic';
        default:
            return 'Regular';
    }
}

export const transformText = (text: Text, styles: TargetProps) => {
    if (!text.textContent) return {} as TargetNode;
    const result = {} as ITextNode;

    result.characters = text.textContent || '';
    result.type = 'TEXT';
    result.textAlignHorizontal = transTextAlign(styles.textAlign);
    result.textStyles = [{
        start: 0,
        end: result.characters.length,
        textStyle: {
            lineHeight: {
                unit: 'PIXELS',
                value: transPx(styles.lineHeight),
            },
            fontSize: transPx(styles.fontSize),
            fontName: {
                family: styles.fontFamily,
                style: transTextStyle(styles.fontStyle),
            },
        },
    } as any];

    // 统一文字颜色和背景色的处理
    styles.backgroundColor = styles.color;
    const shape = transShape(text.textContent || '', styles);
    Object.assign(result, shape);

    result.x = 0;
    result.y = 0;

    return result;
};