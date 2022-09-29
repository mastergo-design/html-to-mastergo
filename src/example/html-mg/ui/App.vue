
<template>
  <button @click="getNewString">Hello, {{ mg }}</button>
</template>

<script setup>
import { ref, toRaw } from 'vue'

const mg = ref('MasterGo')

function getNewString() {
  mg.value = mg.value === 'MasterGo' ? 'World' : 'MasterGo'
  parent.postMessage(toRaw(mg.value), '*')
}
</script>
