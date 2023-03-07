import { convertImageToBuffer } from './helpers'


import type { TargetNode, IFrameNode } from './index.d';
/**
 * 后置处理，主要将图片的src处理成buffer
 */
export const postProcess = async (result: TargetNode): Promise<TargetNode> => {
  // secondary operation
  const promises: any[] = []

  // traverse
  const step = (root: TargetNode & {[key: string] : any} | null) => {
    if (!root) {
      return null
    }
    try {
      const keys = Object.keys(root)
      for (const key of keys) {
        if (['fills', 'strokes'].includes(key)) {
          const paints = root[key]
          paints?.forEach((paint: ImagePaint) => {
            if (paint.type === 'IMAGE') {
              // image paint
              promises.push(convertImageToBuffer(paint))
            }
          })
        } else if (key === 'children' && (root as IFrameNode).children?.length) {
          for (const child of (root as IFrameNode).children) {
            step(child)
          }
        }
      }
    } catch (error) {
      console.error('error occured in secondary operation', error)
    }
  }
  step(result)
  await Promise.allSettled(promises)
  return result
}