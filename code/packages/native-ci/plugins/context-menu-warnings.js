const { withDangerousMod } = require('@expo/config-plugins')
const fs = require('fs')
const path = require('path')

module.exports = function withContextMenuWarnings(config) {
  return withDangerousMod(config, [
    'ios',
    async (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, 'Podfile')

      if (!fs.existsSync(podfilePath)) {
        return config
      }

      const podfile = fs.readFileSync(podfilePath, 'utf8')

      if (podfile.includes("target.name == 'ContextMenuAuxiliaryPreview'")) {
        return config
      }

      const workaround = `
    # the ContextMenuAuxiliaryPreview pod uses deprecated transform: .default,
    # which is an error in Xcode 26 / Swift 6.2 strict mode.
    installer.pods_project.targets.each do |target|
      if target.name == 'ContextMenuAuxiliaryPreview'
        target.build_configurations.each do |build_config|
          build_config.build_settings['SWIFT_TREAT_WARNINGS_AS_ERRORS'] = 'NO'
          build_config.build_settings['GCC_TREAT_WARNINGS_AS_ERRORS'] = 'NO'
        end
      end
    end
`
      const updated = podfile.replace(
        /(post_install do \|installer\|.*?)(^\s+end\s*\nend)/ms,
        `$1${workaround}$2`
      )

      if (updated === podfile) {
        throw new Error('could not find the post_install block in the generated Podfile')
      }

      fs.writeFileSync(podfilePath, updated)
      console.log('[context-menu-warnings] updated the generated Podfile')
      return config
    },
  ])
}
