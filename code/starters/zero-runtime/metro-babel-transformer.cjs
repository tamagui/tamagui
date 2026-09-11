'use strict'
const { parseSync, transformFromAstSync } = require('@babel/core')
const { getCacheKey: metroCacheKey } = require('metro-cache-key')

/**
 * The starter's Metro Babel transformer.
 *
 * It carries its presets inline instead of a root babel config: a root
 * `babel.config.*` would also switch this project's Next build off SWC and onto
 * its Babel loader. Modules are deliberately left as ESM so Metro's own
 * `experimentalImportSupport` handles them and the Tamagui compiler can link
 * imports.
 */
const presets = [
  [require.resolve('@babel/preset-react'), { runtime: 'automatic' }],
  [require.resolve('@babel/preset-typescript'), { isTSX: true, allExtensions: true }],
]

exports.transform = function transform({ filename, options, plugins, src }) {
  const babelConfig = {
    ast: true,
    babelrc: false,
    configFile: false,
    presets,
    caller: { bundler: 'metro', name: 'metro', platform: options.platform },
    cloneInputAst: false,
    code: false,
    cwd: options.projectRoot,
    filename,
    plugins,
    sourceType: 'module',
  }
  const sourceAst = parseSync(src, babelConfig)
  const result = transformFromAstSync(sourceAst, src, babelConfig)
  return { ast: result.ast, metadata: result.metadata }
}

exports.getCacheKey = function getCacheKey() {
  return metroCacheKey([__filename])
}
