import { renderToMasterGo } from '../../../lib/index'
console.clear();

const main = async () => {
  mg.showUI(__html__);
}

main();

// mg.on的callback不能用async修饰
mg.on('drop', (evt: DropEvent) => {
  const { absoluteX, absoluteY, items } = evt 
  try {
    renderToMasterGo(items).then(node => {
      setTimeout(() => {
        if (node) {
          node.x = absoluteX
          node.y = absoluteY
        }
        console.log('生成成功', node!.x)
      }, 100);
    })
  } catch (error) {
    console.error('生成失败', error)
  }
})