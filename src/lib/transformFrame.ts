import type { IFrameNode, TargetProps } from './index.d';
import {
    transGeometry,
    transContainer,
    transFrameContainer,
} from './mixins';

export const transformFrame = (element: Element, styles: TargetProps) => {
    const result = {
        ...transGeometry(styles),
        ...transContainer(styles, element.id || element.tagName),
        ...transFrameContainer(styles),
    } as IFrameNode;
    result.type = 'FRAME';

    return result;
};