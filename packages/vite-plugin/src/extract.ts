// fork from https://github.com/seek-oss/vanilla-extract

import path from 'path'

import { TamaguiOptions, createExtractor, extractToClassNames } from '@tamagui/static'
import outdent from 'outdent'
import type { Plugin, ResolvedConfig, ViteDevServer } from 'vite'
import { normalizePath } from 'vite'

const styleUpdateEvent = (fileId: string) => `tamagui-style-update:${fileId}`

export function tamaguiExtractPlugin(options: TamaguiOptions): Plugin {
  const disableStatic = options.disable || (options.disableDebugAttr && options.disableExtraction)
  const GLOBAL_CSS_VIRTUAL_PATH = '__tamagui_global_css__.css'

  if (disableStatic) {
    return {
      name: 'tamagui-extract',
    }
  }

  let config: ResolvedConfig
  let server: ViteDevServer
  const cssMap = new Map<string, string>()
  let shouldReturnCSS = true //config.command === 'serve'

  process.env.AVOID_ESBUILD_REGISTER = '1'

  const extractor = createExtractor()

  let virtualExt: string

  const getAbsoluteVirtualFileId = (filePath: string) => {
    if (filePath.startsWith(config.root)) {
      return filePath
    }
    return normalizePath(path.join(config.root, filePath))
  }

  return {
    name: 'tamagui-extract',
    enforce: 'pre',

    configureServer(_server) {
      server = _server
    },

    config(_userConfig, env) {
      const include = env.command === 'serve' ? ['@tamagui/core/injectStyles'] : []
      return {
        optimizeDeps: { include },
      }
    },

    async configResolved(resolvedConfig) {
      config = resolvedConfig
      shouldReturnCSS = true
      // packageName = getPackageInfo(config.root).name;
      // if (config.command === 'serve') {
      //   postCssConfig = await resolvePostcssConfig(config);
      // }
      virtualExt = `.tamagui.${shouldReturnCSS ? 'css' : 'js'}`
    },

    async resolveId(source) {
      if (source === 'tamagui.css') {
        await extractor.loadTamagui(options)
        return GLOBAL_CSS_VIRTUAL_PATH
      }

      const [validId, query] = source.split('?')

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

    load(id, options) {
      const [validId] = id.split('?')

      if (validId === GLOBAL_CSS_VIRTUAL_PATH) {
        return extractor.getTamagui()!.getCSS()
      }

      if (!cssMap.has(validId)) {
        return
      }

      const css = cssMap.get(validId)

      if (typeof css !== 'string') {
        return
      }

      if (shouldReturnCSS || !server || server.config.isProduction) {
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
      const [validId] = id.split('?')

      if (!validId.endsWith('.tsx')) {
        return
      }

      let ssr: boolean | undefined
      if (typeof ssrParam === 'boolean') {
        ssr = ssrParam
      } else {
        ssr = ssrParam?.ssr
      }

      const extracted = await extractToClassNames({
        extractor,
        source: code,
        sourcePath: validId,
        options,
        shouldPrintDebug: false,
      })

      if (!extracted) {
        return {
          code,
        }
      }

      const rootRelativeId = `${validId}${virtualExt}`
      const absoluteId = getAbsoluteVirtualFileId(rootRelativeId)

      let source = extracted.js

      if (extracted.styles) {
        if (server && cssMap.has(absoluteId) && cssMap.get(absoluteId) !== extracted.styles) {
          const { moduleGraph } = server
          const [module] = Array.from(moduleGraph.getModulesByFile(absoluteId) || [])

          if (module) {
            moduleGraph.invalidateModule(module)

            // Vite uses this timestamp to add `?t=` query string automatically for HMR.
            module.lastHMRTimestamp = (module as any).lastInvalidationTimestamp || Date.now()
          }

          server.ws.send({
            type: 'custom',
            event: styleUpdateEvent(absoluteId),
            data: extracted.styles,
          })
        }

        source = `${source}\nimport "${rootRelativeId}";`
        cssMap.set(absoluteId, extracted.styles)
      }

      return {
        code: source.toString(),
        map: extracted.map,
      }

      // if (ssr && !process.env.VITE_RSC_BUILD) {
      //   return addFileScope({
      //     source: code,
      //     filePath: normalizePath(validId),
      //     rootPath: config.root,
      //     packageName,
      //   })
      // }

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
    },
  }
}
