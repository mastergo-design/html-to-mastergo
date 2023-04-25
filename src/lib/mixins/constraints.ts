import type { TargetProps } from '../index.d';

export const transConstraints =  (styles: TargetProps, parentStyles?: TargetProps) => {
  const result = {} as ConstraintMixin
  // 约束
  if (parentStyles?.isChildNodeStretched) {
    // 自身也attach一下
    styles.isChildNodeStretched = parentStyles.isChildNodeStretched
    // 父元素有缩放，子元素约束改为跟随缩放
    result.constraints = {
      horizontal: 'SCALE',
      vertical: 'SCALE',
    }
  }
  return result
}