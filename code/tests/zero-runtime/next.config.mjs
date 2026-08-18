import { withTamagui } from '@tamagui/next-plugin'
import { unlinkSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

// One Next project, several tiers. `pageExtensions` selects which pages belong
// to the build and `distDir` keeps each tier's output to itself, so a zero build
// and a compiled-global-CSS build never decide what the other's assertions read.
const fixture = process.env.TAMAGUI_ZERO_FIXTURE || 'zero'

const pageSuffix =
  fixture === 'zero' ? 'zero' : fixture === 'global-unimported' ? fixture : 'global'

const artifact = fileURLToPath(
  new URL('.tamagui/global/tamagui-global.css', import.meta.url)
)

/**
 * The adversary for the missing and stale controls.
 *
 * It puts the build into the exact state the artifact-ownership check exists to
 * catch, after the artifact has been generated and before the check runs on
 * afterEmit. Both states are reachable in a real project.
 */
class ArtifactAdversary {
  constructor(mode) {
    this.mode = mode
  }
  apply(compiler) {
    compiler.hooks.emit.tap('ArtifactAdversary', () => {
      if (this.mode === 'missing') unlinkSync(artifact)
      else writeFileSync(artifact, ':root{--fixture-stale:1}\n')
    })
  }
}

const adversaryMode =
  fixture === 'global-missing' ? 'missing' : fixture === 'global-stale' ? 'stale' : null

export default withTamagui({
  // see tamagui.build.ts
})({
  reactStrictMode: false,
  distDir: fixture === 'zero' ? '.next' : `.next-${fixture}`,
  pageExtensions: [`${pageSuffix}.tsx`],
  typescript: { ignoreBuildErrors: true },
  webpack: (config, { isServer }) => {
    if (adversaryMode && !isServer)
      config.plugins.push(new ArtifactAdversary(adversaryMode))
    return config
  },
})
