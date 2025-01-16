// fork from https://github.com/seek-oss/vanilla-extract

import type { TamaguiOptions } from '@tamagui/static'
import path from 'node:path'
import type { Plugin, ResolvedConfig, ViteDevServer } from 'vite'
import { normalizePath, type Environment } from 'vite'
import {
  Static,
  disableStatic,
  extractor,
  loadTamaguiBuildConfig,
  tamaguiOptions,
} from './loadTamagui'

export function tamaguiExtractPlugin(optionsIn?: Partial<TamaguiOptions>): Plugin {
  if (optionsIn?.disable) {
    return {
      name: 'tamagui-extract',
    }
  }

  const cssMap = new Map<string, string>()

  let config: ResolvedConfig
  let server: ViteDevServer
  const virtualExt = `.tamagui.css`

  const getAbsoluteVirtualFileId = (filePath: string) => {
    if (filePath.startsWith(config.root)) {
      return filePath
    }
    return normalizePath(path.join(config.root, filePath))
  }

  function isVite6AndNotClient(environment?: Environment) {
    return environment?.name && environment.name !== 'client'
  }

  function isVite6Native(environment?: Environment) {
    return (
      environment?.name && (environment.name === 'ios' || environment.name === 'android')
    )
  }

  function invalidateModule(absoluteId: string) {
    if (!server) return

    const { moduleGraph } = server
    const modules = moduleGraph.getModulesByFile(absoluteId)

    if (modules) {
      for (const module of modules) {
        moduleGraph.invalidateModule(module)

        // Vite uses this timestamp to add `?t=` query string automatically for HMR.
        module.lastHMRTimestamp = module.lastInvalidationTimestamp || Date.now()
      }
    }
  }

  return {
    name: 'tamagui-extract',
    enforce: 'pre',

    configureServer(_server) {
      server = _server
    },

    async buildStart() {
      await loadTamaguiBuildConfig(optionsIn)
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
      config = resolvedConfig
    },

    async resolveId(source) {
      if (isVite6Native(this.environment)) {
        return
      }

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
      if (disableStatic) {
        // only optimize on client - server should produce identical styles anyway!
        return
      }
      if (isVite6Native(this.environment)) {
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
      if (isVite6Native(this.environment)) {
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
      const { shouldDisable, shouldPrintDebug } = Static!.getPragmaOptions({
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

      const extracted = await Static!.extractToClassNames({
        extractor: extractor!,
        source: code,
        sourcePath: validId,
        options: tamaguiOptions!,
        shouldPrintDebug,
      })

      if (!extracted) {
        return
      }

      const rootRelativeId = `${validId}${virtualExt}`
      const absoluteId = getAbsoluteVirtualFileId(rootRelativeId)

      let source = extracted.js

      if (extracted.styles) {
        this.addWatchFile(rootRelativeId)

        if (server && cssMap.has(absoluteId)) {
          invalidateModule(rootRelativeId)
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
