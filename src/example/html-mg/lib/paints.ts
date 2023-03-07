export const handlePaints = async (paints: Paint[]) => {
  return await Promise.allSettled(paints.map(async (paint: Paint & { bytes?: Uint8Array }) => {
    switch (paint.type) {
      case 'IMAGE': {
        // 图片
        const image = await mg.createImage(paint.bytes || new Uint8Array([]))
        delete paint.bytes
        return {
          ...paint,
          imageRef: image.href,
        }
      }
      case 'GRADIENT_LINEAR': {
        // 线性渐变
        return paint
      }
    }
    return paint
  }))
}

/**
 * 判断是否为图片填充
 */
export const checkIfPaintIsImagePaint = (paint: Paint) => {
  return paint.type === 'IMAGE'
}