import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { createRequire } from 'module'
import path from 'path'
import { fileURLToPath } from 'url'

const require = createRequire(import.meta.url)
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const rnwPath = path.dirname(require.resolve('react-native-web/package.json'))
const codegenStub = path.join(__dirname, 'src/codegen-stub.ts')

export default defineConfig({
  plugins: [
    react({
      jsxImportSource: 'nativewind',
    }),
  ],
  resolve: {
    alias: [
      // codegen stub must come before the general react-native alias
      {
        find: 'react-native/Libraries/Utilities/codegenNativeComponent',
        replacement: codegenStub,
      },
      {
        find: 'react-native',
        replacement: rnwPath,
      },
    ],
    extensions: ['.web.tsx', '.web.ts', '.web.js', '.tsx', '.ts', '.js'],
  },
  optimizeDeps: {
    esbuildOptions: {
      resolveExtensions: ['.web.tsx', '.web.ts', '.web.js', '.tsx', '.ts', '.js'],
      alias: {
        'react-native/Libraries/Utilities/codegenNativeComponent': codegenStub,
      },
    },
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
    __DEV__: process.env.NODE_ENV !== 'production',
  },
})
