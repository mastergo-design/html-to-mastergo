import { targetProps } from './constant';


export const getStyles = (element: Element) => {
    const rawStyles = getComputedStyle(element);
    const result = Object.keys(targetProps).reduce((acc, key) => {
        if (rawStyles[key as keyof typeof targetProps]) {
            acc[key as keyof typeof targetProps] = rawStyles[key as any];
        }
        return acc;
    }, {} as { [key in keyof typeof targetProps]: any });
    return result;
};