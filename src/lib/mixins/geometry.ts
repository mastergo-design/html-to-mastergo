import { TargetProps } from '../index.d';
import { getNumber, transColor } from '../helpers';
/**
 * 单边描边映射
 */
const singleSideStroke = {
  borderTop: 'strokeTopWeight',
  borderBottom: 'strokeBottomWeight',
  borderLeft: 'strokeLeftWeight',
  borderRight: 'strokeRightWeight',
} as const

// 纯色
const transSolidColor = (color: string) => {
  const result = {
    type: 'SOLID',
    isVisible: true,
    alpha: 1,
    blendMode: 'NORMAL',
    color: transColor(color),
  } as SolidPaint;
  return result;
}

// 指令角度映射
const angleMap = {
  'to top': 180,
  'to bottom': 0,
  'to left': 270,
  'to right': 90,
  'to left top': 315,
  'to left bottom': 225,
  'to right top': 45,
  'to right bottom': 135,
}

/**
 * 计算渐变线的旋转逻辑的区间
 * 设旋转角度为α，当0° <= α < 当右对角线与中心线的夹角，渐变线与图层的两个交点落在x轴上
 * 当右对角线与中心线的夹角 < α < (90° + 右对角线与中心线夹角的余角)，渐变线与图层的两个交点落在y轴上
 * 当 (90° + 右对角线与中心线夹角的余角) < α < (180° + 右对角线与中心线的夹角)，渐变线与图层的两个交点落在x轴上
 * 当 (180° + 右对角线与中心线的夹角) < α < (270° + 右对角线与中心线夹角的余角)，渐变线与图层的两个交点落在y轴上
 * 当 (270° + 右对角线与中心线夹角的余角) < α <= 360，渐变线与图层的两个交点落在x轴上
 * https://user-images.githubusercontent.com/13540489/219654132-1da0c87d-9a83-462d-8504-8653ec42bae0.png
 */
const calculateGradientLineLenghtAndHandlePositionsByAngleAndRect = (rotate: number, width: number, height: number): { length: number, handlePositions: GradientPaint['gradientHandlePositions'] } => {
  // 四个角的渐变线可以直接获取
  if (rotate === 0) {
    return { length: height, handlePositions: [{ x: 0.5, y: 0 }, {x: 0.5, y: 1}]}
  } else if (rotate === 90) {
    return { length: height, handlePositions: [{ x: 0, y: 0.5 }, {x: 1, y: 0.5}]}
  } else if (rotate === 180) {
    return { length: height, handlePositions: [{ x: 0.5, y: 1 }, {x: 0.5, y: 0}]}
  } else if (rotate === 270) {
    return { length: height, handlePositions: [{ x: 1, y: 0.5 }, {x: 0, y: 0.5}]}
  }
  // 右对角线旋转角度
  const diagonalRotateAngle = Math.atan(width / height) * 180 / Math.PI
  // 余角
  const supplement = 90 - diagonalRotateAngle
  
  /**
   * 
   * @param acuteAngle 中心点与渐变线相交于图层的点所在的边构成的垂直线,与渐变线之间的锐角
   * @param length1 夹角相邻图层的边长
   * @param length2 另一条边长
   */
  const calculation = (acuteAngle: number, length1: number, length2: number) => {
    // 单个旋转锐角的临边长为
    let side = 0.5 * length1;
    // 斜边长
    let hill = side / Math.cos(acuteAngle * Math.PI / 180)
    // 对边
    const opposite = side * Math.tan(acuteAngle * Math.PI / 180)

    // 超出的相似小三角形的斜边
    const overHill = 0.5 * length2 - opposite
    // 相似小三角形锐角的对边为
    const oppositeSimilar = Math.sin(acuteAngle * Math.PI / 180) * overHill
    // 渐变线长度 = (大三角形的斜边 + 相似小三角形锐角的对边) * 2
    const total = (oppositeSimilar + hill) * 2
    
    return total
  }

  // 默认从上到下
  let length = height
  // 渐变线起始点和终点的坐标
  let handlePositions: GradientPaint['gradientHandlePositions'] = [{ x: 0.5, y: 0 }, {x: 0.5, y: 1}]
  if (0 < rotate && rotate <= diagonalRotateAngle) {
    const acuteAngle = rotate
    length = calculation(acuteAngle, height, width)
    const sin = Math.sin(acuteAngle * Math.PI / 180) * length / 2
    const cos = Math.cos(acuteAngle * Math.PI / 180) * length / 2
    handlePositions[1].x = (0.5 * width + sin) / width
    handlePositions[1].y = 1 - (0.5 * height + cos) / height
    handlePositions[0].x = 1 - (0.5 * width + sin) / width
    handlePositions[0].y = (0.5 * height + cos) / height
  } else if (diagonalRotateAngle < rotate && rotate <= (90 + supplement)) {
    const acuteAngle = Math.abs(rotate - 90)
    length = calculation(acuteAngle, width, height)
    const sin = Math.sin(acuteAngle * Math.PI / 180) * length / 2
    const cos = Math.cos(acuteAngle * Math.PI / 180) * length / 2
    handlePositions[1].x = (0.5 * width + cos) / width
    handlePositions[1].y = (0.5 * height + sin) / height
    handlePositions[0].x = 1 - (0.5 * width + cos) / width
    handlePositions[0].y = 1 - (0.5 * height + sin) / height
  } else if ((90 + supplement) < rotate && rotate <= (180 + diagonalRotateAngle)) {
    const acuteAngle = Math.abs(180 - rotate)
    length = calculation(acuteAngle, height, width)
    const sin = Math.sin(acuteAngle * Math.PI / 180) * length / 2
    const cos = Math.cos(acuteAngle * Math.PI / 180) * length / 2
    if (rotate < 180) {
      handlePositions[1].x = (0.5 * width + sin) / width
      handlePositions[1].y = (0.5 * height + cos) / height
      handlePositions[0].x = 1 - (0.5 * width + sin) / width
      handlePositions[0].y = 1 - (0.5 * height + cos) / height
    } else {
      // 180度后调转头尾
      handlePositions[0].x = (0.5 * width + sin) / width
      handlePositions[0].y = (0.5 * height + cos) / height
      handlePositions[1].x = 1 - (0.5 * width + sin) / width
      handlePositions[1].y = 1 - (0.5 * height + cos) / height
    }
  } else if ((180 + diagonalRotateAngle) < rotate && rotate <= (270 + supplement)) {
    const acuteAngle = Math.abs(270 - rotate)
    length = calculation(acuteAngle, width, height)
    const sin = Math.sin(acuteAngle * Math.PI / 180) * length / 2
    const cos = Math.cos(acuteAngle * Math.PI / 180) * length / 2
    handlePositions[0].x = (0.5 * width + cos) / width
    handlePositions[0].y = (0.5 * height + sin) / height
    handlePositions[1].x = 1 - (0.5 * width + cos) / width
    handlePositions[1].y = 1 - (0.5 * height + sin) / height
  } else if ((270 + supplement) < rotate && rotate <= 360) {
    const acuteAngle = Math.abs(360 - rotate)
    length = calculation(acuteAngle, height, width)
    const sin = Math.sin(acuteAngle * Math.PI / 180) * length / 2
    const cos = Math.cos(acuteAngle * Math.PI / 180) * length / 2
    handlePositions[0].x = (0.5 * width + sin) / width
    handlePositions[0].y = (0.5 * height + cos) / height
    handlePositions[1].x = 1 - (0.5 * width + sin) / width
    handlePositions[1].y = 1 - (0.5 * height + cos) / height
  }

  if (180 <= rotate && rotate <= 270) {
    // 做相对于x轴的轴对称翻转(渲染引擎的规律，不知道为什么这么做)
    handlePositions.forEach(position => {
      if (position.y > 0.5) {
        position.y = position.y - 2 * (position.y - 0.5)
      } else {
        position.y = position.y + 2 * (0.5 - position.y)
      }
    })
  }
  return { length, handlePositions}
}

/**
 * css一定会保证至少有两个控制点，否则是无效的数据,所以我们要保证头尾需要是0和100
 */
const completeGradientChunks = (chunks: Array<string>, grandientLineLength: number) => {
  const completeChunks = [...chunks]
  const startPoint = completeChunks[0]
  const startChunks = startPoint.split(/(?<!,)(?:\s)/)
  const endPoint = completeChunks[completeChunks.length - 1]
  const endChunks = endPoint.split(/(?<!,)(?:\s)/)
  if (startChunks.length === 1) {
    // 只有颜色没有指定百分比
    completeChunks[0] = `${startPoint} 0%` 
  } else if (getNumber(startChunks[1]) !== 0) {
    // 可能是px或者% 都统一往数组起始拼一个0%的渐变
    completeChunks.splice(0, 0, `${startChunks[0]} 0%`)
  }
  if (endChunks.length === 1) {
    // 只有颜色没有指定百分比
    completeChunks[completeChunks.length - 1] = (`${endPoint} 100%` )
  } else if ((endChunks[1].includes('%') && getNumber(endChunks[1]) !== 100) || (endChunks[1].includes('px') && getNumber(endChunks[1]) < grandientLineLength)) {
    // 终点不是100%或者渐变线的长度, 都统一往数组终点拼一个100%的渐变
    completeChunks.splice(0, completeChunks.length - 1, `${endChunks[0]} 100%`)
  }
  return completeChunks
}

/**
 * 转换控制点
 * @param stop 控制点 xx% | xxpx
 * @param grandientLineLength 渐变线长度
 */
const convertCSSStopToPluginStop = (stop: string, grandientLineLength: number) => {
  if (stop.includes('%')) {
    return Math.min(1, getNumber(stop) / 100)
  } else {
    return Math.min(1, getNumber(stop) / grandientLineLength)
  }
}

/**
 * 处理不完整数据 例如
 * 1. 颜色 + 单百分比
 * 百分比的话，除了要考虑非递增的情况，不用特殊处理。
 * 2. 颜色 + 双百分比
 * 系统会自动拆成两种相同颜色，不同百分比，注意处理成递增。
 * 3. 颜色 + px(双px浏览器自动分割)
 * 根据渐变线的长度转换成百分比和处理非递增。
 * 4. 颜色 无单位
 * 向前收集直到有单位的为止，均分百分段, 当出现不规则排序时直接忽略。
 * 5. 只有单位
 * 这种是改渐变的转折点，画布内不太好做，直接忽略
 */
const handleGradientChunks = (chunks: Array<string>, grandientLineLength: number) => {

  // 整理数据 保证头尾是0和100
  const completeChunks = completeGradientChunks(chunks, grandientLineLength)

  // 例如: ['rgba(0, 1, 2) 0%', 'rgba(0, 1, 2)', rgba(0, 1, 2), 'rgba(0, 1, 2) 100%']
  // 当前段中上一个明确有控制点值的位置
  let lastValuedStartPostion = 0
  // 当前段最后一个明确有控制点值的位置
  let lastValuedEndPosition = 1
  // 没有明确定义stops位置的数组
  const undefinedStops: any[] = [];

  // 遍历处理，转成插件格式
  return completeChunks.reduce((result: ColorStop[], colorAndPercent: string, idx: number) => {
    const stop: { -readonly[key in keyof ColorStop]: ColorStop[key] } = { 
      color: {
        "r": 0.8470588326454163,
        "g": 0.8470588326454163,
        "b": 0.8470588326454163,
        "a": 1
      },
      position: 0
    }
    // 控制点颜色和(百分比/px)
    const ctrlPoints = colorAndPercent.split(/(?<!,)(?:\s)/)
    // 颜色
    stop.color = transColor(ctrlPoints[0])!
    // 控制点
    const pxOrPercent: string | undefined = ctrlPoints[1]

    if (!pxOrPercent) {
      // 空的, 按前后有明确数值的点来均分
      if (!undefinedStops.length) {
        // 这个片段没有记录过, 向前寻找
        for (let i = idx; i < completeChunks.length - 1; i++) {
          const currentCtrlPoints = completeChunks[idx].split(/(?<!,)(?:\s)/)
          if (currentCtrlPoints.length > 1) {
            // 记录有明确的控制点的值
            lastValuedEndPosition = getNumber(currentCtrlPoints[1])
            break
          } else {
            // 占位
            undefinedStops.push('')
          }
        }
      }
      // 这个控制点在之前记录的片段内，可以直接计算
      // 上一个起始点 + 均分的值
      stop.position = lastValuedStartPostion + (lastValuedEndPosition - lastValuedStartPostion) / (undefinedStops.length + 1)
      // 减1
      undefinedStops.pop()
    } else {
      stop.position = convertCSSStopToPluginStop(pxOrPercent, grandientLineLength)
      // 记录上一个有值的
      lastValuedStartPostion = stop.position
    }
    result.push(stop)
    // 从低到高排序 
    return result.sort((a, b) => a.position - b.position)
  }, [] as Array<ColorStop>)
}
/**
 * 处理线性渐变
 * TODO:由于css的linear-gradient转折点可以乱序，这里不做排序处理了，需要元素自身渐变符合规范
 */
const transLinearGradient = (background: TargetProps['background'], styles: TargetProps): GradientPaint => {
  // 渐变内容
  const gradient = background.match(/.*linear-gradient\((.*)\)\s/i)![1]
  // 分块处理
  let chunks = gradient.split(/(?<=\D)(?:,\s)/)
  // 角度
  let angle = 0
  // 旋转矩阵
  let transform: Transform = [[1, 0, 0], [0, 1, 0]];
  // 控制点
  let gradientStops = []
  if (chunks[0].match(/to|deg/)) {
    // 把旋转单独提取出来处理
    const rotate = chunks.splice(0, 1)[0]
    // 有方向
    if (rotate.includes('to')) {
      // 根据map取角度
      angle = angleMap[rotate as keyof typeof angleMap]
    } else {
      angle = getNumber(rotate) % 360
    }
    /**
     * CSS中的角度值，先将其转换为数学中的角度值，然后再计算旋转矩阵。具体来说，角度值乘以-1，再加上180度，得到数学中的角度值
     */
    transform = [[Math.cos((angle * Math.PI / 180)), Math.sin((angle * Math.PI / 180)), 0], [-Math.sin((angle * Math.PI / 180)), Math.cos((angle * Math.PI / 180)), 0]]
  }
  // 计算渐变线的长度
  const { length: grandientLineLength , handlePositions  } = calculateGradientLineLenghtAndHandlePositionsByAngleAndRect(angle, getNumber(styles.width), getNumber(styles.height))!
  gradientStops = handleGradientChunks(chunks, grandientLineLength)
  return {
    type: 'GRADIENT_LINEAR',
    gradientStops,
    transform,
    gradientHandlePositions: handlePositions
  }
}

/**
 * 渐变
 * TODO: 圆锥径向处理
 */
const transGradient = (background: TargetProps['background'], styles: TargetProps): GradientPaint => {
  if (background.includes('linear-gradient')) {
    return transLinearGradient(background, styles)
    // 线性
  } else if (background.includes('conic-gradient')) {
    // 圆锥
    return {
      type: 'GRADIENT_ANGULAR',
      transform: [[1, 0, 0], [0, 1, 0]],
      gradientStops: [
        {
          "position": 0,
          "color": {
            "r": 0.8470588326454163,
            "g": 0.8470588326454163,
            "b": 0.8470588326454163,
            "a": 1
          }
        },
          {
          "position": 1,
          "color": {
            "r": 0.8470588326454163,
            "g": 0.8470588326454163,
            "b": 0.8470588326454163,
            "a": 0
          }
        }
      ],
    }
  } else if (background.includes('radial-gradient')) {
    // 径向
    return {
      type: 'GRADIENT_RADIAL',
      transform: [[1, 0, 0], [0, 1, 0]],
      gradientStops: [
        {
          "position": 0,
          "color": {
            "r": 0.8470588326454163,
            "g": 0.8470588326454163,
            "b": 0.8470588326454163,
            "a": 1
          }
        },
          {
          "position": 1,
          "color": {
            "r": 0.8470588326454163,
            "g": 0.8470588326454163,
            "b": 0.8470588326454163,
            "a": 0
          }
        }
      ],
    }
  }
  return {
    type: 'GRADIENT_LINEAR',
    transform: [[1, 0, 0], [0, 1, 0]
    ],
    gradientStops: [
      {
        "position": 0,
        "color": {
          "r": 0.8470588326454163,
          "g": 0.8470588326454163,
          "b": 0.8470588326454163,
          "a": 1
        }
      },
        {
        "position": 1,
        "color": {
          "r": 0.8470588326454163,
          "g": 0.8470588326454163,
          "b": 0.8470588326454163,
          "a": 0
        }
      }
    ],
    gradientHandlePositions: [{x: 0.5, y: 0.5}, {x: 0.5, y: 1}],
  }
}

const transScaleMode = (size?: string, repeat?: string, objectFit?: string) => {
  if (repeat === 'no-repeat') return 'FILL';
  if (size === 'contain' || objectFit === 'contain') return 'FIT';
  if (size === 'cover' || objectFit === 'cover') return 'STRETCH';
  return 'FILL';
}

/**
 * 描边样式
 */
const transStrokeStyle = (borderStyle: CSSStyleDeclaration['borderStyle']): GeometryMixin['strokeStyle'] => {
  switch (borderStyle) {
    case 'solid':
      return 'SOLID';
    case 'dashed':
      return 'DASH';
    default:
      return 'SOLID'
  }
}

interface ImageConfig {
  backgroundImage?: string;
  backgroundSize?: string;
  backgroundRepeat?: string;
  objectFit?: string;
}

/**
 * 处理非图片渐变
 */
const transPaint = (color: string, styles?: TargetProps) => {
  const result = [] as Paint[];
  if (styles?.background?.match(/gradient/)) {
    // 单独处理非纯色背景(渐变)
    result.push(transGradient(styles.background, styles))
  } else if (color) {
    result.push(transSolidColor(color))
  };
  return result;
}

/**
 * 处理图片渐变
 */
const transImagePaint = ({ backgroundImage, backgroundRepeat, backgroundSize, objectFit }: ImageConfig): ImagePaint | null => {
  let result: ImagePaint| null = null;
  if (backgroundImage && backgroundImage !== 'none') {
    result = {
      type: 'IMAGE',
      isVisible: true,
      alpha: 1,
      blendMode: 'NORMAL',
      imageRef: backgroundImage,
      scaleMode: transScaleMode(backgroundSize, backgroundRepeat, objectFit),
    } as ImagePaint;
  }
  return result
}

const transBGColor = (color: string, styles?: TargetProps) => {
  return transPaint(color, styles);
}

const transStrokeColor = (color: string) => {
  return transSolidColor(color);
}

type SingleSideStroke = {
  strokeWeight: number;
  color: string
  side: typeof singleSideStroke[keyof typeof singleSideStroke]
}

/**
 * 处理某一侧描边
 */
const handleSingleSideBorder = (border: TargetProps['border'], side: typeof singleSideStroke[keyof typeof singleSideStroke]): SingleSideStroke => {
  const result: SingleSideStroke = {} as SingleSideStroke
  const args = border.split(/(?<!,)\s/)
  result.strokeWeight = getNumber(args[0])
  result.color = args[2]
  result.side = side
  return result
}

/**
 * 处理描边 描边三个需要关注的特征 颜色 粗细 样式
 * 遍历四个边:
 * 1. 当四个边都相同，按一条描边处理
 * 2. 当四个边粗细不同但颜色和样式相同，按单边描边处理
 * 3. 存在不同颜色，但样式相同(solid | dash)
 *  ①: 一个描边不同，其余相同且px大于0，增加两条描边(例如borderTop和其余单边不同，增加两条描边，一条单边strokeTopWeight有值，其余strokeWeight为0，另一条除了strokeTopWeight为0，其余有值)
 * 4. 多条描边不相同，先按3情况处理，TODO: 需要做假描边
 */
const transStrokes = (styles: TargetProps): [string, SingleSideStroke[]][] => {
  // 是否存在不为0的边
  let hasNoneZeroStrokeWeight = false
  // 存不同描边的映射
  const strokeMap: { [key: string]: SingleSideStroke[] } = {};
  [
    { value: styles.borderTop, side: singleSideStroke['borderTop'] }, 
    { value: styles.borderBottom, side: singleSideStroke['borderBottom'] }, 
    { value: styles.borderLeft, side: singleSideStroke['borderLeft'] }, 
    { value: styles.borderRight, side: singleSideStroke['borderRight'] }
  ].forEach((border) => {
    const stroke = handleSingleSideBorder(border.value, border.side)
    if (stroke.strokeWeight > 0) {
      hasNoneZeroStrokeWeight = true
    }
    if (!strokeMap[stroke.color]) {
      strokeMap[stroke.color] = [stroke]
    } else {
      strokeMap[stroke.color].push(stroke)
    }
  })
  // 如果四条边都是0则不需要描边
  if (!hasNoneZeroStrokeWeight) {
    return []
  }
  // 当某种颜色所有边都是0则不单独增加描边，归入其他颜色，只将其设置为0
  let zeroWeightStrokes:SingleSideStroke[]  = []
  const finalArr = Object.entries(strokeMap).filter(([_, strokes]) => {
    const isAllZero = strokes.every(item => item.strokeWeight === 0)
    if (isAllZero) {
      zeroWeightStrokes.push(...strokes)
      return false
    }
    return true
  })
  finalArr[0][1].push(...zeroWeightStrokes)
  return finalArr
}

//TODO: strokeDashes
export const transGeometry = (styles: TargetProps, type: NodeType) => {
  // 当background-image可以多个值，用逗号隔开，不是图片的时候，置空，转去处理background属性，因为渐变也会被当成background-image
  // styles.backgroundImage = /url\("(.*)"\)/.exec(styles.backgroundImage)?.[1] || '';
  const images = styles.backgroundImage.split(/(?=url)(?![^(]*\))/).map(item => /url\("(.*)"\)/.exec(item)?.[1]).filter(item => !!item)
  // 填充
  const fills = [
    ...transBGColor(type === 'TEXT'? styles.color : styles.backgroundColor, styles), 
    ...(images.map(item => transImagePaint({
      backgroundImage: item,
      backgroundRepeat: styles.backgroundRepeat,
      backgroundSize: styles.backgroundSize,
      objectFit: styles.objectFit,
    })).filter(item => !!item))] as Paint[];
  const result = {} as GeometryMixin & RectangleStrokeWeightMixin;
  result.fills = fills;
  if (type !== 'TEXT') {
    result.strokeWeight = parseFloat(styles.borderWidth) || 0;
    const translatedStrokes = transStrokes(styles)
    const strokes = translatedStrokes.map((item) => {
      const [color, singleSideStrokes] = item
      const paint = transSolidColor(color)
      // 如果只有一条边则全部边都一种粗细，不需要单独设置单边粗细
      if (translatedStrokes.length > 1 || singleSideStrokes.some(({ strokeWeight }) => strokeWeight === 0)) {
        for (const { strokeWeight, side } of singleSideStrokes) {
          result[side] = strokeWeight
        }
      }
      return paint as SolidPaint
    });
    //文字节点由于复用父节点的样式 border不继承 只继承color
    result.strokes = strokes;
    result.strokeStyle = transStrokeStyle(styles.borderStyle)
    result.strokeAlign = styles.boxSizing === 'border-box'? 'INSIDE' : 'OUTSIDE';
    result.strokeCap = 'NONE';
    result.strokeJoin = 'MITER';
  }

  return result;
}