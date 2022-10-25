# html-mastergo

[中文](./README.zh-CN.md.md) | **English**

A library can convert html into MasterGo designs.

## Install

```shell
yarn add html-mastergo -D | npm install html-mastergo --save-dev
```

## Usage

1. Install [mastergo client](https://mastergo.com/resource) and init a plugin project.

2. Build [UI](https://developers.mastergo.com/guide/setup.html#%E6%9E%84%E5%BB%BA%E7%94%A8%E6%88%B7%E7%95%8C%E9%9D%A2)

3. Use the library

   ```typescript
   /** UI side **/
   import { htmlToMG } from 'html-mastergo';
   // any dom element
   const layerJson = htmlToMG(document.body);
   // post data to plugin
   parent.postMessage({
     type: 'generate',
     data: layerJson
   }, '*')
   
   
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

Importing HTML layers into Mastergo is a tedious process. Even if it is not 100% restoration, it can save you a lot of time, you only need to deal with some data specially.

A few known limitations:

- Not all element types are supported (e.g. iframes, pseudo-elements)
- Not all CSS properties are supported or fully supported
- Not all types of media are supported (video, animated gifs, etc)
- All fonts must be uploaded to Mastergo, otherwise the prepared fonts will be used

If you find any problems or have any feedback, please [Ask a Question](https://github.com/mastergo-design/html-to-mastergo/issues/new)

## Example

[Example](TODO)