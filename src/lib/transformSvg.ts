import { ISvgNode, TargetProps } from './index.d';
import { transLayout } from './mixins';

export const transformSvg = (node: Element, styles: TargetProps, parentStyles: TargetProps) => {
  const result = {} as ISvgNode;

  // 填充
  const fill = styles.fill;
  const stroke = styles.stroke;

  // (node as HTMLElement).style.fill = styles.fill;
  // (node as HTMLElement).style.stroke = styles.stroke;

  result.type = 'PEN';
  let svgString = node.outerHTML
  // 替换填充
  svgString = svgString.replace(/(fill="currentColor")/, `fill="${fill !== 'none'? fill : '#3D3D3D'}"`);
  //替换描边
  svgString = svgString.replace(/(stroke="currentColor")/, `stroke="${stroke !== 'none'? stroke : '#3D3D3D'}"`);
  // 获取svg string
  result.content = svgString
  Object.assign(result, transLayout(styles, parentStyles, 'PEN'));

  return result;
}