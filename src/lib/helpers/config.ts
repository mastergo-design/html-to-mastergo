import type { OptionalSettings } from '../index.d'

/**
 * 解析设置
 */
export const options: OptionalSettings = {
  absoluteBounds: false
}

export const updateOptions = (newOptions: OptionalSettings) => {
  Object.assign(options, { ...newOptions })
}