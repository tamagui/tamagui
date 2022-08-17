import path from 'path'

import MagicString from 'magic-string'
import type { Plugin, ResolvedConfig } from 'vite'

import { UNAGI_DEFAULT_SERVER_ENTRY } from './virtualFilesPlugin.js'

const cssModuleRE = /\.module\.(s?css|sass|less|stylus)/

export default function cssModulesRsc() {
  // 1. Original CSS module: `.myStyle { color: red; }`
  // 2. CSS module after 'pre' Vite transforms: `.myStyle_hashedXYZ { color: red; }`
  // 3. CSS module after 'post' Vite transforms: `export const myStyle = 'myStyle_hashedXYZ';`

  let cssMap = new Map()
  let config: ResolvedConfig

  return [
    {
      name: 'css-modules-rsc',
      configResolved(_config) {
        config = _config
        cssMap = new Map()

        // Place this plugin before react-refresh to
        // modify files before JSX is compiled.
        // @ts-ignore
        config.plugins.unshift(autoStyleTagPlugin())
      },
      transform(code, id) {
        if (cssModuleRE.test(id)) {
          cssMap.set(id, code)
        }
      },
    },
    {
      name: 'css-modules-rsc-post',
      enforce: 'post',
      transform(code, id) {
        if (id.includes('.module.') && cssMap.has(id)) {
          const isDev = config.command === 'serve'
          const key = path.relative(config.root, id.split('?')[0])
          const s = new MagicString(code)
          s.prepend(
            (isDev
              ? `import {jsxDEV as _jsx} from 'react/jsx-dev-runtime';`
              : `import {jsx as _jsx} from 'react/jsx-runtime';`) +
              `export const StyleTag = () => _jsx('style', {dangerouslySetInnerHTML: {__html: ${JSON.stringify(
                cssMap.get(id)
              )}}});` +
              `\nStyleTag.key = '${key}';\n`
          )

          s.replace(/export default \{/gs, `export default {\n  StyleTag,`)

          return {
            code: s.toString(),
            map: s.generateMap({ file: id, source: id }),
          }
        }
      },
    },
  ] as Plugin[]
}

function autoStyleTagPlugin() {
  return {
    name: 'css-modules-auto-style-tag',
    transform(code, id) {
      id = id.split('?')[0]

      if (
        /\.[jt]sx$/.test(id) &&
        !id.endsWith(UNAGI_DEFAULT_SERVER_ENTRY) &&
        !id.endsWith(
          path.format({
            name: UNAGI_DEFAULT_SERVER_ENTRY,
            ext: path.extname(id),
          })
        ) &&
        cssModuleRE.test(code) &&
        code.includes('export default')
      ) {
        const s = new MagicString(code)

        // 1. Gather style tags in an array
        let styleCount = 0
        s.prepend(`const __styleTags = [];\n`)
        s.replace(
          /^import\s+(.+?)\s+from\s+['"]([^'"]+?\.module\.[^'"]+?)['"]/gm,
          (all, statements, from) => {
            if (!cssModuleRE.test(from)) {
              return all
            }

            if (statements.startsWith('{')) {
              // Add default import
              const replacement = `__style${styleCount++}, {`
              statements = statements.replace('{', replacement)
              all = all.replace('{', replacement)
            }

            const defaultImport = statements
              .split(',')[0]
              .replace(/\*\s+as\s+/, '')
              .trim()

            return all + `; __styleTags.push(${defaultImport}.StyleTag)`
          }
        )

        // 2. Wrap default export in a new component that includes the style tags
        s.replace(/export default/gm, 'const __defaultExport = ')
        s.append(
          `\nconst __ApplyStyleTags = function (props) {\n` +
            `  return <>{__styleTags.map(ST => <ST key={ST.key} />)}<__defaultExport {...props} /></>;` +
            `\n}\n\n` +
            `Object.defineProperty(__ApplyStyleTags, 'name', {value: 'ApplyStyleTags_' + (__defaultExport.name || '')});\n` +
            `export default __ApplyStyleTags;`
        )

        return {
          code: s.toString(),
          map: s.generateMap({ file: id, source: id }),
        }
      }
    },
  } as Plugin
}
