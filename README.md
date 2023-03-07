# html-mastergo

[中文](./README.zh-CN.md) | **English**

A library can convert html into MasterGo plugin data structures.
## Install

```shell
yarn add html-mastergo | npm install html-mastergo
```

## Usage

1. Install [MasterGo client](https://mastergo.com/resource) and init a plugin project.

2. Build [UI](https://developers.mastergo.com/guide/setup.html#%E6%9E%84%E5%BB%BA%E7%94%A8%E6%88%B7%E7%95%8C%E9%9D%A2)

3. Use the library

   ```typescript
   /** UI side **/
   import { htmlToMG } from 'html-mastergo';
   // any dom element
   const convert = async () => {
     const layerJson = await htmlToMG(document.body);
     // post data to plugin
     parent.postMessage({
       type: 'generate',
       data: layerJson
     }, '*')
   }
   
   
   /** Plugin side **/
   mg.ui.onmessage = (msg) => {
     const { data, type } = msg
     if (type === 'generate') {
       // traverse
       walk(data)
     }
   }
   ```

## Limitations

A few known limitations:

- Not all element types are supported (e.g. iframes, pseudo-elements)
- Not all CSS properties are supported or fully supported
- Not all types of media are supported (video, animated gifs, etc)
- All fonts must be uploaded to MasterGo, otherwise the default fonts will be used for rendering

If you find any problems or have any feedback, please [Ask a Question](https://github.com/mastergo-design/html-to-mastergo/issues/new)

## Example

[Example](./src/example/html-mg)