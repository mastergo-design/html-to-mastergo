import { getNumber } from "../helpers";
import type { TargetProps } from "../index.d";

/**
 * 记录index做图层排序
 */
export const transBase = (name: string, styles: TargetProps) => {
  return {
    name,
    index: getNumber(styles.zIndex)
  } as BaseNodeMixin & { index?: number };
}