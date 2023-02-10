import type { TargetProps } from "../index.d";

export const transScene = (style: TargetProps): SceneNodeMixin => {
  return {
    isVisible: style.visibility !== 'hidden',
    isLocked: false,
  };
}