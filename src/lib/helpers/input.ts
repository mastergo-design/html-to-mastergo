import { TargetProps, ExtraNodeType } from '../index.d';
import { getNumber, isInput, isTextWrapped } from '../helpers';

export type PesudoInputText = {
  nodeType: ExtraNodeType.INPUT,
  styles: TargetProps,
  node: HTMLElement
}

/**
 * textArea中的文字会折行，需要计算多行逻辑
 */
const calculateBoundOfTextInTextArea = (text: string, styles: TargetProps, textArea: HTMLTextAreaElement): { range: Range, remove: CallableFunction } => {
  const tempDiv = document.createElement('div');
  tempDiv.style.cssText = `
      position: absolute;
      left: -9999px;
      top: -9999px;
      width: ${textArea.offsetWidth}px;
      height: ${textArea.offsetHeight}px;
      font-size: ${styles.fontSize};
      font-family: ${styles.fontFamily};
      line-height: ${styles.lineHeight};
      padding: ${styles.padding};
      border: ${styles.border};
      white-space: pre-wrap;
  `;
  tempDiv.innerHTML = text.replace(/\n/g, '<br>');
  document.body.appendChild(tempDiv);

  // 获取文字的实际包围盒
  const range = document.createRange();
  range.selectNode(tempDiv.childNodes[0]);
  return {
    range,
    remove: () => {
      range.detach();
      document.body.removeChild(tempDiv);
    }
  }
}

const calculateBoundOfTextInInput = (text: string): { range: Range, remove: CallableFunction } => {
  // 获取文字的实际包围盒
  const dummy = document.createTextNode(text);
  // 插入dom计算
  document.body.append(dummy);

  const range = document.createRange();
  range.selectNode(dummy);

  return {
    range,
    remove: () => {
      range.detach();
      document.body.removeChild(dummy); 
    }
  }
}

// 创建一个text来处理input中的value或者placeHolder
export const createPesudoText = (input: HTMLInputElement | HTMLTextAreaElement, inputStyle: TargetProps): PesudoInputText | null => {

  let pseudoText: string;

  const { value, placeholder } = input as HTMLInputElement;
  if (!value && !placeholder) return null;
  if (value) {
    pseudoText = value;
  } else {
    pseudoText = placeholder;
  }

  const {
    paddingLeft,
    paddingRight,
    paddingTop,
    textIndent,
    width,
    height,
  } = inputStyle;

  // textNode节点不是element, 无法通过getComputedStyle获取, 所以延用input的样式
  const textStyles = {...inputStyle}

  // 是否是input
  const elementIsInput = isInput(input)

  const { range, remove } = elementIsInput? calculateBoundOfTextInInput(pseudoText) : calculateBoundOfTextInTextArea(pseudoText, textStyles, input as HTMLTextAreaElement)

  // 复制给textContent
  const rect = range.getBoundingClientRect();

  textStyles.width = `${getNumber(width) - getNumber(paddingLeft) - getNumber(textIndent) - getNumber(paddingRight)}px`
  // 这里高度延用输入框的 因为文字行高字号没有设置 计算高度会用系统默认字号和行高
  textStyles.height = `${rect.height}px`
  textStyles.lineHeight = `${rect.height}px`

  // 加上父元素的padding
  const x = `${getNumber(paddingLeft) + getNumber(textIndent)}px`
  // 一般来说 textArea的placeholder的居顶，input垂直居中
  // textArea.y = 0 + paddingTop input.y = (input.height - rect.height) / 2 + paddingTop
  let y = `${getNumber(paddingTop)}px`
  if (elementIsInput) {
    y = `${(getNumber(height) - rect.height) / 2 + getNumber(paddingTop)}px`
  }
  textStyles.x = x
  textStyles.y = y
  textStyles.left = x
  textStyles.top = y

  // placeholder颜色
  // https://stackoverflow.com/questions/37410244/get-placeholder-color-using-javascript
  if (!value) {
    const placeHoderStyle = getComputedStyle(input, '::placeholder')
    textStyles.color = JSON.stringify(placeHoderStyle) !== JSON.stringify(inputStyle)? placeHoderStyle.color : 'rgba(0, 0, 0, 0.24)'
  }

  //折行 textArea是会折行
  if (!elementIsInput) {
    textStyles.isTextWrapped = isTextWrapped(range, getNumber(inputStyle.lineHeight))
  } else {
    // input不折行
    textStyles.isTextWrapped = false
  }

  // 处理完成后移除
  remove()

  return {
    nodeType: ExtraNodeType.INPUT,
    styles: textStyles,
    node: {
      textContent: pseudoText
    }
  } as any
}