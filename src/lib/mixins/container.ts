import { TargetProps } from '../index.d';
import {
    transLayout,
    transBase,
    transScene,
    transBlend,
    transRectangleCorner,
} from './index';

export const transContainer = (styles: TargetProps, name: string) => {
    const result = {} as DefaultContainerMixin;
    const layout = transLayout(styles);
    Object.assign(result, layout);
    Object.assign(result, transBase(name));
    Object.assign(result, transScene());
    Object.assign(result, transBlend());
    Object.assign(result, transRectangleCorner(styles));
    return result;
}