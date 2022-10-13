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

type ValidNode = (FrameNode | TextNode | RectangleNode) & { [key: string]: any }

type Root = SceneNode & { children?: Array<Root> } & { [key: string]: any }

function hasSetter (obj: any, prop: string) {
  return !!Object!.getOwnPropertyDescriptor(obj, prop)!['set']
}

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
        if (hasSetter(node, key)) {
          root[key] = node[key];  
        }
			}
		}
		catch (e){
			console.error(`skip property ${key} of layer ${root?.name}`, e);
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