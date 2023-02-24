import { TargetProps } from '../index.d';
import { getNumber } from '../helpers/utils';

// 最小值
const MIN_VALUE = 0.01

const extractTransform = (transform: string) => {
  const matches = transform.match(/^matrix\((.*)\)$/)
  if (!matches) {
    return null
  }
  const [a, b, c, d, e, f] = matches[1].split(',').map((item: String) => Number(item));
  return { a, b, c, d, e, f };
}

export const transLayout = (styles: TargetProps, parentStyles: TargetProps, type: NodeType) => {
  const result = {} as LayoutMixin;


  // 如果有自动布局容器存在，子元素默认全部都是绝对定位 绝对定位应该布局 如果是ABSOLUTE 需要先设置 非ABSOLUTE的话 子图层设置旋转 h w x y可能不生效
  result.layoutPositioning = 'ABSOLUTE'

  // 文字节点宽度稍微加长一些 避免折行
  result.width = styles.width === 'auto' ? MIN_VALUE : Math.max(MIN_VALUE, getNumber(styles.width));
  result.height = styles.height === 'auto' ? MIN_VALUE : Math.max(MIN_VALUE, getNumber(styles.height));
  result.x = getNumber(styles.x)
  result.y = getNumber(styles.y)

  if (styles.position === 'absolute') {
    // 处理绝对定位
    result.x += getNumber(styles.borderLeftWidth || '0px')
    result.y += getNumber(styles.borderTopWidth || '0px') 
  }

  if (styles.isPesudo) {
    // 伪类无法计算包围盒 要加上父元素border和position
    result.x += getNumber(parentStyles.borderLeftWidth || '0px') + getNumber(styles.left)  + getNumber(styles.marginLeft);;
    result.y += getNumber(parentStyles.borderTopWidth || '0px') + getNumber(styles.top) + getNumber(styles.marginTop);;
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
      //旋转 matrix(cosθ,sinθ,-sinθ,cosθ,0,0) 取 a b 的反正切
      const rotate = Math.round(Math.atan2(b,a) * (180/Math.PI));
      if (rotate !== 0) {
        result.rotation = rotate
      }

      // 位移
      result.x += e
      result.y += f
      // 缩放暂不处理
    }
  }
  return result;
};