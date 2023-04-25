# html-mastergo

**中文** | [English](./README.md)

一款能将网站页面转成MasterGo插件数据结构的工具库。



## 安装

```shell
yarn add @mastergo/html-mastergo | npm install @mastergo/html-mastergo
```

## 使用

1. 使用[mastergo客户端](https://mastergo.com/resource)初始化一个插件项目

2. 构建[UI界面](https://developers.mastergo.com/guide/setup.html#%E6%9E%84%E5%BB%BA%E7%94%A8%E6%88%B7%E7%95%8C%E9%9D%A2)(点击这里 [MasterGo-Plugin](https://developers.mastergo.com/) 查看如何开发一个MasterGo插件)

3. 使用该库

   ```typescript
   /** UI侧 **/
   import { htmlToMG, postProcess } from '@mastergo/html-mastergo';
   // 任意dom元素
   const convert = async () => {
     const layerJson = await htmlToMG(document.body);
     // 这一步不是必须的，你可以随意处理htmlToMG处理过的json，该函数只是提供了其中一种实现方式。
     const processedJson = await postProcess(layerJson)
     // post data to plugin
     parent.postMessage({
       type: 'generate',
       data: processedJson
     }, '*')
   }
   
   
   /** 插件侧 **/
   import { renderToMasterGo } from '@mastergo/html-mastergo';
   mg.ui.onmessage = (msg) => {
     const { data, type } = msg
     if (type === 'generate') {
       // 递归生成节点
       renderToMasterGo(data).then(root => {
         console.log('根节点', root)
       })
     }
   }
   ```

## 限制

一些已知的限制：

- 并非所有元素类型都受支持（例如 iframe）
- 并非所有 CSS 属性都受支持或完全受支持
- 并非所有类型的媒体都受支持（视频、动画 GIF 等）
- 所有字体都必须上传到 MasterGo，否则将使用默认字体

如果您发现任何问题或有任何反馈，请[提出问题](https://github.com/mastergo-design/html-to-mastergo/issues/new)

## 示例

[Example](./src/example/html-mg)