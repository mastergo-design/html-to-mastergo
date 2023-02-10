import { TargetProps } from '../index.d';
import { getNumber, transColor } from '../helpers/utils';

/**
 * 单边描边映射
 */
const singleSideStroke = {
  borderTopWidth: 'strokeTopWeight',
  borderBottomWidth: 'strokeBottomWeight',
  borderLeftWidth: 'strokeLeftWeight',
  borderRightWidth: 'strokeRightWeight',
} as const


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

/**
 * 描边样式
 */
const transStrokeStyle = (borderStyle: CSSStyleDeclaration['borderStyle']): GeometryMixin['strokeStyle'] => {
  switch (borderStyle) {
    case 'solid':
      return 'SOLID';
    case 'dashed':
      return 'DASH';
    default:
      return 'SOLID'
  }
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

//TODO: 虚线描边和渐变描边
export const transGeometry = (styles: TargetProps, type: NodeType) => {
  const fills = transBGColor(type === 'TEXT'? styles.color : styles.backgroundColor, {
    backgroundImage: styles.backgroundImage,
    backgroundRepeat: styles.backgroundRepeat,
    backgroundSize: styles.backgroundSize,
    objectFit: styles.objectFit,
  });
  const result = {} as GeometryMixin & RectangleStrokeWeightMixin;
  result.fills = fills;
  if (type !== 'TEXT') {
    const strokes = transStrokeColor(styles.borderColor);
    //文字节点由于复用父节点的样式 border不继承 只继承color
    result.strokes = strokes;
    result.strokeWeight = parseFloat(styles.borderWidth);
    result.strokeStyle = transStrokeStyle(styles.borderStyle)
    // 单边描边
    Object.entries(singleSideStroke).forEach(([singleSideBorder, strokeKey]) => {
      const borderWidth = getNumber(styles[singleSideBorder  as keyof typeof singleSideStroke])
      if (borderWidth > 0) {
        result[strokeKey] = borderWidth
      }
    })
    result.strokeAlign = 'CENTER';
    result.strokeCap = 'NONE';
    result.strokeJoin = 'MITER';
  }

  return result;
}