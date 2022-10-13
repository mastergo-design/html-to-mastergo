mg.showUI(__html__)

const generateFrame = (node: FrameNode) => {
  const result = mg.createFrame();
  Object.keys(node).forEach((key) => {
    if (
      key === 'id'
      || key === 'type'
    ) return;
    if (key === 'children') {
      node.children.forEach((child) => {
        result.appendChild(generate(child));
      });
      return;
    }
    (result as any)[key] = node[key as keyof FrameNode];
  })
  return result;
}

const generateText = (node: TextNode) => {
  const result = mg.createText();
  Object.keys(node).forEach((key) => {
    if (
      key === 'id'
      || key === 'type'
    ) return;
    (result as any)[key] = node[key as keyof TextNode];
  })
  return result;
}

const generate = (items: BaseNode): FrameNode | TextNode => {
  console.log(items)
  if (items.type === 'FRAME') return generateFrame(items);
  if (items.type === 'TEXT') return generateText(items);
  return mg.createFrame()
}

mg.on('drop', (evt: DropEvent) => {
  const { absoluteX, absoluteY, items } = evt 
  const node = generate(items)
  node.x = absoluteX
  node.y = absoluteY
})