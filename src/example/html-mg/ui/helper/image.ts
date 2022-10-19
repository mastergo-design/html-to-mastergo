/**
 * 处理uri
 * @param uri 
 * @returns 
 */
const convertUriToBuffer = (paint: ImagePaint & { bytes?: Uint8Array }): Promise<ImagePaint & { bytes?: Uint8Array }> => {
  return new Promise((resolve, reject) => {
    try {
      const uri = paint.imageRef
      if (!uri || !uri.length) {
        throw new Error('url 错误')
      }
      // 后缀
      const chunks = uri.split('.')
      const ext = chunks[chunks.length - 1] || 'png'

      const image = new Image()
      image.crossOrigin = 'anonymous'
      image.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = image.width
        canvas.height = image.height
        const context = canvas.getContext('2d')
        context!.drawImage(image, 0, 0)
        canvas.toBlob(function (blob) {
          const reader = new FileReader()
          reader.addEventListener('loadend', function() {
            paint.bytes = new Uint8Array(this.result as ArrayBuffer)
            resolve(paint);
          })
          reader.readAsArrayBuffer(blob!)
        }, `image/${ext}`)
      }
      image.src = uri
    } catch (error) {
      reject(error)
    }
  })
}

/**
 * 处理base64
 * @param base64 
 * @returns 
 */
const convertBase64ToBuffer = (paint: ImagePaint & { bytes?: Uint8Array }) => {
  const base64 = paint.imageRef
  const str = window.atob(base64);
  const len = str.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
      bytes[i] = str.charCodeAt(i);
  }
  paint.bytes = bytes
  return true
}

export const convertImageToBuffer = (paint: ImagePaint) => {
  if (~paint.imageRef.indexOf('data:image')) {
    return convertBase64ToBuffer(paint)
  } else {
    return convertUriToBuffer(paint)
  }
}
