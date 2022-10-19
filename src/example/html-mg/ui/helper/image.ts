export const convertImageToBuffer = (src: string = 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fphoto.16pic.com%2F00%2F67%2F02%2F16pic_6702147_b.jpg&refer=http%3A%2F%2Fphoto.16pic.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=auto?sec=1664607929&t=2e930b0abba06413e0adc867cab2702d') => {
  return new Promise((resolve, reject) => {
    try {
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
            resolve(new Uint8Array(this.result as ArrayBuffer));
          })
          reader.readAsArrayBuffer(blob!)
        }, 'image/png')
      }
      image.src = src
    } catch (error) {
      reject(error)
    }
  })
}

export const convertBase64ToBuffer = () => {
  var binary_string = window.atob(base64);
  var len = binary_string.length;
  var bytes = new Uint8Array(len);
  for (var i = 0; i < len; i++) {
      bytes[i] = binary_string.charCodeAt(i);
  }
  return bytes.buffer;
}