import { TargetProps } from '../index.d';
import {
  transBase,
  transScene,
  transBlend,
  transGeometry,
  transLayout,
} from './index';

export const transShape = (name: string, styles: TargetProps, nodeType: NodeType) => {
  return {
    ...transBase(name),
    ...transScene(),
    ...transBlend(),
    ...transGeometry(styles, nodeType),
    ...transLayout(styles, nodeType),
  } as DefaultShapeMixin;
};