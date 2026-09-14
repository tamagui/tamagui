const path = require('node:path')
const { getDefaultConfig } = require('metro-config')
const { withTamagui } = require('@tamagui/metro-plugin')

const repoRoot = path.resolve(__dirname, '../../..')

/**
 * The zero-runtime Metro web bundle. `TAMAGUI_ZERO_ISLAND` switches the same
 * config to the island's own bundle request, which keeps the full runtime.
 */
module.exports = (async () => {
  const config = await getDefaultConfig(__dirname)
  config.projectRoot = __dirname
  config.watchFolders = [repoRoot]
  config.resolver.nodeModulesPaths = [
    path.join(__dirname, 'node_modules'),
    path.join(repoRoot, 'node_modules'),
  ]
  config.resolver.sourceExts = [...new Set([...config.resolver.sourceExts, 'mjs'])]
  config.transformer.babelTransformerPath = path.join(
    __dirname,
    'metro-babel-transformer.cjs'
  )
  config.transformer.getTransformOptions = async () => ({
    transform: { experimentalImportSupport: true, inlineRequires: false },
  })

  // its own publish directory: Next serves `public/`, and two integrations
  // writing one artifact would let whichever built last decide what the other's
  // assertions read
  const island = process.env.TAMAGUI_ZERO_ISLAND
  return withTamagui(config, {
    zeroPublicDir: 'public-metro',
    ...(island && { zeroIslandBuild: island }),
  })
})()
