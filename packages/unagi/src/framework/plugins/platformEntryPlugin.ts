import fs from 'fs'
import path from 'path'

import fastGlob from 'fast-glob'
import MagicString from 'magic-string'
import { Plugin, ResolvedConfig, normalizePath } from 'vite'

import { isVite3 } from '../../utilities/vite.js'
import { UNAGI_DEFAULT_SERVER_ENTRY } from './virtualFilesPlugin'

const SSR_BUNDLE_NAME = 'index.js'

// Keep this in the outer scope to share it
// across client <> server builds.
let clientBuildPath: string

export default () => {
  let config: ResolvedConfig
  let isESM: boolean

  return {
    name: 'unagi:platform-entry',
    enforce: 'pre',
    configResolved(_config) {
      config = _config

      if (config.build.ssr) {
        const { output = {} } = config.build.rollupOptions || {}
        const { format = isVite3 ? 'es' : '' } = (Array.isArray(output) ? output[0] : output) || {}

        isESM = Boolean(process.env.WORKER) || ['es', 'esm'].includes(format)
      }
    },
    resolveId(source, importer) {
      if (normalizePath(source).includes('/unagi/platforms/')) {
        const unagiPath = path.dirname(require.resolve('@tamagui/unagi/package.json'))
        const platformEntryName = source.split(path.sep).pop() || ''
        const platformEntryPath = path.resolve(
          unagiPath,
          'dist',
          'esm',
          'platforms',
          platformEntryName
        )

        return this.resolve(platformEntryPath, importer, {
          skipSelf: true,
        })
      }

      return null
    },
    async transform(code, id, options) {
      if (
        config.command === 'build' &&
        options?.ssr &&
        // WARN 🛑 i changed this to work in monorepo, but in general should add @tamagui/ in front of regex
        /\/unagi\/.+platforms\/virtual\./.test(normalizePath(id))
      ) {
        const ms = new MagicString(code)

        ms.replace('__UNAGI_ENTRY__', UNAGI_DEFAULT_SERVER_ENTRY)

        if (!clientBuildPath) {
          // Default value
          clientBuildPath = normalizePath(
            path.resolve(config.root, config.build.outDir, '..', 'client')
          )
        }

        ms.replace(
          '__UNAGI_HTML_TEMPLATE__',
          normalizePath(path.resolve(clientBuildPath, 'index.html'))
        )

        ms.replace(
          '__UNAGI_RELATIVE_CLIENT_BUILD__',
          normalizePath(
            path.relative(
              normalizePath(path.resolve(config.root, config.build.outDir)),
              clientBuildPath
            )
          )
        )

        const files = clientBuildPath
          ? (
              await fastGlob('**/*', {
                cwd: clientBuildPath,
                ignore: ['**/index.html', `**/${config.build.assetsDir}/**`],
              })
            ).map((file) => '/' + file)
          : []

        ms.replace("\\['__UNAGI_ASSETS__'\\]", JSON.stringify(files))
        ms.replace('__UNAGI_ASSETS_DIR__', config.build.assetsDir)
        ms.replace(
          '__UNAGI_ASSETS_BASE_URL__',
          (process.env.UNAGI_ASSET_BASE_URL || '').replace(/\/$/, '')
        )

        // Remove the poison pill
        ms.replace('throw', '//')

        return {
          code: ms.toString(),
          map: ms.generateMap({ file: id, source: id }),
        }
      }
    },
    buildEnd(err) {
      if (!err && !config.build.ssr && config.command === 'build') {
        // Save outDir from client build in the outer scope in order
        // to read it during the server build. The CLI runs Vite in
        // the same process so the scope is shared across builds.
        clientBuildPath = normalizePath(path.resolve(config.root, config.build.outDir))
      }
    },
    generateBundle(options, bundle) {
      if (config.build.ssr) {
        const [key, value] = Object.entries(bundle).find(
          ([, value]) => value.type === 'chunk' && value.isEntry
        )!

        delete bundle[key]
        value.fileName = SSR_BUNDLE_NAME
        bundle[SSR_BUNDLE_NAME] = value

        // This ensures the file has a proper
        // default export instead of exporting an
        // object containing a 'default' property.
        if (value.type === 'chunk' && !isESM) {
          value.code += `\nmodule.exports = exports.default || exports;`
        }
      }
    },
    writeBundle(options) {
      if (config.build.ssr && options.dir) {
        const mainFile = `./${SSR_BUNDLE_NAME}`
        const packageJson = {
          type: isESM ? 'module' : 'commonjs',
          main: mainFile,
          exports: { '.': mainFile, [mainFile]: mainFile },
        }

        fs.writeFileSync(
          path.join(options.dir, 'package.json'),
          JSON.stringify(packageJson, null, 2),
          'utf-8'
        )
      }
    },
  } as Plugin
}
