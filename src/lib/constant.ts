import type { TargetProps } from './index.d';

/**
 * 所有支持的css属性
 */
export const targetProps: TargetProps = {
    width: 'width',
    height: 'height',
    backgroundColor: 'backgroundColor',
    borderColor: 'borderColor',
    borderWidth: 'borderWidth',
    borderStyle: 'borderStyle',
};

export const targetPropsList = Object.keys(targetProps);