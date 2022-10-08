mg.showUI(__html__)

const textNode = mg.createText();

mg.ui.onmessage = (data) => {
  textNode.characters = data
}