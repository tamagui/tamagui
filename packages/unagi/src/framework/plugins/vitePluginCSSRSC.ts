import path from 'path'

import MagicString from 'magic-string'
import { HtmlTagDescriptor, Plugin, ResolvedConfig, normalizePath } from 'vite'

const VITE_CSS_CHUNK_NAME = 'style.css'
const INJECT_STYLES_COMMENT = '<!--__INJECT_STYLES__-->'

// Keep this in the outer scope to share it
// across client <> server builds.
let clientBuildPath: string

export default function cssRsc() {
  let config: ResolvedConfig

  return {
    name: 'hydrogen:css-rsc',
    enforce: 'post',
    config() {
      // Disable CSS code split to avoid preloading styles
      // that are already included in index.html
      return { build: { cssCodeSplit: false } }
    },
    configResolved(_config) {
      config = _config
    },
    transform(code, id, options) {
      if (options?.ssr && id.includes('index.html?raw')) {
        // Mark the client build index.html to inject styles later
        const s = new MagicString(code)
        s.replace('</head>', INJECT_STYLES_COMMENT + '</head>')

        return {
          code: s.toString(),
          map: s.generateMap({ file: id, source: id }),
        }
      }
    },
    transformIndexHtml(html, { server }) {
      // Add discovered styles during dev
      if (server) {
        const tags = [] as HtmlTagDescriptor[]

        const foundCssFiles = new Set<string>()

        for (const [key, value] of server.moduleGraph.idToModuleMap.entries()) {
          if (
            // Note: Some CSS-in-JS libraries use `.css.js`
            // extension and we should match it here:
            /\.(css|sass|scss|stylus|less)(\.|\?|$)/.test(normalizePath(key).split('/').pop()!)
          ) {
            let { url, file, lastHMRTimestamp, importers } = value

            if (
              !foundCssFiles.has(file!) &&
              !Array.from(importers).some((importer) => foundCssFiles.has(importer.file!))
            ) {
              foundCssFiles.add(file!)

              // Vite is adding hash and timestamp to the CSS files downloaded
              // from client components. Adding the same query string params
              // here prevents this file from being downloaded twice.
              if (lastHMRTimestamp) {
                const timestampQuery = `?t=${lastHMRTimestamp}`
                // The timestamp needs to be the first query string param.
                url = url.includes('?')
                  ? url.replace('?', timestampQuery + '&')
                  : url + timestampQuery
              }

              tags.push(
                value.type === 'css'
                  ? { tag: 'link', attrs: { rel: 'stylesheet', href: url } }
                  : { tag: 'script', attrs: { type: 'module', src: url } }
              )
            }
          }
        }

        return tags
      }
    },
    generateBundle(options, bundle, isWrite) {
      type OutputChunk = Extract<typeof bundle[0], { type: 'chunk' }>
      type OutputAsset = Extract<typeof bundle[0], { type: 'asset' }>

      if (config.build?.ssr) {
        // -- Server build

        if (!clientBuildPath) {
          // Default value
          clientBuildPath = normalizePath(
            path.resolve(config.root, config.build.outDir, '..', 'client')
          )
        }

        const relativeClientPath = normalizePath(
          path.relative(
            normalizePath(path.resolve(config.root, config.build.outDir)),
            clientBuildPath
          )
        )

        let cssAssetFileName = ''
        const cssAsset = Object.values(bundle).find(
          (file) => file.type === 'asset' && file.name === VITE_CSS_CHUNK_NAME
        ) as OutputAsset | undefined
        const outputChunk = Object.values(bundle).find(
          (file) => file.type === 'chunk' && file.isEntry
        ) as OutputChunk

        if (cssAsset) {
          cssAssetFileName = cssAsset.fileName
          // Move the CSS file to the client build assets
          cssAsset.fileName = normalizePath(path.join(relativeClientPath, cssAsset.fileName))
        }

        let assetPrefix = process.env.HYDROGEN_ASSET_BASE_URL || '/'
        if (!assetPrefix.endsWith('/')) assetPrefix += '/'

        // Add a reference to the CSS file in indexTemplate
        outputChunk.code = outputChunk.code.replace(
          INJECT_STYLES_COMMENT,
          cssAssetFileName && `<link rel="stylesheet" href="${assetPrefix + cssAssetFileName}">`
        )
      } else {
        // -- Client build

        // Save outDir from client build in the outer scope
        // to read it during the server build. The CLI runs Vite in
        // the same process so the scope is shared across builds.
        clientBuildPath = normalizePath(path.resolve(config.root, config.build.outDir))

        const indexHtml = bundle['index.html'] as OutputAsset
        const cssAsset = Object.values(bundle).find(
          (file) => file.type === 'asset' && file.name === VITE_CSS_CHUNK_NAME
        ) as OutputAsset | undefined

        if (cssAsset) {
          // The client build CSS is incomplete because it only includes
          // CSS imported in client components (server components are not
          // discovered in this build). Remove it from this build and
          // let it be added by the server build after this.
          delete bundle[cssAsset.fileName]
          indexHtml.source = (indexHtml.source as string).replace(
            new RegExp(`\\s*<link[^<>]+${cssAsset.fileName.replace('.', '\\.')}.*?>`, ''),
            ''
          )
        }
      }
    },
  } as Plugin
}
