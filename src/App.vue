<template>
    <a-button id="button" @click="convertButton">BUTTON</a-button>
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