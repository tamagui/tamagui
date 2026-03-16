// workaround: expo-modules-core 55.x ships Swift 6 strict concurrency
// which requires SWIFT_VERSION=6 to compile (uses @MainActor in conformance clauses).
// SWIFT_STRICT_CONCURRENCY=minimal suppresses the resulting concurrency warnings
// that would otherwise become errors in swift 6 mode.
const { withDangerousMod } = require('@expo/config-plugins')
const fs = require('fs')
const path = require('path')

module.exports = function withExpoModulesCoreSwift6(config) {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile')

      // the Podfile may not exist yet during early prebuild phases - skip if so
      if (!fs.existsSync(podfilePath)) {
        return config
      }

      let podfile = fs.readFileSync(podfilePath, 'utf8')

      // avoid double-injection
      if (podfile.includes('# workaround: expo-modules-core 55.x')) {
        return config
      }

      const workaround = `
    # workaround: expo-modules-core 55.x requires Swift 6 mode for @MainActor
    # conformance isolation syntax. SWIFT_STRICT_CONCURRENCY=minimal suppresses
    # the concurrency warnings that come with swift 6 strict mode.
    installer.pods_project.targets.each do |target|
      if target.name == 'ExpoModulesCore'
        target.build_configurations.each do |build_config|
          build_config.build_settings['SWIFT_VERSION'] = '6'
          build_config.build_settings['SWIFT_STRICT_CONCURRENCY'] = 'minimal'
        end
      end
    end
`
      // insert before the closing `end` of post_install block
      const updated = podfile.replace(
        /(post_install do \|installer\|.*?)(^\s+end\s*\nend)/ms,
        `$1${workaround}$2`
      )

      if (updated === podfile) {
        console.warn('[expo-modules-core-swift6] WARNING: could not find post_install block in Podfile - workaround not applied')
      } else {
        console.log('[expo-modules-core-swift6] applied ExpoModulesCore Swift 6 workaround to Podfile')
      }

      fs.writeFileSync(podfilePath, updated)
      return config
    },
  ])
}
