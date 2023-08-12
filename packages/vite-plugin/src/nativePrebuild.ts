import { readFile } from 'fs/promises'
import { join } from 'path'

import * as babel from '@babel/core'
import { build } from 'esbuild'

import { extensions } from './extensions'

export async function nativePrebuild() {
  // rome-ignore lint/nursery/noConsoleLog: <explanation>

  if (process.env.SKIP_PREBUILD_RN) {
    console.log(`⚠️ skipping pre build of rn`)

    return
  }

  console.log(`Prebuilding React Native (one time cost...)`)

  const outdir = join(process.cwd(), 'testing-area')

  await Promise.all([
    // react
    build({
      bundle: true,
      entryPoints: ['react'],
      outfile: join(outdir, 'react.js'),
      format: 'cjs',
      target: 'node20',
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
      outfile: join(outdir, 'react-jsx-runtime.js'),
      format: 'cjs',
      target: 'node20',
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
      outfile: join(outdir, 'react-native.js'),
      format: 'cjs',
      target: 'node20',
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
        // TODO
        'process.env.REACT_NATIVE_SERVER_PUBLIC_PORT': JSON.stringify('8081'),
      },
      logLevel: 'warning',
      resolveExtensions: extensions,
      external: ['react', 'react/jsx-runtime.js', 'react/jsx-runtime'],
      plugins: [
        {
          name: 'remove-flow',
          setup(build) {
            build.onResolve(
              {
                filter: /HMRClient/,
              },
              async (input) => {
                console.log('swapping', input)
                return {
                  path: require.resolve('@tamagui/vite-native-hmr'),
                }
              }
            )

            build.onLoad(
              {
                filter: /.*.js/,
              },
              async (input) => {
                if (
                  !input.path.includes('react-native') &&
                  !input.path.includes(`vite-native-hmr`)
                ) {
                  return
                }

                const code = await readFile(input.path, 'utf-8')

                // omg so ugly but no class support?
                const outagain = babel.transformSync(code, {
                  presets: ['module:metro-react-native-babel-preset'],
                })

                // const contents = output.toString().replace(/static\s+\+/g, 'static ')
                return {
                  contents: outagain.code,
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
