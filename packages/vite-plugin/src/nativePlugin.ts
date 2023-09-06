import { dirname } from 'path'

// import { esbuildCommonjs, viteCommonjs } from '@originjs/vite-plugin-commonjs'
import { transform } from '@swc/core'
import { parse } from 'es-module-lexer'
import { readFile } from 'fs-extra'
import { OutputOptions } from 'rollup'
import type { Plugin } from 'vite'

import { extensions } from './extensions'
import { getVitePath } from './getVitePath'

export function nativePlugin(options: { port: number; mode: 'build' | 'serve' }): Plugin {
  return {
    name: 'tamagui-native',
    enforce: 'pre',

    config: async (config) => {
      config.define ||= {}
      config.define['process.env.REACT_NATIVE_SERVER_PUBLIC_PORT'] = JSON.stringify(
        `${options.port}`
      )
      config.define['process.env.REACT_NATIVE_PLATFORM'] = JSON.stringify(`ios`)

      if (!config.build) config.build = {}

      config.build.modulePreload = { polyfill: false }
      // Ensures that even very large assets are inlined in your JavaScript.
      config.build.assetsInlineLimit = 100000000
      // Avoid warnings about large chunks.
      config.build.chunkSizeWarningLimit = 100000000
      // Emit all CSS as a single file, which `vite-plugin-singlefile` can then inline.
      config.build.cssCodeSplit = false
      // Avoids the extra step of testing Brotli compression, which isn't really pertinent to a file served locally.
      config.build.reportCompressedSize = false
      // Subfolder bases are not supported, and shouldn't be needed because we're embedding everything.
      config.base = undefined

      config.resolve ??= {}

      config.resolve.extensions = extensions

      config.optimizeDeps ??= {}

      config.optimizeDeps.disabled = true
      // config.optimizeDeps.include = ['escape-string-regexp']

      // config.plugins ||= []
      // config.plugins.push(viteCommonjs())

      // config.optimizeDeps.needsInterop ??= []
      // config.optimizeDeps.needsInterop.push('react-native')

      // config.esbuild = false

      config.optimizeDeps.esbuildOptions ??= {}
      config.optimizeDeps.esbuildOptions.resolveExtensions = extensions

      config.optimizeDeps.esbuildOptions.plugins ??= []

      // CANT DO THIS BECAUSE TAMAGUI PLUGIN DOES THIS! they clobber each other!
      // config.optimizeDeps.esbuildOptions.plugins.push(
      //   esbuildCommonjs(['escape-string-regexp'])
      // )

      // config.optimizeDeps.esbuildOptions.alias = {
      //   'react-native': '@tamagui/proxy-worm',
      // }

      // config.optimizeDeps.esbuildOptions.plugins.push(
      //   esbuildFlowPlugin(
      //     /node_modules\/(react-native\/|@react-native\/)/,
      //     (_) => 'jsx',
      //     {
      //       all: true,
      //     }
      //   )
      // )

      config.optimizeDeps.esbuildOptions.loader ??= {}
      config.optimizeDeps.esbuildOptions.loader['.js'] = 'jsx'

      config.optimizeDeps.esbuildOptions.plugins.push({
        name: 'react-native-assets',
        setup(build) {
          build.onResolve(
            {
              filter: /\.(png|jpg|gif|webp)$/,
            },
            async ({ path, namespace }) => {
              return {
                path: '',
                external: true,
              }
            }
          )
        },
      })

      config.build.rollupOptions ??= {}

      config.build.rollupOptions.input = config.root

      config.build.rollupOptions.output ??= {}

      config.build.rollupOptions.plugins ??= []

      // config.build.rollupOptions.external = [
      //   'react-native',
      //   'react',
      //   'react/jsx-runtime',
      //   'react/jsx-dev-runtime',
      // ]

      if (!Array.isArray(config.build.rollupOptions.plugins)) {
        throw `x`
      }

      if (options.mode === 'build') {
        config.plugins ||= []

        // https://vitejs.dev/config/dep-optimization-options.html
        // config.build.commonjsOptions ||= {}
        // config.build.commonjsOptions.include = []

        // CANT DO THIS BECAUSE TAMAGUI PLUGIN DOES THIS! they clobber each other!
        // config.plugins.push(
        //   viteCommonjs({
        //     include: ['escape-string-regexp'],
        //   })
        // )

        // config.resolve.alias = {
        //   ...config.resolve.alias,
        //   'react-native': virtualModuleId,
        // }

        config.build.rollupOptions.plugins.push({
          name: `force-export-all`,

          async transform(code, id) {
            // if (!id.includes('/node_modules/')) {
            //   return
            // }

            try {
              const [imports, exports] = parse(code)

              let forceExports = ''

              // note that es-module-lexer parses export * from as an import (twice) for some reason
              let counts = {}
              for (const imp of imports) {
                if (imp.n && imp.n[0] !== '.') {
                  counts[imp.n] ||= 0
                  counts[imp.n]++
                  if (counts[imp.n] == 2) {
                    // star export
                    const path = await getVitePath(dirname(id), imp.n)
                    forceExports += `Object.assign(exports, require("${path}"));`
                  }
                }
              }

              forceExports += exports
                .map((e) => {
                  if (e.n === 'default') {
                    return ''
                  }
                  let out = ''
                  if (e.ln !== e.n) {
                    // forces the "as x" to be referenced so it gets exported
                    out += `__ignore = typeof ${e.n} === 'undefined' ? 0 : 0;`
                  }
                  out += `globalThis.____forceExport = ${e.ln}`
                  return out
                })
                .join(';')

              return code + '\n' + forceExports
            } catch (err) {
              console.warn(`Error forcing exports, probably ok`, id)
            }
          },
        })

        config.build.rollupOptions.plugins.push({
          name: `native-transform`,

          async transform(code, id) {
            if (
              id.includes(`node_modules/react/jsx-dev-runtime.js`) ||
              id.includes(`node_modules/react/index.js`) ||
              id.includes(`node_modules/react/cjs/react.development.js`) ||
              id.includes(`node_modules/react-native/index.js`) ||
              id.includes(
                `node_modules/react/cjs/react-jsx-dev-runtime.development.js`
              ) ||
              id.includes(`packages/vite-native-client/`)
            ) {
              return
            }

            let out = await transform(code, {
              filename: id,
              swcrc: false,
              configFile: false,
              sourceMaps: true,
              jsc: {
                target: 'es5',
                parser: id.endsWith('.tsx')
                  ? { syntax: 'typescript', tsx: true, decorators: true }
                  : id.endsWith('.ts')
                  ? { syntax: 'typescript', tsx: false, decorators: true }
                  : id.endsWith('.jsx')
                  ? { syntax: 'ecmascript', jsx: true }
                  : { syntax: 'ecmascript' },
                transform: {
                  useDefineForClassFields: true,
                  react: {
                    development: true,
                    runtime: 'automatic',
                  },
                },
              },
            })

            return out
          },
        })
      }

      if (process.env.DEBUG) {
        // rome-ignore lint/suspicious/noConsoleLog: <explanation>
        console.log('config..', config)
      }

      // config.build.commonjsOptions = {
      //   include: /node_modules\/react\//,
      // }

      const updateOutputOptions = (out: OutputOptions) => {
        out.preserveModules = true

        out.entryFileNames = (chunkInfo) => {
          // ensures we have clean names for our require paths
          return '[name].js'
        }
        // Ensure that as many resources as possible are inlined.
        // out.inlineDynamicImports = true

        // added by me (nate):
        out.manualChunks = undefined
      }

      if (Array.isArray(config.build.rollupOptions.output)) {
        for (const o in config.build.rollupOptions.output)
          updateOutputOptions(o as OutputOptions)
      } else {
        updateOutputOptions(config.build.rollupOptions.output as OutputOptions)
      }
    },
  }
}

// failed attempt to get vite to bundle rn, after a bunch of hacks still trouble

//         config.build.rollupOptions.plugins.push({
//           name: 'flow-remove-types',
//           transform: async (codeIn, id) => {
//             if (!id.includes('node_modules')) {
//               return
//             }
//             const flowRemoved = flowRemoveTypes(codeIn).toString()
//             let jsxRemoved = await nativeBabelRemoveJSX(flowRemoved)

//             if (id.includes('BackHandler')) {
//               jsxRemoved = jsxRemoved.replace(
//                 `module.exports = require('../Components/UnimplementedViews/UnimplementedView');`,
//                 ''
//               )
//             }

//             if (jsxRemoved.includes(`module.exports = `)) {
//               jsxRemoved = jsxRemoved.replace(
//                 /\nmodule.exports = /gi,
//                 `\nexport default `
//               )
//             }

//             if (id.endsWith('ReactNativeViewConfigRegistry.js')) {
//               jsxRemoved =
//                 jsxRemoved +
//                 `\nconst allExports = {...exports }; export default allExports;`
//             }

//             if (id.endsWith('ExceptionsManager.js')) {
//               console.log('huh', id)
//               jsxRemoved = jsxRemoved
//                 .replace(/\nfunction /g, 'export function')
//                 .replace('class SynthenticEvent', 'export class SyntheticEvent')
//                 .replace(
//                   `module.exports = {
//   decoratedExtraDataKey,
//   handleException,
//   installConsoleErrorReporter,
//   SyntheticError,
//   unstable_setExceptionDecorator,
// };`,
//                   ``
//                 )
//             }

//             return {
//               code: jsxRemoved,
//               map: null,
//             }
//           },
//         })

// config.build.rollupOptions.plugins.push(
//   commonJs({
//     include: ['**/node_modules/react-native/**', '**/node_modules/base64-js/**'],
//     // ignoreGlobal: true,
//     transformMixedEsModules: true,
//     defaultIsModuleExports: true,
//   }) as any
// )
