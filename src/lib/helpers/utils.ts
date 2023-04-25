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
export const isTextWrapped = (range: Range, lineHeight: number) => {
  // 重排太多了 性能会很差
  // let orgStyle = element.getAttribute('style') ?? '';
  // // 获取当前元素的 line-height 值
  // let lineHeight = window.getComputedStyle(element).lineHeight;
  // // 如果是 normal 就换为 px 值
  // if (lineHeight === 'normal') {
  //   let temp = document.createElement('div');
  //   temp.innerText = "字";
  //   document.body.appendChild(temp);
  //   lineHeight = temp.offsetHeight + 'px';
  //   document.body.removeChild(temp);
  // }
  // // 让元素高度等于其 line-height 高度
  // element.style.height = lineHeight;
  // // 然后便可判断出内容是否超出其容器，即是否已换行
  // if (element.offsetHeight < element.scrollHeight) {
  //   element.setAttribute('style', orgStyle);
  //   return true
  // } else {
  //   element.setAttribute('style', orgStyle);
  //   return false
  // }
  const rects = Array.from(range.getClientRects())
  // 单行仍会返回多行，未解决，需要判断一下 https://bugs.chromium.org/p/chromium/issues/detail?id=612459
  const first = rects[0]
  if (!first) {
    return false
  }
  return rects.slice(1).some((rect) => {
    if (rect.y === first.y) {
      return false
    }
    if (isNaN(lineHeight)) {
      let temp = document.createElement('div');
      temp.innerText = "字";
      temp.style.position = 'fixed'
      document.body.appendChild(temp);
      lineHeight = temp.offsetHeight
      document.body.removeChild(temp);
    }
    // 因为该行文字包含了一些不同的字体或者字体大小，在不同的字符之间存在微小的空隙或者重叠， 导致存在了不同的rects
    const delta = Math.abs(Math.abs(rect.y - first.y) - lineHeight)
    if (delta >= 0) {
      return true
    }
    return false
  })
}

/**
 * 是否是svg
 */
export const isSvg = (element: Element) => {
  return element.tagName === 'svg'
}

/**
 * 是否是input
 */
export const isInput = (element: Element): boolean => {
  return element instanceof HTMLInputElement && element.tagName === 'INPUT'
}

/**
 * 是否是textArea
 */
export const isTextArea = (element: Element): boolean => {
  return element instanceof HTMLTextAreaElement && element.tagName === 'TEXTAREA'
}

/**
 * 清除动画和变换
 */
export const clearTransformAndTransition = async (styles: TargetProps, element: HTMLElement) => {
  let transition = element.style.transition
  let transform = element.style.transform
  if (styles.transform !== 'none') {
    element.style.transform = 'unset'
    element.style.transition = 'unset'

    // 等待元素transform还原
    await new Promise((resolve) => {
      setTimeout(() => {
        resolve(1)
      }, 50);
    });
  }

  return () => {
    if (styles.transform !== 'none') {
      element.style.transform = transform
      element.style.transition = transition
    }
  }
}

/**
 * 判断矩阵是否包含翻转
 */
export function isFliped(transform: Transform): boolean {
  // 定义基准向量，比如 [1, 0] 和 [0, 1]
  const horizontal = {x: 1, y: 0}; // 水平向右的向量
  const vertical = {x: 0, y: 1}; // 垂直向上的向量
  const rotationTransform: Transform = [
    [transform[0][0], transform[0][1], 0],
    [transform[1][0], transform[1][1], 0],
  ];
  // 判断是否翻转, 叉乘结果为负数则翻转
  const th = convertVector(horizontal, rotationTransform);
  const tv = convertVector(vertical, rotationTransform);
  const fliped = th.x * tv.y - th.y * tv.x < 0;
  // 判断向量是否和基准向量方向相反
  return fliped;
}

// 坐标变换
export const convertVector = (vector: Vector, transform: Transform): Vector => {
  const originCenterMatrix = [[vector.x], [vector.y], [1]];
  const transformMatrix = [...transform, [0, 0, 1]];
  const matrix = matrixProduct(transformMatrix, originCenterMatrix)
  const center = {
    x: matrix[0][0],
    y: matrix[1][0]
  }
  return center;
}
// 矩阵点乘
export const matrixProduct = (vector1: number[][], vector2: number[][]): number[][] => {
  const result: number[][] = [];

  if(vector1.length === vector2[0].length || vector1[0].length === vector2.length){
    for (let i = 0; i < vector1.length; i++) {
      result[i] = [];
      for (let j = 0; j < vector2[0].length; j++) {
        let sum = 0;
        for (let k = 0; k < vector1[0].length; k++) {
          sum += vector1[i][k] * vector2[k][j];
        }
        result[i][j] = sum;
      }
    }
  }
  else {
    throw new Error(`vector matrix product error with vectors: , ${JSON.stringify(vector1)}, ${JSON.stringify(vector2)}`);
  }
  return result;
}