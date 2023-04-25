import type { TargetProps } from '../index.d';
import { getNumber, isFliped } from '../helpers';
import { fromObject, decomposeTSR, Matrix } from 'transformation-matrix'
// 最小值
const MIN_VALUE = 0.01

/**
 * 提取矩阵
 * @param transform 
 * @returns 
 */
const extractTransform = (transform: string) => {
  const matches = transform.match(/^matrix\((.*)\)$/)
  if (!matches) {
    return null
  }
  const [a, b, c, d, e, f] = matches[1].split(',').map((item: String) => Number(item));
  return { a, b, c, d, e, f };
}

// 提取缩放中心
const convertTransformOrigin = (styles: TargetProps): ScaleCenter => {
  const origins = styles.transformOrigin.split(' ')
  const height = getNumber(styles.height)
  const halfHeight = height / 2
  const width = getNumber(styles.width)
  const halfWidth = width / 2
  let x = getNumber(origins[0])
  let y = getNumber(origins[1])

  const map: { [key: string]: ScaleCenter} = {
    [`0-0`]: 'TOPLEFT',
    [`0-${halfHeight}`]: 'LEFT',
    [`0-${height}`]: 'BOTTOMLEFT',
    [`${halfWidth}-${halfHeight}`]: 'CENTER',
    [`${halfWidth}-0`]: 'TOP',
    [`${halfWidth}-${height}`]: 'BOTTOM',
    [`${width}-0`]: 'TOPRIGHT',
    [`${width}-${halfHeight}`]: 'RIGHT',
    [`${width}-${height}`]: 'BOTTOMRIGHT'
  }
  if (x < (halfWidth / 2)) {
    // 1/4 < x 归为左侧
    x = 0
  } else if ((halfWidth / 2) <= x && x <= (halfWidth + (halfWidth / 2))) {
    // 1/4 <= x <= 3/4 归为中间
    x = halfWidth
  } else {
    // 归为右侧
    x = width
  }

  if (y < (halfHeight / 2)) {
    // 1/4 < y 归为顶部
    y = 0
  } else if ((halfHeight / 2) <= y && y <= (halfHeight + (halfHeight / 2))) {
    // 1/4 <= y <= 3/4 归为中间
    y = halfHeight
  } else {
    // 归为底部
    y = height
  }

  return map[`${x}-${y}`]
}

/**
 * 解析矩阵 将scale剥离出来
 */
const deconstructTransform = (transform: Matrix, styles: TargetProps) => {
  // 默认x和y都翻转
  const fliped = isFliped([[transform.a, transform.c, transform.e], [transform.d, transform.d, transform.f]])
  const { scale } = decomposeTSR(transform, fliped, fliped)
  
  if (scale.sx !== 1 || scale.sy !== 1) {
    // 元素有拉伸 子元素跟随缩放
    styles.isChildNodeStretched = true
  }
}

export const transLayout = (styles: TargetProps, type: NodeType, parentStyles?: TargetProps) => {
  const result = {} as LayoutMixin;

  // 如果有自动布局容器存在，子元素默认全部都是绝对定位 绝对定位应该布局 如果是ABSOLUTE 需要先设置 非ABSOLUTE的话 子图层设置旋转 h w x y可能不生效
  result.layoutPositioning = 'ABSOLUTE'

  result.width = styles.width === 'auto' ? MIN_VALUE : Math.max(MIN_VALUE, getNumber(styles.width));
  result.height = styles.height === 'auto' ? MIN_VALUE : Math.max(MIN_VALUE, getNumber(styles.height));
  result.x = getNumber(styles.x)
  result.y = getNumber(styles.y)

  // if (styles.position === 'absolute') {
  //   // 处理绝对定位
  //   result.x += getNumber(styles.borderLeftWidth || '0px')
  //   result.y += getNumber(styles.borderTopWidth || '0px') 
  // }

  if (styles.isPesudo) {
    // 伪类无法计算包围盒 要加上父元素border和position
    result.x += getNumber(parentStyles?.borderLeftWidth || '0px') + getNumber(styles.left)  + getNumber(styles.marginLeft);;
    result.y += getNumber(parentStyles?.borderTopWidth || '0px') + getNumber(styles.top) + getNumber(styles.marginTop);;
    // if (styles.inset === '0px' && styles.margin === 'auto') {
    //   // inset为0px 和 margin auto才会生效 水平垂直居中
    //   result.y = (getNumber(parentStyles.height) - getNumber(styles.height)) / 2
    //   result.x = (getNumber(parentStyles.width) - getNumber(styles.width)) / 2
    // }
  }

  if (type !== 'TEXT') {
    // 处理transform
    const matrix = extractTransform(styles.transform)
    if (matrix) {
      const { a, b, c, d, e, f } = matrix    
      result.relativeTransform = [[a, c, e + result.x], [b, d, f + result.y]]
      deconstructTransform(fromObject(matrix), styles);
      // //旋转 matrix(cosθ,sinθ,-sinθ,cosθ,0,0) 取 a b 的反正切
      // const rotate = Math.round(Math.atan2(b,a) * (180/Math.PI));
      // if (rotate !== 0) {
      //   result.rotation = rotate
      // }
    }
  }

  return result;
};