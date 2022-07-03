import type { TamaguiOptions } from '@tamagui/static'
import type { Plugin } from 'vite'
import envPlugin from 'vite-plugin-environment'

export function tamaguiPlugin(options?: TamaguiOptions): Plugin {
  return {
    name: 'tamagui',
    enforce: 'pre',

    config(userConfig, env) {
      return {
        plugins: [envPlugin(['NODE_ENV', 'TAMAGUI_TARGET'])],
        esbuild: {
          loader: 'tsx',
        },
        define: {
          global: {},
          _frameTimestamp: undefined,
          _WORKLET: false,
          process: {
            env: {
              TAMAGUI_TARGET: process.env.TAMAGUI_TARGET || 'web',
              NODE_ENV: process.env.NODE_ENV || env.mode,
            },
          },
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
          // for once it extracts
          // mainFields: ['module:jsx', 'module', 'jsnext:main', 'jsnext'],
          extensions: [
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
          alias: {
            'react-native/Libraries/Renderer/shims/ReactFabric': '@tamagui/proxy-worm',
            'react-native/Libraries/Utilities/codegenNativeComponent': '@tamagui/proxy-worm',
            'react-native': 'react-native-web',
          },
        },
      }
    },
  }
}

// fork from https://github.com/seek-oss/vanilla-extract/blob/master/packages/vite-plugin/src/index.ts

// import path from 'path'

// import outdent from 'outdent'
// import type { Plugin, ResolvedConfig, ViteDevServer } from 'vite'
// import { normalizePath } from 'vite'

// const styleUpdateEvent = (fileId: string) => `tamagui-style-update:${fileId}`

// interface Options {
//   identifiers?: IdentifierOption
//   esbuildOptions?: CompileOptions['esbuildOptions']
// }
// export function vanillaExtractPlugin({ identifiers, esbuildOptions }: Options = {}): Plugin {
//   let config: ResolvedConfig
//   let server: ViteDevServer
//   let postCssConfig: PostCSSConfigResult | null
//   const cssMap = new Map<string, string>()

//   let virtualExt: string
//   let packageName: string

//   const getAbsoluteVirtualFileId = (source: string) => normalizePath(path.join(config.root, source))

//   return {
//     name: 'tamagui',
//     enforce: 'pre',
//     configureServer(_server) {
//       server = _server
//     },
//     config(_userConfig, env) {
//       const include = env.command === 'serve' ? ['@tamagui/css/injectStyles'] : []

//       return {
//         optimizeDeps: { include },
//         ssr: {
//           external: ['@tamagui/css', '@tamagui/css/fileScope', '@tamagui/css/adapter'],
//         },
//       }
//     },
//     async configResolved(resolvedConfig) {
//       config = resolvedConfig
//       packageName = getPackageInfo(config.root).name

//       if (config.command === 'serve') {
//         postCssConfig = await resolvePostcssConfig(config)
//       }

//       virtualExt = `.vanilla.${config.command === 'serve' ? 'js' : 'css'}`
//     },
//     resolveId(source) {
//       if (!source.endsWith(virtualExt)) {
//         return
//       }

//       // Absolute paths seem to occur often in monorepos, where files are
//       // imported from outside the config root.
//       const absoluteId = source.startsWith(config.root) ? source : getAbsoluteVirtualFileId(source)

//       // There should always be an entry in the `cssMap` here.
//       // The only valid scenario for a missing one is if someone had written
//       // a file in their app using the .vanilla.js/.vanilla.css extension
//       if (cssMap.has(absoluteId)) {
//         return absoluteId
//       }
//     },
//     load(id) {
//       if (!cssMap.has(id)) {
//         return
//       }

//       const css = cssMap.get(id)

//       if (typeof css !== 'string') {
//         return
//       }

//       if (!server || server.config.isProduction) {
//         return css
//       }

//       return outdent`
//         import { injectStyles } from '@tamagui/css/injectStyles';

//         const inject = (css) => injectStyles({
//           fileScope: ${JSON.stringify({ filePath: id })},
//           css
//         });

//         inject(${JSON.stringify(css)});

//         import.meta.hot.on('${styleUpdateEvent(id)}', (css) => {
//           inject(css);
//         });
//       `
//     },
//     async transform(code, id, ssrParam) {
//       if (!cssFileFilter.test(id)) {
//         return null
//       }

//       let ssr: boolean | undefined

//       if (typeof ssrParam === 'boolean') {
//         ssr = ssrParam
//       } else {
//         ssr = ssrParam?.ssr
//       }

//       const index = id.indexOf('?')
//       const validId = index === -1 ? id : id.substring(0, index)

//       if (ssr) {
//         return addFileScope({
//           source: code,
//           filePath: normalizePath(validId),
//           rootPath: config.root,
//           packageName,
//         })
//       }

//       const { source, watchFiles } = await compile({
//         filePath: validId,
//         cwd: config.root,
//         esbuildOptions,
//       })

//       for (const file of watchFiles) {
//         // In start mode, we need to prevent the file from rewatching itself.
//         // If it's a `build --watch`, it needs to watch everything.
//         if (config.command === 'build' || file !== id) {
//           this.addWatchFile(file)
//         }
//       }

//       const output = await processVanillaFile({
//         source,
//         filePath: validId,
//         identOption: identifiers ?? (config.mode === 'production' ? 'short' : 'debug'),
//         serializeVirtualCssPath: async ({ fileScope, source }) => {
//           const rootRelativeId = `${fileScope.filePath}${virtualExt}`
//           const absoluteId = getAbsoluteVirtualFileId(rootRelativeId)

//           let cssSource = source

//           if (postCssConfig) {
//             const postCssResult = await (await import('postcss'))
//               .default(postCssConfig.plugins)
//               .process(source, {
//                 ...postCssConfig.options,
//                 from: undefined,
//                 map: false,
//               })

//             cssSource = postCssResult.css
//           }

//           if (server && cssMap.has(absoluteId) && cssMap.get(absoluteId) !== source) {
//             const { moduleGraph } = server
//             const module = moduleGraph.getModuleById(absoluteId)

//             if (module) {
//               moduleGraph.invalidateModule(module)
//             }

//             server.ws.send({
//               type: 'custom',
//               event: styleUpdateEvent(absoluteId),
//               data: cssSource,
//             })
//           }

//           cssMap.set(absoluteId, cssSource)

//           // We use the root relative id here to ensure file contents (content-hashes)
//           // are consistent across build machines
//           return `import "${rootRelativeId}";`
//         },
//       })

//       return {
//         code: output,
//         map: { mappings: '' },
//       }
//     },
//   }
// }
