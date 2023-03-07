/**
 * 字重map
 */
/**
 *
  100	Thin (Hairline)
  200	Extra Light (Ultra Light)
  300	Light
  400	Normal (Regular)
  500	Medium
  600	Semi Bold (Demi Bold)
  700	Bold
  800	Extra Bold (Ultra Bold)
  900	Black (Heavy)
  950	Extra Black (Ultra Black)
 */
export const FONT_WEIGHTS = {
  '100': 'Thin',
  '200': 'UltraLight',
  '300': 'Light',
  '400': 'Regular',
  '500': 'Medium',
  '600': 'SemiBold',
  '700': 'Bold',
  '800': 'ExtraBold',
  '900': 'Heavy',
  '950': 'ExtraBlack'
} as const

// 把样式备选也映射一次
export const FONT_WEHGHTS_BACKUPS = {
  'thin': ['Thin','Hairline'],
  'hairline': ['Thin','Hairline'],
  'extralight': ['UltraLight','ExtraLight'],
  'ultralight': ['UltraLight','ExtraLight'],
  'light': ['Light'],
  'regular': ['Regular', 'Normal'],
  'normal': ['Regular', 'Normal'],
  'medium': ['Medium'],
  'semibold': ['SemiBold', 'DemiBold'],
  'demibold': ['SemiBold', 'DemiBold'],
  'bold': ['Bold'],
  'extrabold': ['ExtraBold', 'UltraBold'],
  'ultrabold': ['ExtraBold', 'UltraBold'],
  'heavy': ['Heavy', 'Black'],
  'black': ['Heavy', 'Black'],
  'extrablack': ['ExtraBlack', 'UltraBlack'],
  'ultrablack': ['ExtraBlack', 'UltraBlack'],
}

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
 * 
 * @param family 字体名
 * @param style 样式名
 * @param cacheKey 需要被缓存的key
 * @returns 
 */
const loadFont = async (family: string, style: string, availableFonts: Record<string, FontName>, cacheKey: string) => {
  //提取family-style
  const normalized = `${normalizeName(family)}-${normalizeName(style)}`;
  // 去可用字体里取找
  const fontName = availableFonts[normalized]
  if (fontName) {
    //有可用的 手动加载一次
    await mg.loadFontAsync(fontName);
    //存一下
    fontCache[cacheKey] = fontName;
    return fontName;
  }
  return null
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

  // Step 1
  // 不存在缓存 拆开找存在的
  const familySplit = familyStr.split(/\s*,\s*/);
  // 先去取所有可能的样式枚举
  const backups = FONT_WEHGHTS_BACKUPS[normalizeName(style) as keyof typeof FONT_WEHGHTS_BACKUPS] || []

  for (const family of familySplit) {
    // 先按style去匹配
    for (const backupStyle of backups) {
      const fontName = await loadFont(family, backupStyle, availableFonts, key)
      if (fontName) {
        return fontName
      }
    }
    
    // 可能存在family已经含样式的css 例如 PingFangSC-Medium这种style后缀, 所以需要取family中的样式
    const chunks = family.match(/(.+)-([a-z]*)$/i)
    const suffixFamily = chunks?.[1]
    const suffixStyle = chunks?.[2]
    if (suffixFamily && suffixStyle) {
      // 用family中的style去取一下map
      const backupsFromFamily = FONT_WEHGHTS_BACKUPS[normalizeName(suffixStyle) as keyof typeof FONT_WEHGHTS_BACKUPS] || []
      for (const backupStyle of backupsFromFamily) {
        const fontName = await loadFont(suffixFamily, backupStyle, availableFonts, key)
        if (fontName) {
          return fontName
        }
      }
    }
  }

  // Step2
  // 返回默认
  return defaultFont;
}

