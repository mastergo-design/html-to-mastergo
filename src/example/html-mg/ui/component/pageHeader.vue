<template>
  <div>
    <a-page-header title="Title" sub-title="This is a subtitle">
      <template #tags>
        <a-tag color="blue">Running</a-tag>
      </template>
      <template #extra>
        <a-button key="3">Operation</a-button>
        <a-button key="2">Operation</a-button>
        <a-button key="1" type="primary">Primary</a-button>
      </template>
      <a-row type="flex">
        <a-statistic title="Status" value="Pending" />
        <a-statistic
          title="Price"
          prefix="$"
          :value="568.08"
          :style="{
            margin: '0 32px',
          }"
        />
        <a-statistic title="Balance" prefix="$" :value="3345.08" />
      </a-row>
    </a-page-header>
  </div>
</template>
<script lang='ts' setup>

</script>

<style lang='scss' scoped>
.demo-page-header :deep(tr:last-child td) {
  padding-bottom: 0;
}
</style>