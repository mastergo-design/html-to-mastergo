mg.showUI(__html__)

const textNode = mg.createText();

mg.ui.onmessage = (data) => {
  textNode.characters = data
}

const generate = (items: BaseNode): FrameNode | TextNode => {
  return mg.createFrame()
}

mg.on('drop', (evt: DropEvent) => {
  const { absoluteX, absoluteY, items } = evt 
  const node = generate(items)
  node.x = absoluteX
  node.y = absoluteY
})