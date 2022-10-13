<template>
    <a-button id="button" @click="() => convert('button')">BUTTON</a-button>
    <div id="rect" style="background: red; width: 100px; height: 100px;" @click="() => convert('rect')"></div>
    <p id="text" @click="() => convert('text')">Text</p>
    <div id="flex" @click="() => convert('flex')" style="width: 100px; height: 40px; display: flex; background-color: blue;"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { htmlToMG } from './lib';

export default defineComponent({
    setup() {
        return {
            convert: (id: string) => {
                const result = htmlToMG(document.getElementById(id)!);
            },
        };
    },
})
</script>