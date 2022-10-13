// 将css的px转为数字
export const transPx = (px: string) => {
    if (!px) return 0;
    const result = Number(px.replace('px', ''));
    return result;
}