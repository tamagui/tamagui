// fork from https://github.com/seek-oss/vanilla-extract

import path from 'path'

import type { TamaguiOptions } from '@tamagui/static'
import outdent from 'outdent'
import type { Plugin, ResolvedConfig, ViteDevServer } from 'vite'
import { normalizePath } from 'vite'

const styleUpdateEvent = (fileId: string) => `tamagui-style-update:${fileId}`

export function tamaguiExtractPlugin(options: TamaguiOptions): Plugin {
  let config: ResolvedConfig
  let server: ViteDevServer
  const cssMap = new Map<string, string>()

  let virtualExt: string
  // let packageName: string;

  const getAbsoluteVirtualFileId = (source: string) => normalizePath(path.join(config.root, source))

  return {
    name: 'tamagui-extract',
    enforce: 'pre',

    configureServer(_server) {
      server = _server
    },

    config(_userConfig, env) {
      console.log('wtf')
      const include = env.command === 'serve' ? ['@tamagui/core/injectStyles'] : []
      return {
        optimizeDeps: { include },
        // ssr: {
        //   external: [
        //     '@tamagui-extract/css',
        //     '@tamagui-extract/css/fileScope',
        //     '@tamagui-extract/css/adapter',
        //   ],
        // },
      }
    },

    async configResolved(resolvedConfig) {
      config = resolvedConfig
      // packageName = getPackageInfo(config.root).name;
      // if (config.command === 'serve') {
      //   postCssConfig = await resolvePostcssConfig(config);
      // }
      virtualExt = `.tamagui.${config.command === 'serve' ? 'js' : 'css'}`
    },

    resolveId(source) {
      const [validId, query] = source.split('?')
      console.log('resolve')

      if (!validId.endsWith(virtualExt)) {
        return
      }

      // Absolute paths seem to occur often in monorepos, where files are
      // imported from outside the config root.
      const absoluteId = source.startsWith(config.root) ? source : getAbsoluteVirtualFileId(validId)

      // There should always be an entry in the `cssMap` here.
      // The only valid scenario for a missing one is if someone had written
      // a file in their app using the .tamagui.js/.tamagui.css extension
      if (cssMap.has(absoluteId)) {
        // Keep the original query string for HMR.
        return absoluteId + (query ? `?${query}` : '')
      }
    },

    load(id) {
      const [validId] = id.split('?')
      console.log('load')

      if (!cssMap.has(validId)) {
        return
      }

      const css = cssMap.get(validId)

      if (typeof css !== 'string') {
        return
      }

      if (!server || server.config.isProduction) {
        return css
      }

      return outdent`
        import { injectStyles } from '@tamagui/core/injectStyles';

        const inject = (css) => injectStyles({
          filePath: "${validId}",
          css
        });

        inject(${JSON.stringify(css)});

        if (import.meta.hot) {
          import.meta.hot.on('${styleUpdateEvent(validId)}', (css) => {
            inject(css);
          });
        }
      `
    },
    async transform(code, id, ssrParam) {
      console.log('trnasfomr', code)

      const [validId] = id.split('?')

      let ssr: boolean | undefined
      if (typeof ssrParam === 'boolean') {
        ssr = ssrParam
      } else {
        ssr = ssrParam?.ssr
      }

      console.log('process.env.VITE_RSC_BUILD', process.env.VITE_RSC_BUILD)

      if (ssr && !process.env.VITE_RSC_BUILD) {
        // return addFileScope({
        //   source: code,
        //   filePath: normalizePath(validId),
        //   rootPath: config.root,
        //   packageName,
        // })
      }

      // const { source, watchFiles } = await compile({
      //   filePath: validId,
      //   cwd: config.root,
      //   esbuildOptions,
      // })

      // for (const file of watchFiles) {
      //   // In start mode, we need to prevent the file from rewatching itself.
      //   // If it's a `build --watch`, it needs to watch everything.
      //   if (config.command === 'build' || file !== validId) {
      //     this.addWatchFile(file)
      //   }
      // }

      // const output = await processTamaguiFile({
      //   source,
      //   filePath: validId,
      //   identOption: identifiers ?? (config.mode === 'production' ? 'short' : 'debug'),
      //   serializeVirtualCssPath: async ({ fileScope, source }) => {
      //     const rootRelativeId = `${fileScope.filePath}${virtualExt}`
      //     const absoluteId = getAbsoluteVirtualFileId(rootRelativeId)

      //     let cssSource = source

      //     if (server && cssMap.has(absoluteId) && cssMap.get(absoluteId) !== source) {
      //       const { moduleGraph } = server
      //       const [module] = Array.from(moduleGraph.getModulesByFile(absoluteId) || [])

      //       if (module) {
      //         moduleGraph.invalidateModule(module)

      //         // Vite uses this timestamp to add `?t=` query string automatically for HMR.
      //         module.lastHMRTimestamp = (module as any).lastInvalidationTimestamp || Date.now()
      //       }

      //       server.ws.send({
      //         type: 'custom',
      //         event: styleUpdateEvent(absoluteId),
      //         data: cssSource,
      //       })
      //     }

      //     cssMap.set(absoluteId, cssSource)

      //     // We use the root relative id here to ensure file contents (content-hashes)
      //     // are consistent across build machines
      //     return `import "${rootRelativeId}";`
      //   },
      // })

      // return {
      //   code: output,
      //   map: { mappings: '' },
      // }
    },
  }
}
