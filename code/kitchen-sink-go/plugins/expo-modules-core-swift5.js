// workaround: expo-modules-core 55.x ships with Swift 6 strict concurrency
// which is incompatible with older Xcode versions. this forces Swift 5.10
// compatibility mode on the ExpoModulesCore pod.
const { withDangerousMod } = require('@expo/config-plugins')
const fs = require('fs')
const path = require('path')

module.exports = function withExpoModulesCoreSwift5(config) {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile')
      let podfile = fs.readFileSync(podfilePath, 'utf8')

      const workaround = `
    # workaround: expo-modules-core 55.x Swift 6 strict concurrency
    installer.pods_project.targets.each do |target|
      if target.name == 'ExpoModulesCore'
        target.build_configurations.each do |build_config|
          build_config.build_settings['SWIFT_VERSION'] = '5.10'
          build_config.build_settings['SWIFT_STRICT_CONCURRENCY'] = 'minimal'
          build_config.build_settings['SWIFT_COMPILATION_MODE'] = 'singlefile'
        end
      end
    end
`
      // insert before the closing `end` of post_install block
      podfile = podfile.replace(
        /(post_install do \|installer\|.*?)(^\s+end\s*\nend)/ms,
        `$1${workaround}$2`
      )

      fs.writeFileSync(podfilePath, podfile)
      return config
    },
  ])
}
