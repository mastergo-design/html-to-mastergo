
<template>
  <div class="container" id="dropContent">
    <CompoWrapper v-for="{ component, content, props } in compoList">
      <template v-slot:compo="compo">
        <component :is="component" :="props" draggable="true" >{{ content }}</component>
      </template>
    </CompoWrapper>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue'
import { ref, toRaw, shallowReadonly } from 'vue'
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


import { htmlToMG } from '../../../lib'

const compoList = shallowReadonly([{
  component: Button,
  content: 'This a button',
  props: {
    type: 'primary',
    dragable: true,
  }
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
    percent: '75'
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
}])


/**
 * get htmlToMg Json
 */
const getConvertedResult = (element: HTMLElement) => {
  return htmlToMG(element)
}

/**
 * post message to topWindow and listen to onDrop event.
 */
const postDropEvent = (evt: DragEvent) => {
  const result = getConvertedResult(evt.target as HTMLElement)

  const { clientX, clientY } = evt
  window.parent.postMessage({
    pluginDrop: {
      clientX,
      clientY,
      items: result
    }
  }, '*')
}

const onDragEnd = (evt: DragEvent) => {
  if (evt?.view?.length === 0) {
    // 落在window内不算拖拽出插件
    return
  }
  // 拖拽出画布 生成设计图
  postDropEvent(evt)
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
