import { TargetProps } from '../index.d';

const transColor = (color: string) => {
  if (!color) return null;
  const result = {
    r: 0,
    g: 0,
    b: 0,
    a: 1,
  };
  const rgbaRaw = new RegExp(/rgb\((\s*\d*\.?\d+\s*,\s*\d*\.?\d+\s*,\s*\d*\.?\d+\s*)\)/).exec(color) || new RegExp(/rgba\((\s*\d*\.?\d+\s*,\s*\d*\.?\d+\s*,\s*\d*\.?\d+\s*,\s*\d*\.?\d+\s*)\)/).exec(color);
  if (!rgbaRaw) return result;
  const rgba = rgbaRaw[1]?.split(',');
  result.r = parseFloat(rgba[0]) / 255;
  result.g = parseFloat(rgba[1]) / 255;
  result.b = parseFloat(rgba[2]) / 255;
  result.a = parseFloat(rgba[3] ?? 1);
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

const transScaleMode = (size?: string, repeat?: string, objectFit?: string) => {
  if (repeat === 'no-repeat') return 'FILL';
  if (size === 'contain' || objectFit === 'contain') return 'FIT';
  if (size === 'cover' || objectFit === 'cover') return 'STRETCH';
  return 'FILL';
}

const transImagePaint = (imgUrl: string, size?: string, repeat?: string, objectFit?: string) => {
  const result = {
    type: 'IMAGE',
    isVisible: true,
    alpha: 1,
    blendMode: 'NORMAL',
    imageRef: imgUrl,
    scaleMode: transScaleMode(size, repeat, objectFit),
  } as ImagePaint;
  return result;
}

interface ImageConfig {
  backgroundImage?: string;
  backgroundSize?: string;
  backgroundRepeat?: string;
  objectFit?: string;
}

const transPaint = (color: string, { backgroundImage, backgroundRepeat, backgroundSize, objectFit }: ImageConfig) => {
  const result = [] as Paint[];
  if (color) result.push(transSolidColor(color));
  if (backgroundImage && backgroundImage !== 'none') result.push(transImagePaint(backgroundImage, backgroundSize, backgroundRepeat, objectFit));
  return result;
}

const transBGColor = (color: string, imgConfig: ImageConfig = {}) => {
  return transPaint(color, imgConfig);
}

const transStrokeColor = (color: string, imgConfig: ImageConfig = {}) => {
  return transPaint(color, imgConfig);
}

export const transGeometry = (styles: TargetProps, type: NodeType) => {
  const fills = transBGColor(type === 'TEXT'? styles.color : styles.backgroundColor, {
    backgroundImage: styles.backgroundImage,
    backgroundRepeat: styles.backgroundRepeat,
    backgroundSize: styles.backgroundSize,
    objectFit: styles.objectFit,
  });
  const result = {} as GeometryMixin;
  result.fills = fills;
  if (type !== 'TEXT') {
    const strokes = transStrokeColor(styles.borderColor);
    //文字节点由于复用父节点的样式 border不继承 只继承color
    result.strokes = strokes;
    result.strokeWeight = parseFloat(styles.borderWidth);
    result.strokeAlign = 'CENTER';
    result.strokeCap = 'NONE';
    result.strokeJoin = 'MITER';
  }

  return result;
}