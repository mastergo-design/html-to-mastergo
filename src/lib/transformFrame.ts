import type { IFrameNode, TargetProps } from './index.d';
import {
    transGeometry,
    transContainer,
} from './mixins';

export const transformFrame = (name: string, styles: TargetProps) => {
    const result = {
        ...transGeometry(styles),
        ...transContainer(styles, name),
    } as IFrameNode;
    result.type = 'FRAME';

    return result;
};