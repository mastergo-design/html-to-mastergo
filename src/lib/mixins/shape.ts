import { TargetProps } from '../index.d';
import {
    transBase,
    transScene,
    transBlend,
    transGeometry,
    transLayout,
} from './index';

export const transShape = (name: string, styles: TargetProps) => {
    return {
        ...transBase(name),
        ...transScene(),
        ...transBlend(),
        ...transGeometry(styles),
        ...transLayout(styles),
    } as DefaultShapeMixin;
};