import type { IRectangleNode, TargetProps } from './index.d';
import { transShape, transRectangleCorner } from './mixins';

export const transformRect = (element: Element, styles: TargetProps, parentStyles: TargetProps) => {
  // 处理图片src
  const imgSrc = element.getAttribute('src');
  if (imgSrc && styles.backgroundImage === 'none') {
    styles.backgroundImage = `url("${imgSrc}")`;
  }
  
  const result = {
    ...transShape(element.id || element.tagName, styles, parentStyles, 'RECTANGLE'),
    ...transRectangleCorner(styles),
    type: 'RECTANGLE'
  } as IRectangleNode;

  return result;
};