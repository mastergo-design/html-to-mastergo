export const normalizeName = (str: string) =>
  str.toLowerCase().replace(/[^a-z]/gi, "");

// 缓存起来
const fontCache: { [key: string]: FontName | undefined } = {};

/**
 * 默认字体 思源黑体
 */
const defaultFont = {
  "family": "Source Han Sans CN",
  "style": "Regular"
}

/**
 * 匹配可用字体
 */
export async function getMatchingFont(font: FontName, availableFonts: Record<string, FontName>) {
  const { family: familyStr, style } = font
  //family-style
  const key = `${normalizeName(familyStr)}-${normalizeName(style)}`
  if (fontCache[key]) {
    return fontCache[key]
  }

  // 不存在 拆开找存在的
  const familySplit = familyStr.split(/\s*,\s*/);

  for (const family of familySplit) {
    //提取family-style
    const normalized = `${normalizeName(family)}-${normalizeName(style)}`;
    // 去可用字体里取找
    const fontName = availableFonts[normalized]
    if (fontName) {
      //有可用的 手动加载一次
      await mg.loadFontAsync(fontName);
      //存一下
      fontCache[key] = fontName;
      return fontName;
    }
  }

  // 返回默认
  return defaultFont;
}

