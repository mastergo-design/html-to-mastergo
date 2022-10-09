import type { TargetProps } from './index.d';

export const transformText = (text: Text, styles: TargetProps) => {
    const result = {} as TextNode;

    result.characters = text.textContent!;

    return result;
};