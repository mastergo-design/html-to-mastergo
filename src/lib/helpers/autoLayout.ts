export const autoLayoutKeys = [
  'flexMode',
  'itemSpacing',
  'mainAxisAlignItems',
  'crossAxisAlignItems',
  'mainAxisSizingMode',
  'crossAxisSizingMode',
  'strokesIncludedInLayout',
  'itemReverseZIndex',
  'flexWrap',
  'crossAxisSpacing',
] as const

export type AutoLayoutData = { [T in (typeof autoLayoutKeys)[number]]: AutoLayout[T] }

export const handleAutoLayout = (data: AutoLayoutData, node: FrameNode) => {
  // 先设置自动布局 其后自动布局相关属性才会生效
  node.flexMode = data.flexMode
  for (const key of autoLayoutKeys.slice(1)) {
    if (key in data) {
      //@ts-ignore
      node[key] = data[key]
    }
  }
}