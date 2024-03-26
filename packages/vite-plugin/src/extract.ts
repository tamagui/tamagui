// fork from https://github.com/seek-oss/vanilla-extract

import path from 'path'

import type { TamaguiOptions } from '@tamagui/static'
import * as Static from '@tamagui/static'
import outdent from 'outdent'
import type { Plugin, ResolvedConfig, ViteDevServer } from 'vite'
import { normalizePath } from 'vite'

const styleUpdateEvent = (fileId: string) => `tamagui-style-update:${fileId}`
const GLOBAL_CSS_VIRTUAL_PATH = '__tamagui_global_css__.css'

export function tamaguiExtractPlugin(optionsIn?: Partial<TamaguiOptions>): Plugin {
  const options = Static.loadTamaguiBuildConfigSync({
    ...optionsIn,
    platform: 'web',
  })
  const disableStatic =
    options.disable || (options.disableDebugAttr && options.disableExtraction)

  if (disableStatic) {
    return {
      name: 'tamagui-extract',
    }
  }

  let extractor: ReturnType<typeof Static.createExtractor> | null = null
  const cssMap = new Map<string, string>()

  let config: ResolvedConfig
  let server: ViteDevServer
  let shouldReturnCSS = true //config.command === 'serve'
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

    buildEnd() {
      extractor!.cleanupBeforeExit()
    },

    writeBundle(this, options, bundle) {
      setTimeout(() => {
        console.warn('some sort of dangling process or osmethign, exit for now...')
        process.exit(0)
      }, 100)
    },

    config(_userConfig, env) {
      const include = env.command === 'serve' ? ['@tamagui/core/inject-styles'] : []
      return {
        optimizeDeps: { include },
      }
    },

    async configResolved(resolvedConfig) {
      config = resolvedConfig
      extractor = Static.createExtractor({
        logger: resolvedConfig.logger,
      })

      await extractor!.loadTamagui({
        // @ts-ignore
        components: ['tamagui'],
        // @ts-ignore
        platform: 'web',
        ...options,
      })

      shouldReturnCSS = true
      // TODO postcss work with postcss.config.js
      // packageName = getPackageInfo(config.root).name;
      // if (config.command === 'serve') {
      //   postCssConfig = await resolvePostcssConfig(config);
      // }
      virtualExt = `.tamagui.${shouldReturnCSS ? 'css' : 'js'}`
    },

    async resolveId(source) {
      if (source === 'tamagui.css') {
        return GLOBAL_CSS_VIRTUAL_PATH
      }

      const [validId, query] = source.split('?')

      if (!validId.endsWith(virtualExt)) {
        return
      }

      // Absolute paths seem to occur often in monorepos, where files are
      // imported from outside the config root.
      const absoluteId = source.startsWith(config.root)
        ? source
        : getAbsoluteVirtualFileId(validId)

      // There should always be an entry in the `cssMap` here.
      // The only valid scenario for a missing one is if someone had written
      // a file in their app using the .tamagui.js/.tamagui.css extension
      if (cssMap.has(absoluteId)) {
        // Keep the original query string for HMR.
        return absoluteId + (query ? `?${query}` : '')
      }
    },

    /**
     * TODO
     *
     *   mainFields module:jsx breaks, so lets just have a mapping here
     *   where we load() and map it to the jsx path before transform
     *
     */

    load(id, options) {
      const [validId] = id.split('?')

      if (validId === GLOBAL_CSS_VIRTUAL_PATH) {
        return extractor!.getTamagui()!.getCSS()
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
        import { injectStyles } from '@tamagui/core/inject-styles';

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

      const firstCommentIndex = code.indexOf('// ')
      const { shouldDisable, shouldPrintDebug } = Static.getPragmaOptions({
        source: firstCommentIndex >= 0 ? code.slice(firstCommentIndex) : '',
        path: validId,
      })

      if (shouldDisable) {
        return
      }

      const extracted = await Static.extractToClassNames({
        extractor: extractor!,
        source: code,
        sourcePath: validId,
        options,
        shouldPrintDebug,
      })

      if (!extracted) {
        return
      }

      const rootRelativeId = `${validId}${virtualExt}`
      const absoluteId = getAbsoluteVirtualFileId(rootRelativeId)

      let source = extracted.js

      if (extracted.styles) {
        if (
          server &&
          cssMap.has(absoluteId) &&
          cssMap.get(absoluteId) !== extracted.styles
        ) {
          const { moduleGraph } = server
          const [module] = Array.from(moduleGraph.getModulesByFile(absoluteId) || [])

          if (module) {
            moduleGraph.invalidateModule(module)

            // Vite uses this timestamp to add `?t=` query string automatically for HMR.
            module.lastHMRTimestamp =
              (module as any).lastInvalidationTimestamp || Date.now()
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
