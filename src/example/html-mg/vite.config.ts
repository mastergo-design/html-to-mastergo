import { resolve } from 'path'
import { defineConfig, BuildOptions } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteSingleFile } from "vite-plugin-singlefile"

const target = process.env.TARGET

export default defineConfig(() => {
  const buildConfig = target === 'ui'
    ? {
        target: "esnext",
        assetsInlineLimit: 100000000,
        chunkSizeWarningLimit: 100000000,
        cssCodeSplit: false,
        brotliSize: false,
        rollupOptions: {
          inlineDynamicImports: true,
          output: {
            manualChunks: () => "ui.js",
          },
        },
      }
    : {
      lib: {
        entry: resolve(__dirname, './lib/main.ts'),
        name: 'myLib',
        formats: ['umd'],
        fileName: () => `main.js`
      },
    }

  return {
    plugins: [
      vue(),
      viteSingleFile()
    ],
    build: {
      ...buildConfig as BuildOptions,
      emptyOutDir: false
    }
  }
})