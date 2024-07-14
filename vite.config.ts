import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import sassDts from 'vite-plugin-sass-dts'
import tsconfigPaths from 'vite-tsconfig-paths';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 8000,
    host: '0.0.0.0'
  },
  plugins: [
    vue(),
    sassDts(),
    vueJsx(),
    tsconfigPaths()
  ],
  optimizeDeps: {
    esbuildOptions: {
      tsconfigRaw: {
        compilerOptions: {
          experimentalDecorators: true
        }
      }
    }
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@XmlParser': fileURLToPath(new URL('./src/core/modules/XmlParser', import.meta.url)),
      '@models': fileURLToPath( new URL('./src/core/models', import.meta.url)),
      '@services': fileURLToPath( new URL('./src/core/services', import.meta.url)),
      '@components': fileURLToPath( new URL('./src/components', import.meta.url)),
      '@filters': fileURLToPath(new URL('./src/core/models/filters', import.meta.url)),
      '@views': fileURLToPath(new URL('./src/views', import.meta.url))
    }
  }
})
