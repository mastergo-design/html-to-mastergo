// 将css的px或%转为数字
export const getNumber = (px: string) => {
  if (!px) return 0;
  const result = Number(px.replace(/%|px/g, ''));
  if (isNaN(result)) return 0;
  return result;
}
