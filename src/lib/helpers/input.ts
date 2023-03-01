import { TargetProps, ExtraNodeType } from '../index.d';
import { getNumber } from '../helpers/utils';

export type PesudoInputText = {
  nodeType: ExtraNodeType.INPUT,
  styles: TargetProps,
  node: HTMLElement
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

  const dummy = document.createTextNode(pseudoText);
  // 插入dom计算
  document.body.append(dummy);

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
  // 复制给textContent

  // 获取文字的实际包围盒
  const range = document.createRange();
  range.selectNode(dummy);
  const rect = range.getBoundingClientRect();
  range.detach();


  textStyles.width = `${getNumber(width) - getNumber(paddingLeft) - getNumber(textIndent) - getNumber(paddingRight)}px`
  // 这里高度延用输入框的 因为文字行高字号没有设置 计算高度会用系统默认字号和行高
  textStyles.height = `${rect.height}px`

  // 加上父元素的padding
  const x = `${getNumber(textStyles.x) + getNumber(paddingLeft) + getNumber(textIndent)}px`
  // 一般来说 textArea的placeholder的居顶，input垂直居中
  // textArea.y = 0 + paddingTop input.y = (input.height - rect.height) / 2 + paddingTop
  let y = `${getNumber(paddingTop)}px`
  if (input.tagName === 'INPUT' || input instanceof HTMLInputElement) {
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

  // 处理完成后移除
  document.body.removeChild(dummy); 
  return {
    nodeType: ExtraNodeType.INPUT,
    styles: textStyles,
    node: {
      textContent: pseudoText
    }
  } as any
}