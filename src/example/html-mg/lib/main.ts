import { autoLayoutKeys, handleAutoLayout, AutoLayoutData } from './autoLayout'
import { handlePaints } from './paints'
import { ISvgNode, ITextNode } from '../../../lib/index.d';
import { getMatchingFont, normalizeName } from './utils/font'

// 所有可用的字符map
const fontMap: Record<string, FontName> = {};

type ValidNode = (FrameNode | TextNode | RectangleNode | PenNode) & { [key: string]: any }

type Root = (SceneNode | ISvgNode | ITextNode) & { children?: Array<Root> } & { [key: string]: any }

const main = async () => {
  mg.showUI(__html__);

  // 统计可用字体
  const fontList = await mg.listAvailableFontsAsync();
  fontList.forEach(font => {
    const { family, style } = font.fontName
    fontMap[`${normalizeName(family)}-${normalizeName(style)}`] = font.fontName;
  });
}

main();

function hasSetter (obj: SceneNode, prop: string) {
  return !!Reflect.getOwnPropertyDescriptor(Object.getPrototypeOf(obj), prop)?.set
}


/**
 * 处理容器
 */
const generateFrame = async (node: Root, result: FrameNode & { [key: string]: any }) => {
  try {
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
          result[key] = (await handlePaints(node[key])).filter(item => item.status === 'fulfilled').map(item => (item as PromiseFulfilledResult<Paint>).value)
        } else {
          result[key] = node[key]; 
        }
      }
    }
  
    // 处理子节点
    await Promise.allSettled(node.children?.map(async childNode => {
      const child = await createLayer(childNode);
      if (child) {
        //这里需要先append进去再修改子节点属性，不然某些会不生效 如layoutPositioning
        result.appendChild(child!);
        await walk(childNode, child);
      }
      return true
    }) || []);

    return result;
  } catch (error) {
    console.error('发生错误,', error)
    return null
  }

}

/**
 * 处理矩形
 */
const generateRectangle = async (node: Root, result: RectangleNode & { [key: string]: any }) => {
  const keys = Object.keys(node)

  // 赋值通用属性
  for(const key of keys){
    try{
      if(typeof node[key] !== 'function' && hasSetter(result, key)){
        // 处理paint
        if((['fills', 'strokes']).includes(key)) {
          result[key] = (await handlePaints(node[key])).filter(item => item.status === 'fulfilled').map(item => (item as PromiseFulfilledResult<Paint>).value)
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
const generateText = async (node: Root, result: TextNode & { [key: string]: any }) => {

  const keys = Object.keys(node)

  // 设置样式
  node.textStyles?.forEach(async (style: TextSegStyle) => {
    // 加载字体,取第一个可以加载的
    const fontName: FontName = style.textStyle.fontName
    const family = await getMatchingFont(fontName, fontMap)
    result.setRangeFontName(style.start, style.end, family as FontName);
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
          result[key] = (await handlePaints(node[key])).filter(item => item.status === 'fulfilled').map(item => (item as PromiseFulfilledResult<Paint>).value)
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
const generateSvg = async (node: Root, result: PenNode & { [key: string]: any }) => {
  const keys = Object.keys(node)

  // 赋值通用属性
  for(const key of keys){
    try{
      if(typeof node[key] !== 'function' && hasSetter(result, key)){
        // 处理paint
        if((['fills', 'strokes']).includes(key)) {
          result[key] = (await handlePaints(node[key])).filter(item => item.status === 'fulfilled').map(item => (item as PromiseFulfilledResult<Paint>).value)
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
 * 根据类型创建图层
 */

async function createLayer(node: Root) {
  if (!node) {
    return null
  }
  switch (node?.type as NodeType) {
    case 'FRAME': {
      return mg.createFrame()
    }
    
    case 'RECTANGLE': {
      return mg.createRectangle()
    }

    case 'TEXT': {
      return mg.createText()
    }

    case 'PEN': {
      return await mg.createNodeFromSvgAsync(node.content)
    }
  }
  return null
}

const walk = async (treeNode: Root, layer: any) => {
  if (!treeNode) {
    return null
  }
  let root: ValidNode | null = {} as ValidNode

  // 旋转会影响布局 需要后置处理 先提取出来
  const rotation = treeNode.rotation
  delete treeNode.rotation

  switch (treeNode?.type as NodeType) {
    case 'FRAME': {
      root = await generateFrame(treeNode, layer)
      break;
    }
    
    case 'RECTANGLE': {
      root = await generateRectangle(treeNode, layer)
      break
    }

    case 'TEXT': {
      root = await generateText(treeNode as TextNode, layer)
      break;
    }

    case 'PEN': {
      root = await generateSvg(treeNode as ISvgNode, layer);
      break;
    }

    default: {
      throw new Error('failed to convert, layer has unknown type.')
    }
  }
  requestAnimationFrame(() => {
    rotation && root && (root.rotation = rotation)
  })
  return root
  
}

const generate = async (root: any): Promise<ValidNode | null> => {
  // 根节点为页面下frame
  return await walk(root, mg.createFrame())
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