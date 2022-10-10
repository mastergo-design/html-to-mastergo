import type { IRectangleNode, TargetProps } from './index.d';
import { transShape } from './mixins';

export const transformRect = (name: string, styles: TargetProps) => {
    const result = {
        ...transShape(name, styles),
    } as IRectangleNode;

    result.type = 'RECTANGLE';

    return result;
};