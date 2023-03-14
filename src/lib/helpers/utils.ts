import { TargetProps, ExtraNodeType } from "../index.d"

const pesudoElts = ['::after', '::before']

export type PesudoElt = {
  type: '::after' | '::before'
  nodeType: ExtraNodeType.PESUDO,
  styles: TargetProps
}

export type PesudoElts = Array<PesudoElt>

/**
 * 
 * 一般来说content都是none, 当content === '""'视为有效的伪元素
 */
export const getPesudoElts = (element: HTMLElement): PesudoElts[] => {
  return pesudoElts.map(pesudoType => {
    const styles = getComputedStyle(element, pesudoType);
    return styles.content.trim() === '""'? {
      nodeType: ExtraNodeType.PESUDO,
      styles: {...styles, isPesudo: true},
      type: pesudoType
    } : null
  }).filter(styles => !!styles) as any
}

export const isInline = (display: string) => {
  return display?.includes('inline')
}

// 将css的px或%转为数字
export const getNumber = (px: string) => {
  if (!px) return 0;
  const result = parseFloat(px);
  if (isNaN(result)) return 0;
  return result;
}

/**
 * 转换rgba
 */
export const transColor = (color: string) => {
  const result = {
    r: 0,
    g: 0,
    b: 0,
    a: 1,
  };
  if (!color) {
    return result
  };
  const rgbaRaw = new RegExp(/rgb\((\s*\d*\.?\d+\s*,\s*\d*\.?\d+\s*,\s*\d*\.?\d+\s*)\)/).exec(color) || new RegExp(/rgba\((\s*\d*\.?\d+\s*,\s*\d*\.?\d+\s*,\s*\d*\.?\d+\s*,\s*\d*\.?\d+\s*)\)/).exec(color);
  if (!rgbaRaw) return result;
  const rgba = rgbaRaw[1]?.split(',');
  result.r = parseFloat(rgba[0]) / 255;
  result.g = parseFloat(rgba[1]) / 255;
  result.b = parseFloat(rgba[2]) / 255;
  result.a = parseFloat(rgba[3] ?? 1);
  return result;
}

/**
 * 根据zIndex排序
 */
export const sortByZIndex = (nodes: {index: number}[]) => {
  nodes.sort((a, b) => {return a.index - b.index})
}

/**
 * 判断文本是否折行
 */
export const isTextWrapped = (range: Range) => {
  return range.getClientRects()?.length > 1
}
