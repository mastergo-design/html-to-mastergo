import type { TargetProps } from "../index.d";
import { getNumber, transColor } from '../helpers/utils';

/**
 * css 没有 pass-through
 */
const blendModeMap = {
  'normal': 'NORMAL',
  'multiply': 'MULTIPLY',
  'screen': 'SCREEN',
  'overlay': 'OVERLAY',
  'darken': 'DARKEN',
  'lighten': 'LIGHTEN',
  'color-dodge': 'COLOR_DODGE',
  'color-burn': 'COLOR_BURN',
  'hard-light': 'HARD_LIGHT',
  'soft-light': 'SOFT_LIGHT',
  'difference': 'DIFFERENCE',
  'exclusion': 'EXCLUSION',
  'hue': 'HUE',
  'saturation': 'SATURATION',
  'color': 'COLOR',
  'luminosity': 'LUMINOSITY',
  'plus-lighter': 'PLUS_LIGHTER',
  'plus-darker': 'PLUS_DARKER',
} as const

/**
 * 混合模式
 */
const getBlendMode = (mode: keyof typeof blendModeMap): Effect['blendMode'] => {
  return blendModeMap[mode] || 'NORMAL'
}

/**
 * 处理阴影 阴影可以有多个 用逗号分割
 */
const transBoxShadow = (styles: TargetProps): ShadowEffect[] => {
  let shadowEffects: ShadowEffect[] = []

  let boxShadow = styles.boxShadow

  if (boxShadow !== 'none') {
    const PARTS_REG = /\s(?![^(]*\))/;
    // 拆段
    const parts = boxShadow.split(PARTS_REG);
    const chunks = parts.reduce((cur, item) => {
      if (!/.*,$/.test(item)) {
        // 没到结尾
        cur[cur.length - 1].push(item)
      } else {
        // 去掉结尾,号
        cur[cur.length - 1].push(item.substring(0, item.length - 1))
        // 建个空的
        cur.push([])
      }
      return cur
    }, [[]] as Array<any>).filter(arr => arr.length);
    // 多段
    shadowEffects = chunks.map((singleShadowArr: string[]) => {
      const shadow: {
        -readonly [T in keyof ShadowEffect]: ShadowEffect[T]
      } = {} as ShadowEffect
      // computed style把rgba放在前面了 类似于 'rgba(0, 0, 255, 0.2) 12px 12px 2px 1px'

      // 提取color
      shadow.color = transColor(singleShadowArr.find(item => /(rgba|rgb?\(.+?\))/.test(item)) || "rgba(0, 0, 0, 0.84)")!;
    
      // 取偏移 扩散和弧度
      const nums = parts
        .filter((n) => n !== "inset")
        .filter((n) => !/(rgba|rgb?\(.+?\))/.test(n))
        .map(getNumber);
    
      const [offsetX, offsetY, blurRadius, spreadRadius] = nums;
      shadow.offset = {
        x: offsetX,
        y: offsetY
      }
      shadow.radius = blurRadius
      shadow.spread = spreadRadius
      // 内外阴影
      shadow.isVisible = true
      // 根据 inset区分内外阴影
      shadow.type = singleShadowArr.includes('inset')? 'INNER_SHADOW' : 'DROP_SHADOW'
      // 混合模式, 目前CSS没有对阴影的混合默认为normal
      shadow.blendMode = 'NORMAL'

      return shadow
    })
  }

  return shadowEffects
}

/**
 * 高斯模糊/背后图层模糊
 */
const transBlur = (styles: TargetProps): BlurEffect[] => {
  let blurEffects: BlurEffect[] = []
  // 高斯模糊
  const filter = styles.filter
  // 背后图层模糊
  const backdropFilter = styles.filter
  
  const trans = (type: BlurEffect['type'], data: string): BlurEffect => {
    const blurEffect: {
      -readonly [T in keyof BlurEffect]: BlurEffect[T]
    } = {} as BlurEffect
    blurEffect.type = type
    blurEffect.isVisible = true
    // 特效 目前CSS没有对模糊的混合。默认为normal
    blurEffect.blendMode = 'NORMAL'
    blurEffect.radius = getNumber(data.match(/blur\((.+)\)/)?.[1] || '0')
    return blurEffect
  }
  
  // 目前只解析模糊 其他特效不解析
  if (filter === 'none' && /blur\(.+\)/.test(filter)) {
    blurEffects.push(trans('BACKGROUND_BLUR', filter))
  }

  if (backdropFilter === 'none' && /blur\(.+\)/.test(backdropFilter)) {
    blurEffects.push(trans('LAYER_BLUR', backdropFilter))
  }

  return blurEffects
}

/**
 * 处理特效 
 */
const transEffects = (styles: TargetProps): Effect[] => {
  const effects: Effect[] = []

  effects.push(...transBoxShadow(styles))
  // 根据 inset区分内外阴影
  return effects
}

export const transBlend = (styles: TargetProps) => {
  return {
    effects: [...transEffects(styles), ...transBlur(styles)],
    opacity: getNumber(styles.opacity),
    // 图层本身的混合模式也是mixBlendMode来影响
    blendMode: getBlendMode(styles.mixBlendMode as keyof typeof blendModeMap),
    isMask: false,
  } as Omit<BlendMixin, 'effectStyleId'>;
};