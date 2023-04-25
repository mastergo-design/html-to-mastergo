import { TargetProps } from '../index.d';
import {
  transBase,
  transScene,
  transBlend,
  transGeometry,
  transLayout,
  transConstraints,
} from './index';

export const transShape = (name: string, styles: TargetProps, parentStyles: TargetProps, nodeType: NodeType) => {
  return {
    ...transBase(name, styles),
    ...transScene(styles),
    ...transBlend(styles),
    ...transGeometry(styles, nodeType),
    ...transLayout(styles, nodeType, parentStyles),
    ...transConstraints(styles, parentStyles),
  } as DefaultShapeMixin & RectangleStrokeWeightMixin & ConstraintMixin;
};