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
    color: 'color',
    borderTopLeftRadius: 'borderTopLeftRadius',
    borderTopRightRadius: 'borderTopRightRadius',
    borderBottomLeftRadius: 'borderBottomLeftRadius',
    borderBottomRightRadius: 'borderBottomRightRadius',
    paddingTop: 'paddingTop',
    paddingRight: 'paddingRight',
    paddingBottom: 'paddingBottom',
    paddingLeft: 'paddingLeft',
    x: 'x',
    y: 'y',
};

export const targetPropsList = Object.keys(targetProps);