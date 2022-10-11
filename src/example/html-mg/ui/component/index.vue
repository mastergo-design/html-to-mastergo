<template>
  <div class="wrapper">
    <div class="compo">
      <slot name="compo" :type="name"></slot>
    </div>
    <Button style="margin-top: 40px">Drag or click this</Button>
  </div>
</template>
<script lang='ts' setup>
import { ref } from '@vue/reactivity'
import { Button } from 'ant-design-vue'

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

  .compo {
    padding: 2px;
    border: 1px solid #00B578;
    border-radius: 6px;
  }
}

.wrapper + .wrapper {
  border-top: 1px solid #f5f5f5;
}
</style>