import { ISvgNode, TargetProps } from './index.d';
import { transLayout } from './mixins';

export const transformSvg = (node: Element, styles: TargetProps) => {
  const result = {} as ISvgNode;

  (node as HTMLElement).style.fill = styles.color;
  result.type = 'PEN';
  result.content = node.outerHTML.replaceAll("currentColor", `#3D3D3D"`);
  Object.assign(result, transLayout(styles, 'PEN'));

  return result;
}