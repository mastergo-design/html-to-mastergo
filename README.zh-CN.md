# html-mastergo

**中文** | [English](./README.md)

一款能将网站页面转成MasterGo插件数据结构的工具库。



## 安装

```shell
yarn add html-mastergo | npm install html-mastergo
```

## 使用

1. 使用[mastergo客户端](https://mastergo.com/resource)初始化一个插件项目

2. 构建[UI界面](https://developers.mastergo.com/guide/setup.html#%E6%9E%84%E5%BB%BA%E7%94%A8%E6%88%B7%E7%95%8C%E9%9D%A2)

3. 使用该库

   ```typescript
   /** UI侧 **/
   import { htmlToMG } from 'html-mastergo';
   // 任意dom元素
   const layerJson = htmlToMG(document.body);
   // 将处理好的数据发送到插件侧
   parent.postMessage({
     type: 'generate',
     data: layerJson
   }, '*')
   
   
   /** 插件侧 **/
   mg.ui.onmessage = (msg) => {
     const { data, type } = msg
     if (type === 'generate') {
       // 递归生成节点
       walk(data)
     }
   }
   ```

## 限制

一些已知的限制：

- 并非所有元素类型都受支持（例如 iframe、伪元素）
- 并非所有 CSS 属性都受支持或完全受支持
- 并非所有类型的媒体都受支持（视频、动画 GIF 等）
- 所有字体都必须上传到 MasterGo，否则将使用默认字体

如果您发现任何问题或有任何反馈，请[提出问题](https://github.com/mastergo-design/html-to-mastergo/issues/new)

## 示例

[Example](./src/example/html-mg)