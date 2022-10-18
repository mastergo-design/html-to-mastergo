import { autoLayoutKeys, handleAutoLayout } from './autoLayout'
import { handlePaints } from './paints'

mg.showUI(__html__)


type ValidNode = (FrameNode | TextNode | RectangleNode) & { [key: string]: any }

type Root = SceneNode & { children?: Array<Root> } & { [key: string]: any }

function hasSetter (obj: SceneNode, prop: string) {
  return !!Reflect.getOwnPropertyDescriptor(Object.getPrototypeOf(obj), prop)?.set
}

const walk = async (node: Root) => {
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

    case "SVG": {
      return await mg.createNodeFromSvgAsync(node.path)
    }

    default: {
      throw new Error('failed to convert, layer has unknown type.')
    }
  }
  const keys = Object.keys(node).filter(key => !autoLayoutKeys.includes(key as any))
  for(const key of keys){
    try{
			if(typeof node[key] !== 'function'){
        if (hasSetter(root, key)) {

          // 处理paint
          if (['fills', 'strokes'].includes(key)) {
            root[key] = handlePaints(node[key])
          } else {
            root[key] = node[key];  
          }
        }
			}
		}
		catch (e){
			console.log(`skip property ${key} of layer ${root?.name}`, e);
		}
  }

  if(('children' in node) && node.children?.length){
    node.children?.forEach(childNode => {
      const child = walk(childNode);
      root.appendChild(child)
    });
  }

  // 处理自动布局
  if (node.flexMode && node.flexMode !== 'NONE') {
    //@ts-ignore
    handleAutoLayout(node, root)
  }

  return root
}

const generate = async (root: any): Promise<ValidNode | null> => {

  return await walk(root)
}

mg.on('drop', (evt: DropEvent) => {
  const { absoluteX, absoluteY, items } = evt 
  generate(items).then((node) => {
    console.log('生成成功', node)
    if (node) {
      node.x = absoluteX
      node.y = absoluteY
    }
  }).catch(err => {
    console.error('转换出错', err)
  })

})