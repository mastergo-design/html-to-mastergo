import type { IRectangleNode, TargetProps } from './index.d';
import { transShape, transRectangleCorner } from './mixins';

export const transformRect = (element: Element, styles: TargetProps) => {
  const imgSrc = element.getAttribute('src');
  if (imgSrc && styles.backgroundImage === 'none') {
    styles.backgroundImage = `url("${imgSrc}")`;
  }
  styles.backgroundImage = /url\("(.*)"\)/.exec(styles.backgroundImage)?.[1] || '';

  const result = {
    ...transShape(element.id || element.tagName, styles),
    ...transRectangleCorner(styles),
  } as IRectangleNode;

  result.type = 'RECTANGLE';

  return result;
};