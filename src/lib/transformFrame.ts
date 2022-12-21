import type { IFrameNode, TargetProps } from './index.d';
import {
  transContainer,
  transFrameContainer,
} from './mixins';

/**
 * 解析容器
 */
export const transformFrame = (element: Element, styles: TargetProps) => {
  const result = {
    ...transContainer(styles, element.id || element.tagName),
    ...transFrameContainer(styles),
  } as IFrameNode;
  result.type = 'FRAME';

  return result;
};