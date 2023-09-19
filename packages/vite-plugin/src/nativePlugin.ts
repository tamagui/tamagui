import { dirname } from 'path'

// import { esbuildCommonjs, viteCommonjs } from '@originjs/vite-plugin-commonjs'
import { transform } from '@swc/core'
import { parse } from 'es-module-lexer'
import { OutputOptions } from 'rollup'
import type { Plugin } from 'vite'
import commonjs from 'vite-plugin-commonjs'

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

      config.optimizeDeps.esbuildOptions ??= {}
      config.optimizeDeps.esbuildOptions.resolveExtensions = extensions

      config.optimizeDeps.esbuildOptions.plugins ??= []

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

        config.plugins.push(
          commonjs({
            filter: (id) => {
              return id.includes('react-native-screens/lib/module')
            },
          })
        )

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
      }

      if (process.env.DEBUG) {
        // biome-ignore lint/suspicious/noConsoleLog: <explanation>
        console.log('config..', config)
      }

      const updateOutputOptions = (out: OutputOptions) => {
        out.preserveModules = true

        // this fixes some warnings but breaks import { default as config }
        // out.exports = 'named'

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
