export const autoLayoutKeys = [
  'flexMode',
  'itemSpacing',
  'mainAxisAlignItems',
  'crossAxisAlignItems',
  'mainAxisSizingMode',
  'crossAxisSizingMode',
  'strokesIncludedInLayout',
  'itemReverseZIndex',
] as const

export const handleAutoLayout = (data: { [T in (typeof autoLayoutKeys)[number]]: AutoLayout[T] }, node: FrameNode) => {
  node.flexMode = data.flexMode
  for (const key of autoLayoutKeys.slice(1)) {
    if (key in data) {
      //@ts-ignore
      node[key] = data[key]
    }
  }
}