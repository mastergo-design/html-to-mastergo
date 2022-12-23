import type { TargetProps } from "../index.d"

const pesudoElts = ['::after', '::before']

export type PesudoElt = {
  type: '::after' | '::before'
  nodeType: 'PESUDO',
  styles: TargetProps
}

export type PesudoElts = Array<PesudoElt>

/**
 * 
 * 一般来说content都是none, 当content === '""'视为有效的伪元素
 */
export const getPesudoElts = (element: HTMLElement) => {
  return pesudoElts.map(pesudoType => {
    const styles = getComputedStyle(element, pesudoType);
    return styles.content === '""'? {
      nodeType: 'PESUDO',
      styles: {...styles, isPesudo: true},
      type: pesudoType
    } : null
  }).filter(styles => !!styles)
}

export const isInline = (display: string) => {
  return display?.includes('inline')
}