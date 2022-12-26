// 将css的px或%转为数字
export const getNumber = (px: string) => {
  if (!px) return 0;
  const result = parseFloat(px);
  if (isNaN(result)) return 0;
  return result;
}
