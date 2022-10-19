import { TargetProps } from '../index.d';
import { transPx } from './utils';

const transColor = (color: string) => {
    if (!color) return null;
    const result = {
        r: 0,
        g: 0,
        b: 0,
        a: 1,
    };
    const rgbaRaw = new RegExp(/rgb\((.*)\)/).exec(color) || new RegExp(/rgba\((.*)\)/).exec(color);
    if (!rgbaRaw) return result;
    const rgba = rgbaRaw[1].split(',');
    result.r = Number(rgba[0]) / 255;
    result.g = Number(rgba[1]) / 255;
    result.b = Number(rgba[2]) / 255;
    result.a = Number(rgba[3] ?? 1);
    return result;
}

const transSolidColor = (color: string) => {
    const result = {
        type: 'SOLID',
        isVisible: true,
        alpha: 1,
        blendMode: 'NORMAL',
        color: transColor(color),
    } as SolidPaint;
    return result;
}

const transScaleMode = (size?: string, repeat?: string) => {
    if (repeat === 'no-repeat') return 'FILL';
    if (repeat === 'repeat') return 'TILE';
    if (size === 'contain') return 'FIT';
    if (size === 'cover') return 'STRETCH';
    return 'FILL';
}

const transImagePaint = (imgUrl: string, size?: string, repeat?: string) => {
    const result = {
        type: 'IMAGE',
        isVisible: true,
        alpha: 1,
        blendMode: 'NORMAL',
        imageRef: imgUrl,
        scaleMode: transScaleMode(size, repeat),
    } as ImagePaint;
    return result;
}

interface ImageConfig {
    backgroundImage?: string;
    backgroundSize?: string;
    backgroundRepeat?: string;
}

const transPaint = (bgColor: string, { backgroundImage, backgroundRepeat, backgroundSize }: ImageConfig) => {
    const result = [] as Paint[];
    if (bgColor) result.push(transSolidColor(bgColor));
    if (backgroundImage && backgroundImage !== 'none') result.push(transImagePaint(backgroundImage, backgroundSize, backgroundRepeat));
    return result;
}

const transBGColor = (color: string, imgConfig: ImageConfig = {}) => {
    return transPaint(color, imgConfig);
}

const transStrokeColor = (color: string, imgConfig: ImageConfig = {}) => {
    return transPaint(color, imgConfig);
}

export const transGeometry = (styles: TargetProps) => {
    const fills = transBGColor(styles.backgroundColor, {
        backgroundImage: styles.backgroundImage,
        backgroundRepeat: styles.backgroundRepeat,
        backgroundSize: styles.backgroundSize,
    });
    const strokes = transStrokeColor(styles.borderColor);
    const result = {} as GeometryMixin;
    result.fills = fills;
    result.strokes = strokes;
    result.strokeWeight = transPx(styles.borderWidth);
    result.strokeAlign = 'CENTER';
    result.strokeCap = 'NONE';
    result.strokeJoin = 'MITER';

    return result;
}