import { readFile } from 'fs/promises'
import { join } from 'path'

import * as babel from '@babel/core'
import { build } from 'esbuild'

import { extensions } from './extensions'

async function nativeBabelFlowTransform(input: string) {
  return await new Promise<string>((res, rej) => {
    babel.transform(
      input,
      {
        presets: ['module:metro-react-native-babel-preset'],
      },
      (err: any, { code }) => {
        if (err) rej(err)
        res(code)
      }
    )
  })
}

const prebuiltDir = join(process.cwd(), 'testing-area')
export const prebuiltFiles = {
  react: join(prebuiltDir, 'react.js'),
  reactJSXRuntime: join(prebuiltDir, 'react-jsx-runtime.js'),
  reactNative: join(prebuiltDir, 'react-native.js'),
}

export async function nativePrebuild() {
  // rome-ignore lint/nursery/noConsoleLog: <explanation>

  if (process.env.SKIP_PREBUILD_RN) {
    console.log(`⚠️ skipping pre build of rn`)

    return
  }

  console.log(`Prebuilding React Native (one time cost...)`)

  await Promise.all([
    build({
      bundle: true,
      entryPoints: ['/Users/n8/tamagui/node_modules/react-native/index.js'],
      outfile: prebuiltFiles.reactNative,
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
      plugins: [
        {
          name: 'remove-flow',
          setup(build) {
            build.onResolve(
              {
                filter: /HMRClient/,
              },
              async (input) => {
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
                const outagain = await nativeBabelFlowTransform(code)

                return {
                  contents: outagain,
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
