import { renderToMasterGo } from '../../../lib/index'

const main = async () => {
  mg.showUI(__html__);
}

main();

// mg.on的callback不能用async修饰
mg.on('drop', (evt: DropEvent) => {
  const { absoluteX, absoluteY, items } = evt 
  try {
    renderToMasterGo(items).then(node => {
      if (node) {
        node.x = absoluteX
        node.y = absoluteY
      }
      console.log('生成成功', node!.x)
    })
  } catch (error) {
    console.error('生成失败', error)
  }
})