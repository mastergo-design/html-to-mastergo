import { TargetProps } from '../index.d';
import { getNumber } from './utils';


const extractTransform = (transform: string) => {
  const data = (/matrix\((.*)\)/.exec(transform) || [])[1] || '';
  const [a, b, c, d, e, f] = data.split(',').map((item: String) => Number(item));
  return { a, b, c, d, e, f };
}

export const transLayout = (styles: TargetProps, type: NodeType) => {
  const result = {} as LayoutMixin;
  // 文字节点宽度稍微加长一些 避免折行
  result.width = styles.width === 'auto' ? 0 : type === 'TEXT'? getNumber(styles.width) + 0.5 : getNumber(styles.width);
  result.height = styles.height === 'auto' ? 0 : getNumber(styles.height);
  result.x = getNumber(styles.x);
  result.y = getNumber(styles.y);

  if (styles.position === 'absolute') {
    // 处理border
    result.x += getNumber(styles.borderLeftWidth);
    result.y += getNumber(styles.borderTopWidth);
  }
  // 如果有自动布局容器存在，子元素默认全部都是绝对定位
  result.layoutPositioning = 'ABSOLUTE'
  return result;
};