
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
import CompoWrapper from './example/html-mg/ui/component/index.vue'

import { Button, Result, Progress } from 'ant-design-vue'
import Breadcrumb from './example/html-mg/ui/component/breadcrumb.vue'
import Menu from './example/html-mg/ui/component/menu.vue'
import PageHeader from './example/html-mg/ui/component/pageHeader.vue'
import Calendar from './example/html-mg/ui/component/calendar.vue'
import Table from "./example/html-mg/ui/component/table.vue";

import 'ant-design-vue/es/menu/style/css';
import 'ant-design-vue/es/button/style/css';
import 'ant-design-vue/es/result/style/css';
import 'ant-design-vue/es/progress/style/css';

import { htmlToMG } from './lib'
  
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
  component: 'div',
  content: 'This is a div',
  props: {
    style: 'background-color: red; display: flex; align-items: center; justify-content: center; padding: 10px;'
  }
}])

const generate = async (evt: DragEvent) => {
  try {
    const result = await htmlToMG(evt.target as HTMLElement)
  } catch (error) {
    console.error('failed to convert', error)
  }
}

const onDragEnd = (evt: DragEvent) => {
  if (evt?.view?.length === 0) {
    // It doesnt count if element droped in plugin window.
    return
  }
  generate(evt)
}

/**
 * post to plugin directly, we use central position of the window
 */
const onConvert = async (idx: number) => {
  try {
    const element = document.getElementById(`dragElement-${idx}`)
    const result = await htmlToMG(element as HTMLElement)
    console.log('succeed convert', result)
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
  