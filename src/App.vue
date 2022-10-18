<template>
    <a-button id="button" @click="() => convert('button')">
        <template #icon><SearchOutlined /></template>
        BUTTON
    </a-button>
    <div id="rect" style="background: red; width: 100px; height: 100px;" @click="() => convert('rect')"></div>
    <p id="text" @click="() => convert('text')">Text</p>
    <div id="flex" @click="() => convert('flex')" style="width: 100px; height: 40px; display: flex; background-color: blue; flex-direction: row; gap: 10px; align-items: center; justify-content: center;">
        <div style="height: 100px; background-color: green;">content</div>
        <div style="height: 100px; background-color: green;">content</div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { SearchOutlined } from '@ant-design/icons-vue';

import { htmlToMG } from './lib';

export default defineComponent({
    components: {
        SearchOutlined,
    },
    setup() {
        return {
            convert: (id: string) => {
                const result = htmlToMG(document.getElementById(id)!);
            },
        };
    },
})
</script>