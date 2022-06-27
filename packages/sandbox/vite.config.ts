import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import envPlugin from 'vite-plugin-environment'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    envPlugin(['NODE_ENV', 'TAMAGUI_TARGET']),
    react({
      jsxRuntime: 'automatic',
      fastRefresh: true,
      jsxPure: true,
    }),
  ],
  esbuild: {
    loader: 'tsx',
  },
  define: {
    global: {},
    _frameTimestamp: undefined,
    _WORKLET: false,
  },
  optimizeDeps: {
    esbuildOptions: {
      resolveExtensions: [
        '.web.js',
        '.web.ts',
        '.web.tsx',
        '.js',
        '.jsx',
        '.json',
        '.ts',
        '.tsx',
        '.mjs',
      ],
      loader: {
        '.js': 'jsx',
      },
    },
  },
  resolve: {
    extensions: ['.web.js', '.web.ts', '.web.tsx', '.js', '.jsx', '.json', '.ts', '.tsx', '.mjs'],
    alias: {
      'react-native/Libraries/Renderer/shims/ReactFabric': '@tamagui/proxy-worm',
      'react-native/Libraries/Utilities/codegenNativeComponent': '@tamagui/proxy-worm',
      'react-native': 'react-native-web',
    },
  },
})

// {
//   name: 'react-native-web',
//   enforce: 'pre',

//   load(id) {
//     console.log('load', id)
//   },

//   resolveFileUrl(a) {
//     console.log('reasd', a)
//   },

//   resolveId(ctx, source, importer) {
//     console.log('rsolve', source)
//   },
// },
