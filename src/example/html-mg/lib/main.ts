import { autoLayoutKeys, handleAutoLayout, AutoLayoutData } from './autoLayout'
import { handlePaints } from './paints'
import { ISvgNode, ITextNode } from '../../../lib/index.d';

// 所有可用的字符map
const fontMap = new Map<string, FontName>();
// 已加载的fontMap
const loadedFontMap = new Map<string, FontName>();

type ValidNode = (FrameNode | TextNode | RectangleNode) & { [key: string]: any }

type Root = (SceneNode | ISvgNode | ITextNode) & { children?: Array<Root> } & { [key: string]: any }

const main = async () => {
  mg.showUI(__html__);
  // 统计可用字体
  const fontList = await mg.listAvailableFontsAsync();
  fontList.forEach(font => {
    fontMap.set(font.fontName.family, font.fontName);
  });
}

main();

function hasSetter (obj: SceneNode, prop: string) {
  return !!Reflect.getOwnPropertyDescriptor(Object.getPrototypeOf(obj), prop)?.set
}


/**
 * 处理容器
 */
const generateFrame = async (node: Root) => {
  try {
    const result = mg.createFrame() as FrameNode & { [key: string]: any };
    // 过滤出autoLayout相关属性, 单独处理
    const keys = Object.keys(node).filter(key => !autoLayoutKeys.includes(key as any))
  
    // 处理自动布局
    if (node.flexMode && node.flexMode !== 'NONE') {

      handleAutoLayout(node as AutoLayoutData, result)
    }
  
    // 赋值通用属性
    for(const key of keys){
      if(typeof node[key] !== 'function' && hasSetter(result, key)){
        // 处理paint
        if((['fills', 'strokes']).includes(key)) {
          result[key] = await handlePaints(node[key])
        } else {
          result[key] = node[key]; 
        }
      }
    }
  
    // 处理子节点
    node.children?.forEach(async childNode => {
      const child = await walk(childNode);
      if (child) {
        result.appendChild(child!);
        child!.x = childNode.x;
        child!.y = childNode.y;
      }
    });

    return result;
  } catch (error) {
    console.error('发生错误,', error)
    return null
  }

}

const generateRectangle = async (node: Root) => {
  const result = mg.createRectangle() as RectangleNode & { [key: string]: any }
  const keys = Object.keys(node)

  // 赋值通用属性
  for(const key of keys){
    try{
      if(typeof node[key] !== 'function' && hasSetter(result, key)){
        // 处理paint
        if((['fills', 'strokes']).includes(key)) {
          result[key] = await handlePaints(node[key])
        } else {
          result[key] = node[key]; 
        }
      }
    }
    catch (e){
      console.log(`skip property ${key} of result ${result?.name}`, e);
    }
  }

  return result
}

/**
 * 处理文字
 */
const generateText = async (node: Root) => {
  const result = mg.createText() as TextNode & { [key: string]: any };

  const keys = Object.keys(node)

  // 设置样式
  node.textStyles?.forEach(async (style: TextSegStyle) => {
    // 加载字体,取第一个可以加载的
    const fontName: FontName = style.textStyle.fontName
    for (const family of fontName.family.split(', ')) {
      // 可用字体
      if (fontMap.has(family) && fontMap.get(family)?.style === fontName.style) {
        // 不存在，先加载
        if (!loadedFontMap.has(family)) {
          await mg.loadFontAsync(fontName)
          loadedFontMap.set(family, fontName)
        }
        result.setRangeFontName(style.start, style.end, fontMap.get(family) as FontName);
        break;
      }
    }
    result.setRangeLineHeight(style.start, style.end, style.textStyle.lineHeight);
    result.setRangeFontSize(style.start, style.end, style.textStyle.fontSize);
  })
  
  //@ts-ignore
  delete node.textStyles

  // 赋值通用属性
  for(const key of keys){
    try{
      if(typeof node[key] !== 'function' && hasSetter(result, key)){
        // 处理paint
        if((['fills', 'strokes']).includes(key)) {
          result[key] = await handlePaints(node[key])
        } else {
          result[key] = node[key]; 
        }
      }
    }
    catch (e){
      console.log(`skip property ${key} of result ${result?.name}`, e);
    }
  }

  return result;
}

/**
 * 处理svg
 */
const generateSvg = async (node: Root) => {
  const result = await mg.createNodeFromSvgAsync(node.content) as FrameNode & { [key: string]: any };
  const keys = Object.keys(node)

  // 赋值通用属性
  for(const key of keys){
    try{
      if(typeof node[key] !== 'function' && hasSetter(result, key)){
        // 处理paint
        if((['fills', 'strokes']).includes(key)) {
          result[key] = await handlePaints(node[key])
        } else {
          result[key] = node[key]; 
        }
      }
    }
    catch (e){
      console.log(`skip property ${key} of result ${result?.name}`, e);
    }
  }

  return result;
}

const walk = async (node: Root) => {
  if (!node) {
    return null
  }
  let root: ValidNode | null = {} as ValidNode
  switch (node?.type as NodeType) {
    case 'FRAME': {
      root = await generateFrame(node)
      break;
    }
    
    case 'RECTANGLE': {
      root = await generateRectangle(node)
      break
    }

    case 'TEXT': {
      root = await generateText(node as TextNode)
      break;
    }

    case 'PEN': {
      root = await generateSvg(node as ISvgNode);
      break;
    }

    default: {
      throw new Error('failed to convert, layer has unknown type.')
    }
  }
  return root
}

const generate = async (root: any): Promise<ValidNode | null> => {

  return await walk(root)
}

// mg.on的callback不能用async修饰
mg.on('drop', (evt: DropEvent) => {
  const { absoluteX, absoluteY, items } = evt 
  try {
    generate(items).then(node => {
      if (node) {
        node.x = absoluteX
        node.y = absoluteY
      }
      console.log('生成成功', node, node!.x)
    })
  } catch (error) {
    console.error('生成失败', error)
  }
})