import { resolve } from 'path'
import { defineConfig, BuildOptions } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteSingleFile } from "vite-plugin-singlefile"
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver, AntDesignVueResolver } from 'unplugin-vue-components/resolvers'

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
      viteSingleFile(),
      AutoImport({
        resolvers: [ElementPlusResolver()],
        dts: false,
      }),
      Components({
        resolvers: [ElementPlusResolver(), AntDesignVueResolver()],
        dts: false,
      }),
    ],
    build: {
      ...buildConfig as BuildOptions,
      emptyOutDir: false,
      minify: process.env.NODE_ENV === 'development'? false : true,
    }
  }
})