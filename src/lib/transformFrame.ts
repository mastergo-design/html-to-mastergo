import type { IFrameNode, TargetProps } from './index.d';
import {
  transContainer,
  transFrameContainer,
} from './mixins';

/**
 * 解析容器
 */
export const transformFrame = (element: Element, styles: TargetProps, parentStyles: TargetProps) => {
  const result = {
    ...transContainer(styles, parentStyles, element.id || element.tagName),
    ...transFrameContainer(styles),
  } as IFrameNode;
  result.type = 'FRAME';

  return result;
};