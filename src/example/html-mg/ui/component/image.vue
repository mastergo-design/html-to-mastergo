<template>
  <div class="demo-image">
    <div v-for="fit in fits" :key="fit" class="block">
      <span class="demonstration">{{ fit }}</span>
      <ElImage :style="{ width: '100px', height: '100px' }" :src="url" :fit="fit" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElImage } from 'element-plus'

const fits = ['fill', 'contain', 'cover', 'none', 'scale-down'] as const
const url =
  'https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg'
</script>

<style scoped>
.demo-image {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
}
.demo-image .block {
  flex-shrink: 0;
  padding: 30px 0;
  text-align: center;
  box-sizing: border-box;
  vertical-align: top;
}

.block + .block {
  margin-left: 30px;
}
.demo-image .block:last-child {
  border-right: none;
}
.demo-image .demonstration {
  display: block;
  color: var(--el-text-color-secondary);
  font-size: 14px;
  margin-bottom: 20px;
}
</style>
