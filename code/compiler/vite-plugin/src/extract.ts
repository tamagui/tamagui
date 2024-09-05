// fork from https://github.com/seek-oss/vanilla-extract

import type { TamaguiOptions } from '@tamagui/static'
import path from 'node:path'
import type { Plugin, ResolvedConfig, ViteDevServer } from 'vite'
import { normalizePath, type Environment } from 'vite'

// some sort of weird esm compat

const styleUpdateEvent = (fileId: string) => `tamagui-style-update:${fileId}`

export function tamaguiExtractPlugin(optionsIn?: Partial<TamaguiOptions>): Plugin {
  if (optionsIn?.disable) {
    return {
      name: 'tamagui-extract',
    }
  }

  let extractor: ReturnType<typeof Static.createExtractor> | null = null
  const cssMap = new Map<string, string>()

  let config: ResolvedConfig
  let tamaguiOptions: TamaguiOptions
  let server: ViteDevServer
  let virtualExt: string
  let disableStatic = false

  const getAbsoluteVirtualFileId = (filePath: string) => {
    if (filePath.startsWith(config.root)) {
      return filePath
    }
    return normalizePath(path.join(config.root, filePath))
  }

  function isVite6AndNotClient(environment?: Environment) {
    return environment?.name && environment.name !== 'client'
  }

  let Static

  async function loadTamaguiBuildConfig() {
    if (!extractor) {
      Static = (await import('@tamagui/static')).default
      tamaguiOptions = Static.loadTamaguiBuildConfigSync({
        ...optionsIn,
        platform: 'web',
      })
      disableStatic = Boolean(tamaguiOptions.disable)
      extractor = Static.createExtractor({
        logger: config.logger,
      })
      await extractor!.loadTamagui({
        components: ['tamagui'],
        platform: 'web',
        ...tamaguiOptions,
      } satisfies TamaguiOptions)
    }
  }

  return {
    name: 'tamagui-extract',
    enforce: 'pre',

    configureServer(_server) {
      server = _server
    },

    buildEnd() {
      extractor?.cleanupBeforeExit()
    },

    config(userConf) {
      userConf.optimizeDeps ||= {}
      userConf.optimizeDeps.include ||= []
      userConf.optimizeDeps.include.push('@tamagui/core/inject-styles')
    },

    async configResolved(resolvedConfig) {
      if (extractor) {
        return
      }
      config = resolvedConfig
      virtualExt = `.tamagui.css`
    },

    async resolveId(source) {
      // lazy load, vite for some reason runs plugins twice in some esm compat thing
      await loadTamaguiBuildConfig()

      if (
        tamaguiOptions?.disableServerOptimization &&
        isVite6AndNotClient(this.environment)
      ) {
        // only optimize on client - server should produce identical styles anyway!
        return
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

    async load(id) {
      await loadTamaguiBuildConfig()

      if (disableStatic) {
        // only optimize on client - server should produce identical styles anyway!
        return
      }
      if (
        tamaguiOptions?.disableServerOptimization &&
        isVite6AndNotClient(this.environment)
      ) {
        return
      }
      const [validId] = id.split('?')
      return cssMap.get(validId)
    },

    async transform(code, id, ssrParam) {
      if (disableStatic) {
        // only optimize on client - server should produce identical styles anyway!
        return
      }
      if (
        tamaguiOptions?.disableServerOptimization &&
        isVite6AndNotClient(this.environment)
      ) {
        return
      }

      const [validId] = id.split('?')
      if (!validId.endsWith('.tsx')) {
        return
      }

      const firstCommentIndex = code.indexOf('// ')
      const { shouldDisable, shouldPrintDebug } = Static.getPragmaOptions({
        source: firstCommentIndex >= 0 ? code.slice(firstCommentIndex) : '',
        path: validId,
      })

      if (shouldPrintDebug) {
        console.trace(`Debugging file: ${id} in environment: ${this.environment?.name}`)
        console.info(`\n\nOriginal source:\n${code}\n\n`)
      }

      if (shouldDisable) {
        return
      }

      const extracted = await Static.extractToClassNames({
        extractor: extractor!,
        source: code,
        sourcePath: validId,
        options: tamaguiOptions,
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
    },
  }
}
