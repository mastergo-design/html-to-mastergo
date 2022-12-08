import { targetProps } from './constant';

/**
 * 获取目前支持解析的css属性
 */
export const getStyles = (element: Element) => {
  const rawStyles = getComputedStyle(element);
  const result = Object.keys(targetProps).reduce((acc, key) => {
    if (rawStyles[key as any]) {
      acc[key as keyof typeof targetProps] = rawStyles[key as any];
    }
    return acc;
  }, {} as { [key in keyof typeof targetProps]: string });
  return result;
};