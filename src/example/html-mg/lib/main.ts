import { autoLayoutKeys, handleAutoLayout } from './autoLayout'
import { handlePaints } from './paints'
import { ISvgNode } from '../../../lib/index.d';

const fontMap = new Map<string, FontName>();

const generateFrame = (node: FrameNode) => {
  const result = mg.createFrame();
  Object.keys(node).forEach((key) => {
    if (
      key === 'id'
      || key === 'type'
      || key === 'children'
    ) return;
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
    if (key === 'textStyles') {
      node.textStyles.forEach(style => {
        result.setRangeLineHeight(style.start, style.end, style.textStyle.lineHeight);
        result.setRangeFontSize(style.start, style.end, style.textStyle.fontSize);
        for (const family of style.textStyle.fontName.family.split(', ')) {
          if (fontMap.has(family) && fontMap.get(family)?.style === style.textStyle.fontName.style) {
            result.setRangeFontName(style.start, style.end, fontMap.get(family) as FontName);
            break;
          }
        }
      })
      return;
    }
    (result as any)[key] = node[key as keyof TextNode];
  })
  return result;
}

const generateSvg = async (node: ISvgNode, config?: any) => {
  const result = await mg.createNodeFromSvgAsync(node.content);
  result.width = node.width;
  result.height = node.height;
  return result;
}

const main = async () => {
  mg.showUI(__html__);
  const fontList = await mg.listAvailableFontsAsync();
  fontList.forEach(font => {
    fontMap.set(font.fontName.family, font.fontName);
  });
}
main();
type ValidNode = (FrameNode | TextNode | RectangleNode) & { [key: string]: any }

type Root = (SceneNode | ISvgNode) & { children?: Array<Root> } & { [key: string]: any }

function hasSetter (obj: SceneNode, prop: string) {
  return !!Reflect.getOwnPropertyDescriptor(Object.getPrototypeOf(obj), prop)?.set
}

const walk = async (node: Root, config?: any) => {
  if (!node) {
    return null
  }
  let root: ValidNode = {} as ValidNode
  switch (node?.type as NodeType) {
    case 'FRAME': {
      root = generateFrame(node as FrameNode)
      break;
    }
    
    case 'RECTANGLE': {
      root = mg.createRectangle()
      break
    }

    case 'TEXT': {
      root = generateText(node as TextNode)
      break;
    }

    case 'PEN': {
      root = await generateSvg(node as ISvgNode, config);
      return root;
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
			// console.log(`skip property ${key} of layer ${root?.name}`, e);
		}
  }

  if(('children' in node) && node.children?.length){
    node.children?.forEach(async childNode => {
      const child = await walk(childNode, config);
      root.appendChild(child);
      child!.x = childNode.x;
      child!.y = childNode.y;
    });
  }

  // 处理自动布局
  if (node.flexMode && node.flexMode !== 'NONE') {
    //@ts-ignore
    handleAutoLayout(node, root)
  }

  return root
}

const generate = (root: any): Promise<ValidNode | null> => {

  return walk(root, {
    x: root.x,
    y: root.y,
  })
}

mg.on('drop', async (evt: DropEvent) => {
  const { absoluteX, absoluteY, items } = evt 
  try {
    const node = await generate(items)
    console.log('生成成功', node, node!.x)
    if (node) {
      node.x = absoluteX
      node.y = absoluteY
    }
  } catch (error) {
    console.error('生成失败', error)
  }
})