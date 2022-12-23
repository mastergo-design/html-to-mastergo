import { targetProps } from './constant';

/**
 * 获取目前支持解析的css属性
 */
export const getStyles = (element: Element) => {
  const rawStyles = getComputedStyle(element) as any;
  return {...rawStyles};
};