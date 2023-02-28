import { readFile } from 'fs/promises'

import { build } from 'esbuild'
import flowRemoveTypes from 'flow-remove-types'

import { extensions } from './extensions.js'

export async function nativePrebuild() {
  console.log(`Prebuilding React Native (one time cost...)`)
  await Promise.all([
    // react
    build({
      bundle: true,
      entryPoints: ['react'],
      outfile: 'react.js',
      format: 'cjs',
      target: 'node14',
      jsx: 'transform',
      jsxFactory: 'react',
      allowOverwrite: true,
      platform: 'node',
      define: {
        __DEV__: 'true',
        'process.env.NODE_ENV': `"development"`,
      },
      logLevel: 'warning',
      resolveExtensions: extensions,
    }),
    // react-jsx-runtime
    build({
      bundle: true,
      entryPoints: ['react/jsx-runtime'],
      outfile: 'react-jsx-runtime.js',
      format: 'cjs',
      target: 'node14',
      jsx: 'transform',
      jsxFactory: 'react',
      external: ['react'],
      allowOverwrite: true,
      platform: 'node',
      define: {
        // metro serves this in production mode
        __DEV__: 'false',
        'process.env.NODE_ENV': `"production"`,
      },
      logLevel: 'warning',
      resolveExtensions: extensions,
    }),
    // react native
    build({
      bundle: true,
      entryPoints: ['/Users/n8/tamagui/node_modules/react-native/index.js'],
      outfile: 'react-native.js',
      format: 'cjs',
      target: 'node14',
      jsx: 'transform',
      jsxFactory: 'react',
      allowOverwrite: true,
      platform: 'node',
      loader: {
        '.png': 'dataurl',
        '.jpg': 'dataurl',
        '.jpeg': 'dataurl',
        '.gif': 'dataurl',
      },
      define: {
        __DEV__: 'true',
        'process.env.NODE_ENV': `"development"`,
      },
      logLevel: 'warning',
      resolveExtensions: extensions,
      external: ['react', 'react/jsx-runtime.js', 'react/jsx-runtime'],
      plugins: [
        {
          name: 'remove-flow',
          setup(build) {
            build.onLoad(
              {
                filter: /.*.js/,
              },
              async (input) => {
                if (!input.path.includes('react-native')) {
                  return
                }
                const code = await readFile(input.path, 'utf-8')
                const output = flowRemoveTypes(code, { pretty: true })
                const contents = output.toString().replace(/static\s+\+/g, 'static ')
                return {
                  contents,
                  loader: 'jsx',
                }
              }
            )
          },
        },
      ],
    }),
  ])
}
