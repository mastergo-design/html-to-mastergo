mg.showUI(__html__)

const textNode = mg.createText();

mg.ui.onmessage = (data) => {
  textNode.characters = data
}

type ValidNode = (FrameNode | TextNode | RectangleNode) & { [key: string]: any }

type Root = SceneNode & { children?: Array<Root> } & { [key: string]: any }

const walk = (node: Root) => {
  if (!node) {
    return null
  }
  let root: ValidNode = {} as ValidNode
  switch (node?.type as NodeType) {
    case 'FRAME': {
      root = mg.createFrame()
      break;
    }
    
    case 'RECTANGLE': {
      root = mg.createRectangle()
      break
    }

    case 'TEXT': {
      root = mg.createText()
      break;
    }

    default: {
      throw new Error('failed to convert, layer has unknown type.')
    }
  }
  for(const key in node){
    try{
			if(typeof node[key] !== 'function'){
				root[key] = node[key];  
			}
		}
		catch (e){
			console.error(`skip property ${key} of layer ${root?.name}`);
		}
  }
  if(('children' in node) && node.children?.length){
    node.children?.forEach(childNode => {
      const child = walk(childNode);
      root.appendChild(child)
    });
  }
  return root
}

const generate = (root: any): ValidNode | null => {

  return walk(root)
}

mg.on('drop', (evt: DropEvent) => {
  const { absoluteX, absoluteY, items } = evt 
  const node = generate(items)
  console.log('生成成功', node)
  if (node) {
    node.x = absoluteX
    node.y = absoluteY
  }
})