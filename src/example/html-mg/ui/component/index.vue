<template>
  <div class="wrapper">
    <slot name="compo" :type="name"></slot>
  </div>
</template>
<script lang='ts' setup>
import { onMounted, onUnmounted } from 'vue'
import { ref, toRaw } from '@vue/reactivity'

const name = ref('hah')

</script>
<style lang='scss' scoped>
.wrapper {
  width: 100%;
  min-height: 60px;
  padding: 12px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
}

.wrapper + .wrapper {
  border-top: 1px solid #f5f5f5;
}
</style>