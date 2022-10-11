import { TargetProps } from '../index.d';

const transPx = (px: string) => {
    if (!px) return 0;
    const result = Number(px.replace('px', ''));
    return result;
}

const transColor = (color: string) => {
    const result = {
        r: 0,
        g: 0,
        b: 0,
        a: 1,
    };
    if (!color) return result;
    const rgbaRaw = new RegExp(/rgb\((.*)\)/).exec(color) || new RegExp(/rgba\((.*)\)/).exec(color);
    if (!rgbaRaw) return result;
    const rgba = rgbaRaw[1].split(',');
    result.r = Number(rgba[0]) / 255;
    result.g = Number(rgba[1]) / 255;
    result.b = Number(rgba[2]) / 255;
    result.a = Number(rgba[3]) || 1;
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

const transBGColor = (bgColor: string) => {
    if (!bgColor) return [] as Paint[];
    const result = [transSolidColor(bgColor)] as Paint[];
    return result;
}

const transStrokeColor = (color: string) => {
    if (!color) return [] as Paint[];
    const result = [transSolidColor(color)] as Paint[];
    return result;
}

export const transGeometry = (styles: TargetProps) => {
    const fills = transBGColor(styles.backgroundColor);
    const strokes = transStrokeColor(styles.borderColor);
    const result = {
        fills,
        strokes,
        strokeWeight: transPx(styles.borderWidth),
        strokeAlign: 'CENTER',
        strokeCap: 'NONE',
        strokeJoin: 'MITER',
    };

    return result as GeometryMixin;
}