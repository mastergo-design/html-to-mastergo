import { defineConfig, LibraryOptions, BuildOptions } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

const TARGET = process.env.TARGET

// https://vitejs.dev/config/
export default defineConfig(() => {
  const libConfig = TARGET === 'lib'? {
    outDir: 'lib',
    lib: {
      entry: resolve(__dirname, './src/lib/index.ts'),
      name: 'sdk',
      formats: ['umd', 'cjs', 'es'],
      fileName: 'index'
    } as LibraryOptions,
  }: {} as BuildOptions

  return {
    publicDir: TARGET === 'lib'? false: 'public',
    plugins: [
      dts({
        include: ['./src/lib/index.d.ts']
      }),
      vue(),
    ],
    build: {
      ...libConfig,
    } as BuildOptions,
  }
})
