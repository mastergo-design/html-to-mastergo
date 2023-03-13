
<template>
  <div class="container" id="dropContent">
    <CompoWrapper v-for="({ component, content, props }, idx) in compoList" :onConvert="onConvert" :index="idx">
      <template v-slot:compo>
        <component :id="`dragElement-${idx}`" :is="component" :="props" draggable="true" ref="refs">
          {{ content }}
        </component>
      </template>
    </CompoWrapper>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue'
import { ref, shallowReadonly } from 'vue'
import CompoWrapper from './component/index.vue'

import { Button, Result, Progress } from 'ant-design-vue'
import Breadcrumb from './component/breadcrumb.vue'
import Menu from './component/menu.vue'
import PageHeader from './component/pageHeader.vue'
import Calendar from './component/calendar.vue'
import Table from "./component/table.vue";
import ImageView from './component/image.vue'

import 'ant-design-vue/es/menu/style/css';
import 'ant-design-vue/es/button/style/css';
import 'ant-design-vue/es/result/style/css';
import 'ant-design-vue/es/progress/style/css';
import 'element-plus/es/components/image/style/css'

import { htmlToMG, postProcess } from '../../../lib'

const refs = ref(null)

const compoList = shallowReadonly([
{
  component: Button,
  content: 'This a button',
  props: {
    type: 'primary',
    dragable: true,
  },
}, {
  component: Result,
  props: {
    status: 'success',
    title: 'Successfully Purchased Cloud Server ECS!',
    subTitle: 'Order number: 2017182818828182881 Cloud server configuration takes 1-5 minutes, please wait.'
  }
}, {
  component: Progress,
  props: {
    type: 'circle',
    percent: 75
  }
}, {
  component: Breadcrumb,
}, {
  component: Menu,
}, {
  component: PageHeader,
}, {
  component: Calendar,
}, {
  component: Table,
}, {
  component: ImageView,
}, {
  component: 'div',
  content: 'This is a div',
  props: {
    style: 'background-color: red; display: flex; align-items: center; justify-content: center; padding: 10px;'
  }
}])

const getConvertedResult = async (element: HTMLElement) => {
  const result = await htmlToMG(element, { absoluteBounds: false })
  return await postProcess(result!)
}

/**
 * post message to topWindow and listen to onDrop event.
 */
const postDropEvent = async (evt: DragEvent) => {
  try {
    const result = {"layoutPositioning":"ABSOLUTE","width":200,"height":32,"x":100,"y":100,"name":"DIV","index":0,"isVisible":true,"isLocked":false,"effects":[],"opacity":1,"blendMode":"NORMAL","isMask":false,"fills":[{"type":"SOLID","isVisible":true,"alpha":1,"blendMode":"NORMAL","color":{"r":0,"g":0,"b":0,"a":0}}],"strokeWeight":0,"strokes":[],"strokeStyle":"SOLID","strokeAlign":"INSIDE","strokeCap":"NONE","strokeJoin":"MITER","topLeftRadius":0,"topRightRadius":0,"bottomLeftRadius":0,"bottomRightRadius":0,"clipsContent":false,"type":"FRAME","children":[{"layoutPositioning":"ABSOLUTE","width":0.01,"height":0.01,"x":0,"y":0,"name":"DIV","index":0,"isVisible":true,"isLocked":false,"effects":[{"color":{"r":0,"g":0,"b":0,"a":0.84},"offset":{"x":0},"isVisible":true,"type":"DROP_SHADOW","blendMode":"NORMAL"}],"opacity":0,"blendMode":"NORMAL","isMask":false,"fills":[],"strokeWeight":0,"strokes":[],"strokeStyle":"SOLID","strokeAlign":"OUTSIDE","strokeCap":"NONE","strokeJoin":"MITER","topLeftRadius":0,"topRightRadius":0,"bottomLeftRadius":0,"bottomRightRadius":0,"clipsContent":false,"type":"FRAME","children":[{"layoutPositioning":"ABSOLUTE","width":200,"height":32,"x":0,"y":0,"name":"DIV","index":0,"isVisible":true,"isLocked":false,"effects":[],"opacity":1,"blendMode":"NORMAL","isMask":false,"fills":[{"type":"SOLID","isVisible":true,"alpha":1,"blendMode":"NORMAL","color":{"r":1,"g":1,"b":1,"a":1}}],"strokeWeight":1,"strokes":[{"type":"SOLID","isVisible":true,"alpha":1,"blendMode":"NORMAL","color":{"r":0,"g":0,"b":0,"a":0.12}}],"strokeStyle":"SOLID","strokeAlign":"INSIDE","strokeCap":"NONE","strokeJoin":"MITER","topLeftRadius":6,"topRightRadius":6,"bottomLeftRadius":6,"bottomRightRadius":6,"flexMode":"HORIZONTAL","itemSpacing":0,"mainAxisAlignItems":"FLEX_START","crossAxisAlignItems":"FLEX_START","mainAxisSizingMode":"FIXED","crossAxisSizingMode":"FIXED","paddingTop":0,"paddingRight":8,"paddingBottom":0,"paddingLeft":8,"clipsContent":false,"type":"FRAME","children":[{"name":"INPUT","index":0,"isVisible":true,"isLocked":false,"effects":[],"opacity":1,"blendMode":"NORMAL","isMask":false,"fills":[{"type":"SOLID","isVisible":true,"alpha":1,"blendMode":"NORMAL","color":{"r":0,"g":0,"b":0,"a":0}}],"strokeWeight":0,"strokes":[],"strokeStyle":"SOLID","strokeAlign":"INSIDE","strokeCap":"NONE","strokeJoin":"MITER","layoutPositioning":"ABSOLUTE","width":162,"height":30,"x":9,"y":1,"topLeftRadius":0,"topRightRadius":0,"bottomLeftRadius":0,"bottomRightRadius":0,"type":"RECTANGLE"},{"layoutPositioning":"ABSOLUTE","width":16,"height":30,"x":175,"y":1,"name":"SPAN","index":0,"isVisible":true,"isLocked":false,"effects":[],"opacity":1,"blendMode":"NORMAL","isMask":false,"fills":[{"type":"SOLID","isVisible":true,"alpha":1,"blendMode":"NORMAL","color":{"r":0,"g":0,"b":0,"a":0}}],"strokeWeight":0,"strokes":[],"strokeStyle":"SOLID","strokeAlign":"INSIDE","strokeCap":"NONE","strokeJoin":"MITER","topLeftRadius":0,"topRightRadius":0,"bottomLeftRadius":0,"bottomRightRadius":0,"clipsContent":false,"type":"FRAME","children":[{"layoutPositioning":"ABSOLUTE","width":16,"height":18.671875,"x":0,"y":5.65625,"name":"I","index":0,"isVisible":true,"isLocked":false,"effects":[],"opacity":1,"blendMode":"NORMAL","isMask":false,"fills":[{"type":"SOLID","isVisible":true,"alpha":1,"blendMode":"NORMAL","color":{"r":0,"g":0,"b":0,"a":0}}],"strokeWeight":0,"strokes":[],"strokeStyle":"SOLID","strokeAlign":"INSIDE","strokeCap":"NONE","strokeJoin":"MITER","topLeftRadius":0,"topRightRadius":0,"bottomLeftRadius":0,"bottomRightRadius":0,"clipsContent":false,"type":"FRAME","children":[{"characters":"\n  \n  ","type":"TEXT","textAutoResize":"WIDTH_AND_HEIGHT","textAlignHorizontal":"LEFT","textAlignVertical":"TOP","textStyles":[{"start":0,"end":6,"textStyle":{"lineHeight":{"unit":"PIXELS","value":0},"fontSize":16,"fontName":{"family":"mtdicon","style":"Regular"},"textDecoration":"NONE"}}],"name":"\n  \n  ","index":0,"isVisible":true,"isLocked":false,"effects":[],"opacity":1,"blendMode":"NORMAL","isMask":false,"fills":[{"type":"SOLID","isVisible":true,"alpha":1,"blendMode":"NORMAL","color":{"r":0,"g":0,"b":0,"a":0.5}}],"layoutPositioning":"ABSOLUTE","width":0.01,"height":0.01,"x":-275,"y":-106.65625},{"type":"PEN","content":"<svg version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" xmlns:xlink=\"http://www.w3.org/1999/xlink\" x=\"0\" y=\"0\" width=\"1024\" height=\"1024\" viewBox=\"0 0 1024 1024\" style=\"width: 1em; height: 1em; vertical-align: middle; fill: rgba(0, 0, 0, 0.5); overflow: hidden;\">\n  <path d=\"M256 128L256 128 768 128Q803 128 832.5 145 862 162 879 191.5 896 221 896 256L896 256 896 768Q896 803 879 832.5 862 862 832.5 879 803 896 768 896L768 896 256 896Q221 896 191.5 879 162 862 145 832.5 128 803 128 768L128 768 128 256Q128 221 145 191.5 162 162 191.5 145 221 128 256 128ZM192 277L832 277 832 256Q832 229 813.5 210.5 795 192 768 192L768 192 256 192Q229 192 210.5 210.5 192 229 192 256L192 256 192 277ZM832 768L832 341 192 341 192 768Q192 795 210.5 813.5 229 832 256 832L256 832 768 832Q795 832 813.5 813.5 832 795 832 768L832 768ZM331 405L331 405Q348 405 360.5 417.5 373 430 373 448 373 466 360.5 478.5 348 491 330.5 491 313 491 300.5 478.5 288 466 288 448 288 430 300.5 417.5 313 405 331 405ZM512 405L512 405Q530 405 542.5 417.5 555 430 555 448 555 466 542.5 478.5 530 491 512 491 494 491 481.5 478.5 469 466 469 448 469 430 481.5 417.5 494 405 512 405ZM693 405L693 405Q711 405 723.5 417.5 736 430 736 448 736 466 723.5 478.5 711 491 693.5 491 676 491 663.5 478.5 651 466 651 448 651 430 663.5 417.5 676 405 693 405ZM331 544L331 544Q342 544 352 549.5 362 555 368 565 374 575 374 586.5 374 598 368 608 362 618 352 623.5 342 629 331 629L331 629Q313 629 300.5 616.5 288 604 288 586.5 288 569 300.5 556.5 313 544 331 544ZM512 544L512 544Q523 544 533 549.5 543 555 549 565 555 575 555 586.5 555 598 549 608 543 618 533 623.5 523 629 512 629L512 629Q494 629 482 616.5 470 604 470 586.5 470 569 482 556.5 494 544 512 544ZM693 544L693 544Q705 544 715 549.5 725 555 730.5 565 736 575 736 586.5 736 598 730.5 608 725 618 715 623.5 705 629 693 629L693 629Q676 629 663.5 616.5 651 604 651 586.5 651 569 663.5 556.5 676 544 693 544ZM331 683L331 683Q342 683 352 688.5 362 694 368 704 374 714 374 725.5 374 737 368 747 362 757 352 762.5 342 768 331 768L331 768Q313 768 300.5 755.5 288 743 288 725.5 288 708 300.5 695.5 313 683 331 683ZM512 683L512 683Q523 683 533 688.5 543 694 549 704 555 714 555 725.5 555 737 549 747 543 757 533 762.5 523 768 512 768L512 768Q494 768 482 755.5 470 743 470 725.5 470 708 482 695.5 494 683 512 683Z\"></path>\n  </svg>","layoutPositioning":"ABSOLUTE","width":16,"height":16,"x":0,"y":2.671875}]}]}]}]}]}
    console.log('succeed convert', result)
    const { clientX, clientY } = evt
    console.log('client: ', clientX)
    window.parent.postMessage({
      pluginDrop: {
        clientX,
        clientY,
        items: result
      }
    }, '*')
  } catch (error) {
    console.error('failed to convert', error)
  }
}

const onDragEnd = (evt: DragEvent) => {
  if (evt?.view?.length === 0) {
    // It doesnt count if element droped in plugin window.
    return
  }
  postDropEvent(evt)
}

/**
 * post to plugin directly, we use central position of the window
 */
const onConvert = async (idx: number) => {
  try {
    const element = document.getElementById(`dragElement-${idx}`)
    const result = await getConvertedResult(element as HTMLElement)
    console.log('succeed convert', JSON.stringify(result))
    parent.postMessage({
      pluginDrop: {
        clientX: 300,
        clientY: 300,
        items: result
      }
    }, '*')
  } catch (error) {
    console.error('failed to convert', error)
  }
}

onMounted(() => {
  const node = document.getElementById('dropContent')
  node?.addEventListener('dragend', onDragEnd)
})

onUnmounted(() => {
  const node = document.getElementById('dropContent')
  node?.removeEventListener('dragend', onDragEnd)
})


</script>

<style lang="scss" scoped>
.container {
  width: 100%;
  height: 100%;
  overflow-y: scroll;
}
</style>
