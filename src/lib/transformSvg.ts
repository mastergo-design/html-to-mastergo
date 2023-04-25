import type { ISvgNode, TargetProps } from './index.d';
import { transLayout, transConstraints } from './mixins';

export const transformSvg = (node: Element, styles: TargetProps, parentStyles: TargetProps) => {
  const result = {} as ISvgNode;

  // 填充
  const fill = styles.fill;
  const stroke = styles.stroke;
  const color = styles.color;

  if ((node as HTMLElement).style.fill.toLowerCase() === 'currentcolor') {
    // fill优先级高
    (node as HTMLElement).style.fill = /rgba|rgb/.test(fill)? fill : color;
  }
  if ((node as HTMLElement).style.stroke.toLowerCase() === 'currentcolor') {
    // stroke优先级高
    (node as HTMLElement).style.stroke = /rgba|rgb/.test(stroke)? stroke : color;
  }

  result.type = 'PEN';
  let svgString = node.outerHTML
  // 替换填充
  svgString = svgString.replace(/(fill="currentColor"|fill="")/i, `fill="${/rgba|rgb/.test(fill)? fill : color}"`);
  //替换描边
  svgString = svgString.replace(/(stroke="currentColor"|stroke="")/i, `stroke="${/rgba|rgb/.test(stroke)? stroke : color}"`);
  // 获取svg string
  result.content = svgString
  Object.assign(result, transLayout(styles, 'PEN', parentStyles));
  Object.assign(result, transConstraints(styles, parentStyles));

  return result;
}