<template>
    <a-button @click="convertButton">BUTTON</a-button>
    <div id="button" style="background: red; width: 100px; height: 100px;"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import { htmlToMG } from './lib';

export default defineComponent({
    setup() {
        return {
            convertButton: () => {
                const result = htmlToMG(document.getElementById('button')!);
                console.log(result)
            },
        };
    },
})
</script>